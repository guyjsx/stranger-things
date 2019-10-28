export interface TvMaze {
  id:           number;
  url:          string;
  name:         string;
  type:         string;
  language:     string;
  genres:       string[];
  status:       string;
  runtime:      number;
  premiered:    Date;
  officialSite: string;
  schedule:     Schedule;
  rating:       Rating;
  weight:       number;
  network:      null;
  webChannel:   WebChannel;
  externals:    Externals;
  image:        Image;
  summary:      string;
  updated:      number;
  _links:       TvMazeLinks;
  _embedded:    Embedded;
}

export interface Embedded {
  episodes: TvMazeEpisode[];
}

export interface TvMazeEpisode {
  id:       number;
  url:      string;
  name:     string;
  season:   number;
  number:   number;
  airdate:  Date;
  airtime:  string;
  airstamp: Date;
  runtime:  number;
  image:    Image;
  summary:  string;
  _links:   EpisodeLinks;
}

export interface EpisodeLinks {
  self: Previousepisode;
}

export interface Previousepisode {
  href: string;
}

export interface Image {
  medium:   string;
  original: string;
}

export interface TvMazeLinks {
  self:            Previousepisode;
  previousepisode: Previousepisode;
}

export interface Externals {
  tvrage:  number;
  thetvdb: number;
  imdb:    string;
}

export interface Rating {
  average: number;
}

export interface Schedule {
  time: string;
  days: string[];
}

export interface WebChannel {
  id:      number;
  name:    string;
  country: null;
}
