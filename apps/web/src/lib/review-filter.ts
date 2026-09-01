// -----------------------------------------------------------------------------
// Review moderation filter.
//
// Visitor reviews publish immediately so genuine customers see their feedback
// appear — but anything that looks like abuse or spam is held back for the
// owner to approve in the admin panel, so it never reaches the public site
// (or Google) in the first place.
//
// The filter is deliberately cautious in one direction only: a false "hold"
// costs the owner one click to approve, while a false "clean" puts abuse on a
// customer-facing page. When in doubt, hold.
// -----------------------------------------------------------------------------

export type FilterVerdict =
  | { hold: false }
  | { hold: true; reason: string };

/**
 * Abusive words, English + romanised Hindi/Bhojpuri, as they are typically
 * typed on an Indian phone keyboard. Matched on word boundaries so ordinary
 * words are never caught — this list must not flag normal building-trade
 * vocabulary, so short/ambiguous tokens (e.g. "bc") are left out on purpose
 * and handled by the other heuristics instead.
 */
const ABUSE_WORDS = [
  // English
  'fuck', 'fucking', 'fucker', 'shit', 'bullshit', 'bitch', 'bastard', 'asshole',
  'dick', 'cunt', 'slut', 'whore', 'rape', 'rapist', 'nigger', 'faggot', 'retard',
  'scam', 'scammer', 'fraud', 'cheater', 'thief', 'looter',
  // Romanised Hindi / Bhojpuri abuse
  'chutiya', 'chutiye', 'chutia', 'bhosdi', 'bhosdike', 'bhosadike', 'bhosada',
  'madarchod', 'madarchid', 'maderchod', 'behenchod', 'behnchod', 'benchod',
  'bhenchod', 'gaandu', 'gandu', 'gaand', 'lund', 'lawda', 'launda', 'lauda',
  'randi', 'harami', 'haramkhor', 'kutta', 'kutte', 'kutiya', 'kamina', 'kamine',
  'saala', 'saale', 'jhatu', 'jhaat', 'tatti', 'bakchod', 'bakchodi', 'chodu',
  'chod', 'chinal', 'nalayak', 'suar', 'lodu',
  // Devanagari
  'चूतिया', 'भोसड़ी', 'मादरचोद', 'बहनचोद', 'गांडू', 'रंडी', 'हरामी', 'कुत्ता',
  'कमीना', 'साला', 'चोर', 'धोखा', 'फ्रॉड',
];

// Built once. \b works for the Latin entries; the Devanagari entries are matched
// as plain substrings since \b has no meaning between two non-ASCII letters.
const LATIN_ABUSE = new RegExp(
  `\\b(${ABUSE_WORDS.filter((w) => /^[a-z]+$/.test(w)).join('|')})\\b`,
  'i',
);
const DEVANAGARI_ABUSE = ABUSE_WORDS.filter((w) => !/^[a-z]+$/.test(w));

/** URLs, bare domains and "dot" obfuscation ("example dot com"). */
const LINK_PATTERN =
  /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|in|co|shop|xyz|ru|info|biz|link|site|online)\b|\bdot\s+(com|net|in)\b)/i;

const EMAIL_PATTERN = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;

/** 7+ digits in a row (with optional spaces/dashes) — a phone number drop. */
const PHONE_PATTERN = /(?:\d[\s-]?){7,}/;

/** The same character six or more times: "aaaaaa", "!!!!!!". */
const CHAR_SPAM_PATTERN = /(.)\1{5,}/;

/**
 * Decide whether a review can publish straight away or should be held.
 * `author` and `comment` are both checked — abuse is often put in the name.
 */
export function screenReview(author: string, comment: string): FilterVerdict {
  const combined = `${author} ${comment}`;
  const lower = combined.toLowerCase();

  if (LATIN_ABUSE.test(lower) || DEVANAGARI_ABUSE.some((w) => combined.includes(w))) {
    return { hold: true, reason: 'Possible abusive language' };
  }
  if (LINK_PATTERN.test(lower)) {
    return { hold: true, reason: 'Contains a link or web address' };
  }
  if (EMAIL_PATTERN.test(lower)) {
    return { hold: true, reason: 'Contains an email address' };
  }
  if (PHONE_PATTERN.test(combined)) {
    return { hold: true, reason: 'Contains a phone number' };
  }
  if (CHAR_SPAM_PATTERN.test(combined)) {
    return { hold: true, reason: 'Looks like spam (repeated characters)' };
  }

  // Shouting: mostly capitals over a reasonable length. Short comments like
  // "GOOD" are normal, so only judge once there is enough text.
  const letters = comment.replace(/[^a-zA-Z]/g, '');
  if (letters.length >= 20) {
    const caps = comment.replace(/[^A-Z]/g, '').length;
    if (caps / letters.length > 0.7) {
      return { hold: true, reason: 'Written in all capitals' };
    }
  }

  return { hold: false };
}
