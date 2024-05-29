// src/server/db/schema.ts
import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  uuid,
  numeric,
  primaryKey,
  text,
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
    id: uuid("id").notNull().primaryKey().default('gen_random_uuid()'),
  }
);

// Albums table
export const albums = createTable(
  "albums",
  {
    id: serial("id").notNull().primaryKey(), 
    name: text("name").notNull(),
    release_date: text("release_date"),
    total_tracks: numeric("total_tracks"),
  }
);

// Images table
export const images = createTable(
  "images",
  {
    id: serial("id").notNull().primaryKey(),
    url: text("url").notNull(),
    album_id: varchar("album_id").references(() => albums.id),
  }
);

// Artists table
export const artists = createTable(
  "artists",
  {
    id: serial("id").notNull().primaryKey(),
    name: text("name").notNull(),
  }
);

// Tracks table
export const tracks = createTable(
  "tracks",
  {
    id: uuid("id").notNull().primaryKey().default('gen_random_uuid()'),
    name: text("name").notNull(),
    preview_url: text("preview_url"),
    track_number: numeric("track_number"),
    album_id: uuid("album_id").references(() => albums.id),
    user_id: uuid("user_id").references(() => users.id),
  }
);

// Track-Artists table (many-to-many relationship)
export const trackArtists = createTable(
  "track_artists",
  {
    track_id: uuid("track_id").references(() => tracks.id),
    artist_id: uuid("artist_id").references(() => artists.id),
  },
  (table) => ({
    pk: primaryKey(table.track_id, table.artist_id),
  })
);