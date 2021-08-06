/**
 * RequireAtLeastOne helps create a type where at least one of the properties of an interface (can be any property) is required to exist.
 *
 * This works because of TypeScript's utility types: https://www.typescriptlang.org/docs/handbook/utility-types.html
 * Let's examine it:
 * - `[K in keyof T]-?` this property (K) is valid only if it has the same name as any property of T.
 * - `Required<Pick<T, K>>` makes a new type from T with just the current property in the iteration, and marks it as required
 * - `Partial<Pick<T, Exclude<keyof T, K>>>` makes a new type with all the properties of T, except from the property K.
 * - `&` is what unites the type with only one required property from `Required<...>` with all the optional properties from `Partial<...>`.
 * - `[keyof T]` ensures that only properties of T are allowed.
 *
 * From https://docs.microsoft.com/en-us/javascript/api/@azure/keyvault-certificates/requireatleastone?view=azure-node-latest
 * https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/keyvault/keyvault-certificates/src/certificatesModels.ts
 */
export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];
