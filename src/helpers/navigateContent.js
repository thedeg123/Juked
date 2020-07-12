const navigateContent = (navigation, cid, album_cid, review, content, user) => {
  if (review && review.data.type === "list") {
    return navigation.push("UserList", {
      list: review,
      user: user
    });
  }
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
};

export default navigateContent;
