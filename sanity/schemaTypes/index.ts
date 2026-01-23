import { type SchemaTypeDefinition } from "sanity";
import user from "./user";
import course from "./course";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [user, course],
};
