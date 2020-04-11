const navigateContent = (navigation, cid, album_cid, review) => {
  if (review.data.title)
    return navigation.navigate("Review", { rid: review.id });
  switch (review.data.type) {
    case "album":
      return navigation.navigate("Album", {
        content_id: cid,
        highlighted: ""
      });
    case "artist":
      return navigation.navigate("Artist", { content_id: cid });
    case "track":
      return navigation.navigate("Album", {
        content_id: album_cid,
        highlighted: cid
      });
    default:
      return;
  }
};

export default navigateContent;