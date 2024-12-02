import { TRPCError } from "@trpc/server";

export const singleOrThrow = <T extends any>(values: T[] | T): NonNullable<T> => {
  if (Array.isArray(values)) return singleOrThrowArray(values);
  return singleOrThrowItem(values);
}

export const singleOrThrowItem = <T extends any>(value: T): NonNullable<T> => {
  if (value === null || value === undefined) {
    // throw new Error("Found non unique or inexistent value");
    throw new TRPCError({code: "NOT_FOUND"})
  }
  return value!;
}

const singleOrThrowArray = <T extends any[]>(values: T): NonNullable<T[number]> => {
  if (values.length === 0) {
    throw new TRPCError({code: "NOT_FOUND"})
  } 
  if (values.length > 1) {
    throw new TRPCError({code: "BAD_REQUEST", message: "Found more than one value"})
  } 
  return values[0]!
}