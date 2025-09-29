const getCloudinaryImage = (
  url: string,
  options?: { w?: number; h?: number }
) => {
  if (!url.includes("res.cloudinary.com")) return url; // not a Cloudinary image

  const { w = 200, h = 200 } = options || {};
  return url.replace("/upload/", `/upload/w_${w},h_${h},c_fill,q_auto,f_auto/`);
};

export default getCloudinaryImage;
