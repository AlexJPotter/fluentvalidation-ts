import { ValidationErrors } from './ValidationErrors';
export interface IValidator<TModel> {
    validate: (model: TModel) => ValidationErrors<TModel>;
}
