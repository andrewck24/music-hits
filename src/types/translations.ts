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
  pageTitle: string;
  title: string;
  followers: string;
  genres: string;
  topTracks: string;
  relatedArtists: string;
  biography: string;
  noData: string;
  profile: {
    followersCount: string;
    popularity: string;
  };
  tracks: {
    sectionTitle: string;
    noTracks: string;
  };
  notFound: {
    title: string;
    message: string;
    backToHome: string;
    searchArtist: string;
  };
}

export interface TrackTranslations {
  pageTitle: string;
  info: {
    albumLabel: string;
    releaseYearLabel: string;
    popularity: string;
    openInSpotify: string;
    loadError: string;
    loadErrorMessage: string;
  };
  featureChart: {
    title: string;
    labels: {
      acousticness: string;
      danceability: string;
      energy: string;
      instrumentalness: string;
      liveness: string;
      speechiness: string;
      valence: string;
    };
    featureValue: string;
    loadError: string;
  };
  otherFeatures: {
    key: string;
    mode: string;
    tempo: string;
    durationLabel: string;
    noData: string;
  };
  artists: {
    title: string;
    viewDetails: string;
  };
  popularity: {
    title: string;
    labels: {
      playCount: string;
      youtubeViews: string;
      youtubeLikes: string;
      youtubeComments: string;
    };
    legend: {
      median: string;
      mean: string;
      note: string;
    };
    stats: {
      median: string;
      mean: string;
      range: string;
    };
    loadError: string;
  };
  prediction: {
    title: string;
    categories: {
      niche: {
        title: string;
        description: string;
      };
      mainstream: {
        title: string;
        description: string;
      };
      promising: {
        title: string;
        description: string;
      };
    };
  };
  notFound: {
    title: string;
    message: string;
    backToHome: string;
    searchTrack: string;
  };
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
