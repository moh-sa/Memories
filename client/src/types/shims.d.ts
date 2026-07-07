declare module "@fvilers/disable-react-devtools";

// `@hookform/resolvers/yup` ships types at `yup/dist/yup.d.ts`, but its
// package.json `exports` map omits a `types` condition, so under the
// `Bundler` moduleResolution TypeScript cannot discover them (TS7016).
// Re-declare the module pointing at react-hook-form's `Resolver` type.
declare module "@hookform/resolvers/yup" {
  import type { FieldValues, Resolver } from "react-hook-form";
  export const yupResolver: (
    schema: object,
    schemaOptions?: object,
    factoryOptions?: object
  ) => Resolver<FieldValues>;
}
