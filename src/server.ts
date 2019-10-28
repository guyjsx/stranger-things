import { Helix, Episodes } from './models/helix';
import { TvMaze, TvMazeEpisode } from './models/tvmaze';
import { sanitizeText, getFirstSentence } from './util/util';

import moment from 'moment';
import axios from 'axios';

init();

/**
 * Initializes the challenge
 */
async function init() {
  const response = await axios('http://api.tvmaze.com/singlesearch/shows?q=stranger-things&embed=episodes');

  // Task A
  const taskA = findTopFiveWords(response.data)
  console.log('\nPart 1: ', taskA);

  // Task B
  const taskB = findDustin(response.data);
  console.log('\nPart Two: ', taskB);

  // Task C
  const taskC: any = formatResponse(response.data);
  console.log('\nPart Three: ', JSON.stringify(taskC, null, 4));
}

// Task A

/**
 * Finds the top five words in all episode summaries
 * 
 * @param response - the TvMaze API response
 * 
 */
function findTopFiveWords(response: TvMaze) {
  const wordArr = [];

  for (let episode of response._embedded.episodes) {
    // refactored to use helper methods
    wordArr.push(sanitizeText(episode.summary).split(' '));
  }

  // refactored to store total count instead of word array, less code
  let dictionary: { [key: string]: number } = wordArr.reduce((acc: any, item) => { 
    item.forEach((word) => !acc[word] ? acc[word] = 1 : acc[word]++);

    return acc;
  }, {})

  // refactored to use object entries to remove additional array creation for sort
  let topFiveWords: [string, number][] = Object.entries(dictionary).sort((a, b) =>  b[1] - a[1]).slice(0, 5);

  return topFiveWords;
}

// Task B

/**
 * Simply finds the first episode ID where Dustin is mentioned
 * 
 * @param response - the TvMaze API response
 */
function findDustin(response: TvMaze) {
  let episodeId;

  for (let episode of response._embedded.episodes) {
    if (episode.summary.includes('Dustin')) {
      episodeId = episode.id;

      break;
    }
  }

  return episodeId;
}

// Task C

/**
 * Formats the response to the structure provided in the challenge
 * 
 * @param response the TvMaze API response
 * @returns formatted Helix structure
 */
function formatResponse(response: TvMaze): Helix {

  return {
    [response.id]: {
      totalDurationSec: getTotalDuration(response._embedded.episodes),
      averageEpisodesPerSeason: getAverageEpisodesPerSeason(response._embedded.episodes),
      episodes: formatEpisodes(response._embedded.episodes)
    }
  };
}

/**
 * Formats the episodes according to the Helix structure
 * 
 * @param episodes 
 * @returns formatted episodes
 */
function formatEpisodes(episodes: TvMazeEpisode[]): Episodes {
  return episodes.reduce((acc: Episodes, episode: TvMazeEpisode): Episodes => {

    acc[episode.id] = {
      sequenceNumber: `s${episode.season}e${episode.number}`,
      shortTitle: episode.name.replace(/Chapter.*:/g, ''),
      airTimestamp: moment(episode.airstamp).unix(),
      shortSummary:  getFirstSentence(episode.summary) || '' // really difficult to identify first sentence in string
    }

    return acc;
  }, {});
}

/**
 * Gets the total duration of all episodes
 * 
 * @param episodes 
 * @returns the total duration of all episodes in seconds
 */
function getTotalDuration(episodes: TvMazeEpisode[]): number {
  const totalMinutes: moment.Duration = episodes.reduce((acc: moment.Duration, episode: TvMazeEpisode): moment.Duration => {
    acc.add(episode.runtime, 'minutes');

    return acc;
  }, moment.duration(0, 'minutes'));

  return totalMinutes.asSeconds();
}

/**
 * Gets the average episodes per season
 * 
 * @param episodes 
 * @returns the average episodes per season
 */
function getAverageEpisodesPerSeason(episodes: TvMazeEpisode[]): number {
  const seasons: { [key: string]: Set<string>[] } = episodes.reduce((acc: any, episode: TvMazeEpisode, index: number) => {
    if (!acc[episode.season]) {
      // using Set for uniqueness, not needed but good to prevent dupes and unnecessary object values
      acc[episode.season] = new Set([episode.id]);
    }

    acc[episode.season].add(episode.id);

    return acc;
  }, {});

  const seasonEntries: any = Object.entries(seasons);

  let totalEpisodes = 0;
  let totalSeasons = 0; 

  for (let entry of seasonEntries) {
    let [ season, episodes ] = entry;

    totalSeasons++;
    totalEpisodes = totalEpisodes + episodes.size;
  }

  const averageEpisodes: number = totalEpisodes / totalSeasons;

  return parseFloat(averageEpisodes.toFixed(1));
}
