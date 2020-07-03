const navigateContent = (navigation, cid, album_cid, review, content, user) => {
  if (!review || !review.data.is_review) {
    switch (content.type) {
      case "album":
        return navigation.push("Album", {
          content_id: content.id,
          highlighted: ""
        });
      case "artist":
        return navigation.push("Artist", { content_id: content.id });
      case "track":
        return navigation.push("Album", {
          content_id: content.album_id,
          highlighted: content.id
        });
      default:
        return;
    }
  }
  if (review.data.is_review)
    return navigation.push("Review", { review, user, content });
  switch (review.data.type) {
    case "album":
      return navigation.push("Album", {
        content_id: cid,
        highlighted: ""
      });
    case "artist":
      return navigation.push("Artist", { content_id: cid });
    case "track":
      return navigation.push("Album", {
        content_id: album_cid,
        highlighted: cid
      });
    default:
      return;
  }
};

export default navigateContent;
