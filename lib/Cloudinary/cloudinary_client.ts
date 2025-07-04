export const uploadThumbnailToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "StreamNest"); // Replace this
  formData.append("folder", "StreamNest_Thumbnail"); // optional

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.secure_url) {
      // console.log("✅ Thumbnail uploaded:", data.secure_url);
      return data; // You can now use data.secure_url for saving in DB
    } else {
      // console.error("❌ Cloudinary error:", data);
      throw new Error("Upload failed");
    }
  } catch (error) {
    // console.error("Upload error:", error);
    throw error;
  }
};

export const uploadVideoToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "StreamNest"); // Replace this
  formData.append("folder", "StreamNest_Video"); // optional

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.secure_url) {
      // console.log("✅ Video uploaded:", data.secure_url);
      return data; // You can now use data.secure_url for saving in DB
    } else {
      // console.error("❌ Cloudinary error:", data);
      throw new Error("Upload failed");
    }
  } catch (error) {
    // console.error("Upload error:", error);
    throw error;
  }
};
