export const delay = (delayInMilliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, delayInMilliseconds));
