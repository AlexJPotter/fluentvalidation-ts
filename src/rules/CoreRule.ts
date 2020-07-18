export class CoreRule<TModel> {
  protected customErrorMessage?: string;
  protected whenCondition?: (model: TModel) => boolean;
  protected unlessCondition?: (model: TModel) => boolean;

  public setCustomErrorMessage = (customErrorMessage: string): void => {
    this.customErrorMessage = customErrorMessage;
  };

  public setWhenCondition = (condition: (model: TModel) => boolean) => {
    this.whenCondition = condition;
  };

  public setUnlessCondition = (condition: (model: TModel) => boolean) => {
    this.unlessCondition = condition;
  };
}
