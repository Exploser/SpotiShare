export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  external_urls: {
    spotify: string;
  };
  preview_url?: string;
  explicit: boolean;
}

export interface SpotifyError {
  error: {
    status: number;
    message: string;
  };
}
export interface SpotifyUser {
  display_name: string;
  email: string;
  id: string;
  images: Array<{ url: string; height: number; width: number }>;
  followers: { total: number };
  external_urls: { spotify: string };
  href: string;
  type: string;
  uri: string;
}

export interface SpotifyTopArtistsResponse {
  items: Artist[];
}

export interface Artist {
  name: string;
  id: string;
  external_urls: {
    spotify: string;
  };
  spotify: string;
  images: Array<{ url: string; height: number; width: number }>;
  followers: { total: number };
  genres: string[];
  popularity: number;
}
export interface Album {
  id: string;
  name: string;
  release_date: string;
  total_tracks: number;
  images: Array<{ url: string; height: number; width: number }>;
}

export interface Tracks {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  preview_url: string;
  track_number: number;
  popularity: number;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyTopTracksResponse {
  items: Tracks[];
}

interface SpotifyContext {
  type: string;
  external_urls: string[];
  href: string;
  uri: string;
}

export interface SpotifyPlayHistory {
  track: SpotifyTrack;
  played_at: string;
  context: SpotifyContext;
}

export interface recentlyPlayed {
  href: string;
  limit: number;
  next: string;
  cursors: {
    after: string;
    before: string;
  };
  total: number;
  items: SpotifyPlayHistory[];
}

export interface SpotifyGenresResponse {
  genres: string[];
}

interface Seeds {
  href: string;
  type: string;
}

export interface SpotifyRecommendationsResponse {
  tracks: Tracks[];
  seeds: Seeds[];
}