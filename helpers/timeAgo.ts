export const timeAgo = (dateString: string): string => {
  // Normalize SQLite timestamp to ISO UTC
  const iso = dateString.includes('T')
    ? dateString
    : dateString.replace(' ', 'T') + 'Z';

  const now = Date.now();
  const past = new Date(iso).getTime();

  const diff = Math.max(0, Math.floor((now - past) / 1000));

  if (diff < 60) return `${diff}s ago`;

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;

  const months = Math.floor(days / 30);
  return `${months}mo ago`;
};
