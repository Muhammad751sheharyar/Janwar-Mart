const getImageUrl = (image) => {
  // Image nahi hai
  if (!image) {
    return "/images/cow.jfif";
  }

  // Agar already complete URL hai
  if (image.startsWith("http")) {
    return image;
  }

  // Backend uploaded image
  if (image.startsWith("/uploads")) {
    return `http://localhost:5000${image}`;
  }

  // Purani frontend images
  return image;
};

export default getImageUrl;