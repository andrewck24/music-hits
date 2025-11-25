export interface CommonTranslations {
  header: {
    title: string;
    search: string;
    searchPlaceholder: string;
    clearSearch: string;
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
    label: string;
    github: string;
    close: string;
  };
  actions: {
    search: string;
    back: string;
    home: string;
    backToHome: string;
    close: string;
    viewMore: string;
    loadMore: string;
    tryAgain: string;
  };
  states: {
    loading: string;
    error: string;
    noData: string;
    notFound: string;
  };
  errors: {
    notFound: string;
    loadError: string;
    tryAgainMessage: string;
    genericError: string;
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

export interface HomeTranslations {
  hero: {
    title: string;
    subtitle: string;
    ctaButton: string;
  };
  popularArtists: {
    title: string;
  };
  popularTracks: {
    title: string;
  };
}

export interface SearchTranslations {
  pageTitle: string;
  emptyState: {
    title: string;
    message: string;
  };
  noResults: {
    title: string;
    message: string;
  };
  categories: {
    all: string;
    artists: string;
    tracks: string;
  };
  artistResults: {
    title: string;
    viewAll: string;
    noResults: string;
    showingAll: string;
  };
  trackResults: {
    title: string;
    viewAll: string;
    noResults: string;
    showingAll: string;
  };
}

export type SupportedLanguages = "en" | "zh-TW" | "jp";
export type Namespaces = "common" | "artist" | "track" | "home" | "search";
