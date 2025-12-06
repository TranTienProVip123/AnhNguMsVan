import React from "react";

export const renderAvatar = (author = {}) => {
  const avatarUrl = author.avatar || author.photoURL || author.picture || "";

  const letter =
    author.name?.trim()?.charAt(0)?.toUpperCase() ||
    author.email?.trim()?.charAt(0)?.toUpperCase() ||
    "U";

  if (avatarUrl) {
    return (
      <img
        className="avatar-img"
        src={avatarUrl}
        alt={author.name || "avatar"}
      />
    );
  }

  return <span className="avatar-fallback">{letter}</span>;
};
