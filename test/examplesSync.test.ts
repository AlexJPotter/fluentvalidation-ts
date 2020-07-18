import { Validator } from '../src/index';

describe('examples (sync)', () => {
  it('custom rules', () => {
    type ClothesPile = {
      numberOfSocks: number;
    };

    const beAnEvenInteger = (value: number) => value % 2 === 0;

    class ClothesPileValidator extends Validator<ClothesPile> {
      constructor() {
        super();

        this.ruleFor('numberOfSocks')
          .must(beAnEvenInteger)
          .withMessage(`Can't have odd socks!`);
      }
    }

    const validator = new ClothesPileValidator();

    expect(validator.validate({ numberOfSocks: 3 })).toEqual({
      numberOfSocks: `Can't have odd socks!`,
    });
  });

  it('deeply nested types', () => {
    type Person = {
      name: string;
      age: number;
      favouriteBand: Band;
      leastFavouriteBand?: Band;
    };

    type Band = {
      name: string;
      debutAlbum: Album;
      currentAlbum: Album | null;
      allAlbumNames: Array<string>;
    };

    type Album = {
      name: string;
      numberOfTracks: number;
      rating?: number;
    };

    class AlbumValidator extends Validator<Album> {
      constructor() {
        super();
        this.ruleFor('name').notEmpty();
        this.ruleFor('numberOfTracks').greaterThan(0);
        this.ruleFor('rating')
          .inclusiveBetween(1, 5)
          .must(
            (rating: number | undefined) => rating == null || rating % 1 === 0
          )
          .withMessage('Rating must be an integer')
          .when((c) => c.rating != null);
      }
    }

    class BandValidator extends Validator<Band> {
      constructor() {
        super();
        this.ruleFor('name').notEmpty();
        this.ruleFor('debutAlbum')
          .setValidator(() => new AlbumValidator())
          .must(
            (value: Album, model: Band) =>
              model.allAlbumNames.indexOf(value.name) !== -1
          )
          .withMessage(
            'Name of debut album was not present in list of all album names'
          );
        this.ruleForEach('allAlbumNames').notEmpty();
        this.ruleFor('currentAlbum')
          .setValidator(() => new AlbumValidator())
          .must(
            (value: Album | null, model: Band) =>
              value == null || model.allAlbumNames.indexOf(value.name) !== -1
          )
          .withMessage(
            'Name of current album was not present in list of all album names'
          )
          .unless((c) => c.currentAlbum == null);
      }
    }

    class PersonValidator extends Validator<Person> {
      constructor() {
        super();
        this.ruleFor('name').notEmpty();
        this.ruleFor('age').greaterThanOrEqualTo(18);
        this.ruleFor('favouriteBand').setValidator(() => new BandValidator());
        this.ruleFor('leastFavouriteBand')
          .setValidator(() => new BandValidator())
          .unless((c) => c.leastFavouriteBand == null);
      }
    }

    const validator = new PersonValidator();

    const person: Person = {
      name: 'Alex',
      age: 25,
      favouriteBand: {
        name: 'Arctic Monkeys',
        debutAlbum: {
          name: `Whatever People Say I Am, That's What I'm Not`,
          numberOfTracks: 13,
          rating: 9,
        },
        currentAlbum: {
          name: `Tranquility Base Hotel and Casino`,
          numberOfTracks: 11,
          rating: 5,
        },
        allAlbumNames: [
          `Whatever People Say I Am, That's What I'm Not`,
          `Favourite Worst Nightmare`,
          `Humbug`,
          `Suck It and See`,
          `AM`,
          `Tranquility Base Hotel & Casino`,
        ],
      },
    };

    expect(validator.validate(person)).toEqual({
      favouriteBand: {
        debutAlbum: {
          rating: 'Value must be between 1 and 5 (inclusive)',
        },
        currentAlbum:
          'Name of current album was not present in list of all album names',
      },
    });
  });

  it('recursive types', () => {
    type Employee = {
      name: string;
      age: number;
      lineManager: Employee | null;
    };

    class EmployeeValidator extends Validator<Employee> {
      constructor() {
        super();
        this.ruleFor('name').notEmpty();
        this.ruleFor('age').inclusiveBetween(18, 80);
        this.ruleFor('lineManager')
          .setValidator(() => new EmployeeValidator())
          .when((employee) => employee.lineManager != null);
      }
    }

    const validator = new EmployeeValidator();

    const boss: Employee = {
      name: 'The Boss',
      age: -1,
      lineManager: null,
    };

    const teamLeader: Employee = {
      name: 'Team Leader',
      age: 28,
      lineManager: boss,
    };

    const grunt: Employee = {
      name: 'Grunt',
      age: 25,
      lineManager: teamLeader,
    };

    expect(validator.validate(grunt)).toEqual({
      lineManager: {
        lineManager: {
          age: 'Value must be between 18 and 80 (inclusive)',
        },
      },
    });
  });

  it('complex array types', () => {
    type Employee = {
      name: string;
      employeeNumber: number;
      lmees: Array<Employee>;
    };

    class EmployeeValidator extends Validator<Employee> {
      constructor() {
        super();
        this.ruleFor('name').notEmpty().withMessage('Employees have names!');
        this.ruleForEach('lmees').setValidator(() => new EmployeeValidator());
      }
    }

    const validator = new EmployeeValidator();

    const employee: Employee = {
      name: 'Alex',
      employeeNumber: 1,
      lmees: [
        {
          name: 'Bob',
          employeeNumber: 2,
          lmees: [],
        },
        {
          name: 'Charlie',
          employeeNumber: 3,
          lmees: [
            {
              name: '',
              employeeNumber: 4,
              lmees: [],
            },
          ],
        },
      ],
    };

    const result = validator.validate(employee);

    expect(result).toEqual({
      lmees: [
        null,
        {
          lmees: [{ name: 'Employees have names!' }],
        },
      ],
    });
  });
});
