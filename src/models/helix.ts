export interface Helix {
  [key: number]: Info;
}

export interface Info {
  totalDurationSec: number;
  averageEpisodesPerSeason: number;
  episodes?: Episodes
}

export interface Episodes {
  [key: string]: EpisodeInfo
}

export interface EpisodeInfo {
  id?: string;
  sequenceNumber: string;
  shortTitle: string;
  airTimestamp: number;
  shortSummary: string;
}