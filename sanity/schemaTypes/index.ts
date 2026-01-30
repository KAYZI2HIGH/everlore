import { type SchemaTypeDefinition } from "sanity";
import user from "./user";
import course from "./course";
import blogPost from "./blog";
import jobPosting from "./jobPosting";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [user, course, blogPost, jobPosting],
};
