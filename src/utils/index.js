export const VOTE_TYPE = {
  UP: 'up',
  DOWN: 'down',
  NEUTRAL: 'neutral',
};

const RELATIVE_UNITS = [
  {limit: 60, seconds: 1, unit: 'second'},
  {limit: 3600, seconds: 60, unit: 'minute'},
  {limit: 86400, seconds: 3600, unit: 'hour'},
  {limit: 604800, seconds: 86400, unit: 'day'},
  {limit: 2629800, seconds: 604800, unit: 'week'},
  {limit: 31557600, seconds: 2629800, unit: 'month'},
  {limit: Infinity, seconds: 31557600, unit: 'year'},
];

export function showFormattedDate(isoDate) {
  const timestamp = new Date(isoDate).getTime();
  if (Number.isNaN(timestamp)) return '';

  const elapsed = (timestamp - Date.now()) / 1000;
  const formatter = new Intl.RelativeTimeFormat('id-ID', {numeric: 'auto'});
  const {seconds, unit} =
    RELATIVE_UNITS.find(({limit}) => Math.abs(elapsed) < limit);

  return formatter.format(Math.round(elapsed / seconds), unit);
}

export function showFullDate(isoDate) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(date);
}

export function stripHtml(html = '') {
  return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, '\'')
      .replace(/\s+/g, ' ')
      .trim();
}

export function truncate(text, maxLength = 180) {
  if (text.length <= maxLength) return text;
  const sliced = text.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(' ');
  return `${sliced.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}

export function resolveUserVote(entity, userId) {
  if (!userId) return VOTE_TYPE.NEUTRAL;
  if (entity.upVotesBy.includes(userId)) return VOTE_TYPE.UP;
  if (entity.downVotesBy.includes(userId)) return VOTE_TYPE.DOWN;
  return VOTE_TYPE.NEUTRAL;
}

export function toggleVoteType(currentVote, pressedVote) {
  return currentVote === pressedVote ? VOTE_TYPE.NEUTRAL : pressedVote;
}

export function applyVote(entity, userId, voteType) {
  entity.upVotesBy = entity.upVotesBy.filter((id) => id !== userId);
  entity.downVotesBy = entity.downVotesBy.filter((id) => id !== userId);

  if (voteType === VOTE_TYPE.UP) {
    entity.upVotesBy.push(userId);
  } else if (voteType === VOTE_TYPE.DOWN) {
    entity.downVotesBy.push(userId);
  }
}

export function collectCategories(threads) {
  const categories = new Set();
  threads.forEach(({category}) => {
    if (category) categories.add(category);
  });
  return [...categories].sort((a, b) => a.localeCompare(b));
}

const ALLOWED_TAGS = new Set([
  'A', 'B', 'BLOCKQUOTE', 'BR', 'CODE', 'DIV', 'EM', 'H1', 'H2', 'H3', 'H4',
  'H5', 'H6', 'HR', 'I', 'LI', 'OL', 'P', 'PRE', 'SPAN', 'STRONG', 'U', 'UL',
]);
const ALLOWED_ATTRIBUTES = {A: new Set(['href', 'title'])};
const DROPPED_TAGS = new Set([
  'EMBED', 'IFRAME', 'NOSCRIPT', 'OBJECT', 'SCRIPT', 'STYLE', 'TEMPLATE',
]);
const SAFE_URL = /^(https?:|mailto:|#|\/)/i;

export function sanitizeHtml(html = '') {
  const doc = new DOMParser().parseFromString(html, 'text/html');

  const walk = (node) => {
    [...node.children].forEach((child) => {
      if (DROPPED_TAGS.has(child.tagName)) {
        child.remove();
        return;
      }

      if (!ALLOWED_TAGS.has(child.tagName)) {
        child.replaceWith(...child.childNodes);
        return;
      }

      const allowed = ALLOWED_ATTRIBUTES[child.tagName] ?? new Set();
      [...child.attributes].forEach(({name, value}) => {
        const isSafeHref =
          name !== 'href' || SAFE_URL.test(value.trim());
        if (!allowed.has(name) || !isSafeHref) {
          child.removeAttribute(name);
        }
      });

      if (child.tagName === 'A') {
        child.setAttribute('rel', 'noopener noreferrer nofollow');
        child.setAttribute('target', '_blank');
      }

      walk(child);
    });
  };

  walk(doc.body);
  return doc.body.innerHTML;
}
