export interface CommonTranslations {
  header: {
    title: string;
    search: string;
  };
  languageSwitch: {
    label: string;
    current: string;
  };
  banner: {
    title: string;
    message: string;
    switchButton: string;
    dismissButton: string;
  };
  menu: {
    github: string;
    close: string;
  };
}

export interface ArtistTranslations {
  title: string;
  followers: string;
  genres: string;
  topTracks: string;
  relatedArtists: string;
  biography: string;
  noData: string;
}

export interface TrackTranslations {
  title: string;
  artist: string;
  album: string;
  duration: string;
  releaseDate: string;
  audioFeatures: string;
  features: {
    danceability: string;
    energy: string;
    valence: string;
    tempo: string;
    loudness: string;
  };
  noData: string;
}

export type SupportedLanguages = "en" | "zh-TW" | "jp";
export type Namespaces = "common" | "artist" | "track";
