import { yupResolver } from "@hookform/resolvers/yup";
import type { FieldValues, Resolver } from "react-hook-form";
import type { AnyObjectSchema } from "yup";

export function typedYupResolver<T extends FieldValues>(
  schema: AnyObjectSchema,
): Resolver<T> {
  return yupResolver(schema) as Resolver<T>;
}
