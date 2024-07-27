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
  export interface SpotifyTopTracksResponse {
    items: SpotifyTrack[];
  }