// Credit: https://github.com/microsoft/TypeScript/issues/9252#issuecomment-472881853
// Slightly hacky workaround for the fact that a generic type parameter <T extends U>
// does not limit values of T to having **only** the properties of U, but rather requires
// that they have **at least** the properties specified in U. This is currently used for
// getting the right typing on the `.ruleForTransformed` methods, so that an object property
// can't be mapped to an object property of a different type (in particular, one that has
// more properties, since these won't be present in the `ValidationErrors` object).
/**
 * Constrain
 * @desc Constrains type `T` to only those properties that exist in type `U`
 */
export type Constrain<T, U> = {
  [key in keyof T]: key extends keyof U ? T[key] : never;
};
