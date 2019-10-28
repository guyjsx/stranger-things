import striptags from 'striptags'

export function removePunctuation(text: string): string {
  return text.replace(/[^\w\s']/gm, ''); // regex 101 :p
}

export function sanitizeText(text: string): string {
  return removePunctuation(striptags(text)).toLowerCase();
}

export function getFirstSentence(text: string) {
  return striptags(text).match(/^.*?[\.!\?](?:\s|$)/)[0];
}