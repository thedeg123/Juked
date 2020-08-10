const navigateContent = (navigation, cid, album_cid, review, content, user) => {
  const navigate = navigation.push ? navigation.push : navigation.navigate;
  if (review && review.data.type === "list") {
    return navigate("UserList", {
      list: review,
      user: user
    });
  }
  if (!review || !review.data.is_review) {
    switch (content.type) {
      case "album":
        return navigate("Album", {
          content_id: content.id,
          highlighted: ""
        });
      case "artist":
        return navigate("Artist", { content_id: content.id });
      case "track":
        return navigate("Album", {
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
