import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Define your database tables here.
  //
  // Example for projects with authentication:
  //
  // users: defineTable({
  //   name: v.optional(v.string()),
  //   email: v.string(),
  //   image: v.optional(v.string()),
  //   tokenIdentifier: v.string(),
  // }).index("by_token", ["tokenIdentifier"]),
});
