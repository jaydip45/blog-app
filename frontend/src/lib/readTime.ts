/** Rough reading time from HTML body (tags stripped). */
export function estimateReadMinutesFromHtml(html: string, wordsPerMinute = 200): number {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text.split(/\s/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
