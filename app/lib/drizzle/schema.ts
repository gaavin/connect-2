import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

const baseSchema = {
  id: text("id").primaryKey().$defaultFn(createId),
  createdAt: integer("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
};

export const users = sqliteTable("users", {
  ...baseSchema,
  email: text("email").notNull(),
  username: text("username").notNull(),
  password: text("password").notNull(),
});
export type NewUser = InferInsertModel<typeof users>;
export type User = InferSelectModel<typeof users>;

export const families = sqliteTable("families", {
  parentId: text("parent_id")
    .references(() => posts.id)
    .notNull(),
  childId: text("child_id")
    .references(() => posts.id)
    .notNull(),
});

export const posts = sqliteTable("posts", {
  ...baseSchema,
  authorId: text("author_id")
    .references(() => users.id)
    .notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
});

export const assets = sqliteTable("attatchments", {
  ...baseSchema,
  authorId: text("author_id")
    .references(() => users.id)
    .notNull(),
  url: text("url").notNull(),
});

export const postsToAssets = sqliteTable("postsToAssets", {
  postId: integer("post_id")
    .references(() => posts.id)
    .notNull(),
  assetId: integer("asset_id")
    .references(() => assets.id)
    .notNull(),
});
