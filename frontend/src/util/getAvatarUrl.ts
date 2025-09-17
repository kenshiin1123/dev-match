const getAvatarUrl = (avatar?: string, avatar_content_type?: string) => {
  return avatar && avatar_content_type
    ? `data:${avatar_content_type};base64,${avatar}`
    : "images/default_pic.png";
};

export default getAvatarUrl;
