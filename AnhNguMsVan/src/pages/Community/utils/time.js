export const formatRelativeTime = (isoString) => {
  if (!isoString) return "";

  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = Math.max(0, now - then);

  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;

  return new Date(isoString).toLocaleDateString();
};
