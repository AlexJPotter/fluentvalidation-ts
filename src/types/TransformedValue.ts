import { FlatType } from '@/types/FlatType';

// We restrict the type to flat types, otherwise it would be possible to map a flat type
// to a complex type and force an object/array property in the validation errors, when only
// a flat error (`string | null`) is expected. `TValue` is also obviously accepted, since
// the errors object will have the same shape in that case.
export type TransformedValue<TValue> = TValue | FlatType | null | undefined;

// TODO: Should we allow Partial<TValue> here given that a subset of the
//  properties being in the errors object is a valid use case?
