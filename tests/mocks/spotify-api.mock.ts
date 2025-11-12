import type {
  SpotifyArtist,
  SpotifyAudioFeatures,
  SpotifyTrack,
} from "@/types/spotify";

/**
 * Mock Spotify API data for testing
 */

export const mockSpotifyArtist: SpotifyArtist = {
  id: "3AA28KZvwAUcZuOKwyblJQ",
  name: "Gorillaz",
  type: "artist",
  uri: "spotify:artist:3AA28KZvwAUcZuOKwyblJQ",
  href: "https://api.spotify.com/v1/artists/3AA28KZvwAUcZuOKwyblJQ",
  external_urls: {
    spotify: "https://open.spotify.com/artist/3AA28KZvwAUcZuOKwyblJQ",
  },
  images: [
    {
      url: "https://i.scdn.co/image/ab6761610000e5eb24f7c2f69a8d56bc4e3aafe8",
      width: 640,
      height: 640,
    },
  ],
  followers: { href: null, total: 8234567 },
  popularity: 82,
  genres: ["alternative hip hop", "art pop", "trip hop"],
};

export const mockSpotifyTrack: SpotifyTrack = {
  id: "0d28khcov6AiegSCpG5TuT",
  name: "Feel Good Inc.",
  type: "track",
  uri: "spotify:track:0d28khcov6AiegSCpG5TuT",
  href: "https://api.spotify.com/v1/tracks/0d28khcov6AiegSCpG5TuT",
  external_urls: {
    spotify: "https://open.spotify.com/track/0d28khcov6AiegSCpG5TuT",
  },
  artists: [
    {
      id: "3AA28KZvwAUcZuOKwyblJQ",
      name: "Gorillaz",
      type: "artist",
      uri: "spotify:artist:3AA28KZvwAUcZuOKwyblJQ",
      href: "https://api.spotify.com/v1/artists/3AA28KZvwAUcZuOKwyblJQ",
      external_urls: {
        spotify: "https://open.spotify.com/artist/3AA28KZvwAUcZuOKwyblJQ",
      },
    },
  ],
  album: {
    id: "0bUTHlWbkSQysoM3VsWldT",
    name: "Demon Days",
    type: "album",
    uri: "spotify:album:0bUTHlWbkSQysoM3VsWldT",
    href: "https://api.spotify.com/v1/albums/0bUTHlWbkSQysoM3VsWldT",
    external_urls: {
      spotify: "https://open.spotify.com/album/0bUTHlWbkSQysoM3VsWldT",
    },
    album_type: "album",
    total_tracks: 15,
    release_date: "2005-05-23",
    release_date_precision: "day",
    artists: [
      {
        id: "3AA28KZvwAUcZuOKwyblJQ",
        name: "Gorillaz",
        type: "artist",
        uri: "spotify:artist:3AA28KZvwAUcZuOKwyblJQ",
        href: "https://api.spotify.com/v1/artists/3AA28KZvwAUcZuOKwyblJQ",
        external_urls: {
          spotify: "https://open.spotify.com/artist:3AA28KZvwAUcZuOKwyblJQ",
        },
      },
    ],
    images: [
      {
        url: "https://i.scdn.co/image/ab67616d0000b2734a5bf7769b90f87c01b6ccf8",
        width: 640,
        height: 640,
      },
    ],
  },
  duration_ms: 222973,
  explicit: false,
  is_local: false,
  popularity: 89,
  preview_url: null,
  track_number: 5,
  disc_number: 1,
  external_ids: {
    isrc: "GBAYE0501436",
  },
};

export const mockAudioFeatures: SpotifyAudioFeatures = {
  id: "0d28khcov6AiegSCpG5TuT",
  type: "audio_features",
  uri: "spotify:track:0d28khcov6AiegSCpG5TuT",
  track_href: "https://api.spotify.com/v1/tracks/0d28khcov6AiegSCpG5TuT",
  analysis_url:
    "https://api.spotify.com/v1/audio-analysis/0d28khcov6AiegSCpG5TuT",
  acousticness: 0.0244,
  danceability: 0.818,
  energy: 0.702,
  instrumentalness: 0.000132,
  liveness: 0.0975,
  loudness: -5.599,
  speechiness: 0.202,
  valence: 0.772,
  tempo: 138.559,
  key: 7,
  mode: 1,
  time_signature: 4,
  duration_ms: 222973,
};

export const mockSpotifyToken = {
  access_token: "mock_access_token_12345",
  token_type: "Bearer",
  expires_in: 3600,
};
