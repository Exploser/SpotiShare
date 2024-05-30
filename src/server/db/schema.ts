// src/server/db/schema.ts
import { sql, relations, One } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  timestamp,
  varchar,
  numeric,
  text,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `spotify_share_${name}`);

// Users table
export const users = createTable(
  "users",
  {
    id: varchar("id").notNull().primaryKey(),
  }
);
export const usersRelations = relations(users, ({ many }) => ({
  tracks: many(tracks),
}));

// Albums table
export const albums = createTable(
  "albums",
  {
    id: varchar("id").notNull().primaryKey(), 
    name: text("name").notNull(),
    image: text("image_url"),
    release_date: text("release_date"),
    total_tracks: numeric("total_tracks"),
    external_url: varchar("external_url"),
  }
)
export const albumsRelations = relations(albums, ({ many }) => ({
  tracks: many(tracks),
}));

// Artists table
export const artists = createTable(
  "artists",
  {
    id: varchar("id").primaryKey().notNull(),
    name: text("name").notNull(),
    external_url: text("external_url"),
  }
);
export const artistsRelations = relations(artists, ({ many }) => ({
  tracks: many(tracks),
}));


// Tracks table
export const tracks = createTable(
  "tracks",
  {
    id: varchar("id").primaryKey().notNull(),
    name: text("name").notNull(),
    preview_url: text("preview_url"),
    track_number: numeric("track_number"),
    artists_name: text("artists_name").references(() => artists.name),
    album_name: text("album_name").references(() => albums.name),
    user_id: text("user_id").references(() => users.id),
    popularity: numeric("popularity"),
  }
);

export const tracksRelations = relations(tracks, ({ one }) => ({
  album_id: one(albums,{
    fields: [tracks.album_name],
    references: [albums.name],
  }),
  user_id: one(users,{
    fields: [tracks.user_id],
    references: [users.id],
  }),
  artists_id: one(artists,{
    fields: [tracks.artists_name],
    references: [artists.name],
  }),
}));

export const savedTracks = createTable(
  "saved_tracks",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    user_id: text("user_id").references(() => users.id),
    track_name: text("track_name").references(() => tracks.name),
    album_name: text("album_name").references(() => albums.name),
    artists_name: text("artists_name").references(() => artists.name),
    created_at: timestamp("created_at").default(sql`current_timestamp`),
  }
);

export const savedTracksRelations = relations(savedTracks, ({ one }) => ({
  user_id: one(users, {
    fields: [savedTracks.user_id],
    references: [users.id],
  }),
  track_name: one(tracks, {
    fields: [savedTracks.track_name],
    references: [tracks.name],
  }),
  album_id: one(albums, {
    fields: [savedTracks.album_name],
    references: [albums.name],
  }),
  artists_id: one(artists, {
    fields: [savedTracks.artists_name],
    references: [artists.name],
  }),
}));