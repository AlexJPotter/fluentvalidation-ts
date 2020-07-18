import { ValidationErrors } from './ValidationErrors';

export interface IAsyncValidator<TModel> {
  validateAsync: (model: TModel) => Promise<ValidationErrors<TModel>>;
}
