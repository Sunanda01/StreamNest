"use client";
import FormField from "@/Components/FormField";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useFileInput } from "@/lib/hooks/useFileInput";
import { MAX_THUMBNAIL_SIZE, MAX_VIDEO_SIZE } from "@/constants";
import FileInput from "@/Components/FileInput";
import {
  saveVideoDetails,
} from "@/lib/actions/video";
import { useRouter } from "next/navigation";
import { Visibility } from "@/index";
import { BeatLoader } from "react-spinners";
import toast from "react-hot-toast";
import { uploadThumbnailToCloudinary, uploadVideoToCloudinary } from "@/lib/Cloudinary/cloudinary_client";
import { v4 as uuidv4 } from "uuid";

const Upload = () => {
  const router = useRouter();
  const [videoDuration, setVideoDuration] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    visibility: Visibility; // ✅ Strong type
  }>({
    title: "",
    description: "",
    visibility: "public",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const video = useFileInput(MAX_VIDEO_SIZE);
  const thumbnail = useFileInput(MAX_THUMBNAIL_SIZE);

  useEffect(() => {
    if (video.duration !== null || 0) {
      setVideoDuration(video.duration);
    }
  }, [video.duration]);

  useEffect(() => {
    const checkForRecordedVideo = async () => {
      try {
        const stored = sessionStorage.getItem("recordedVideo");
        if (!stored) return;
        const { url, name, type, duration } = JSON.parse(stored);
        const blob = await fetch(url).then((res) => res.blob());
        const file = new File([blob], name, { type, lastModified: Date.now() });
        if (video.inputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          video.inputRef.current.files = dataTransfer.files;

          const event = new Event("change", { bubbles: true });
          video.inputRef.current.dispatchEvent(event);
          video.handleFileChange({
            target: { files: dataTransfer.files },
          } as ChangeEvent<HTMLInputElement>);
        }
        if (duration) setVideoDuration(duration);
        sessionStorage.removeItem("recordedVideo");
        URL.revokeObjectURL(url);
      } catch (e) {
        throw e;
        // console.error("Error Loading Recorded Video", e);
      }
    };
    checkForRecordedVideo();
  }, [video]);



  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!video.file || !thumbnail.file) {
        setError("Please Upload Video and Thumbnail");
        return;
      }
      if (!formData.title || !formData.description) {
        setError("Please fill all the details");
        return;
      }

      const video_res = await uploadVideoToCloudinary(video.file);
      // console.log("res", video_res);

      const thumbnail_res = await uploadThumbnailToCloudinary(thumbnail.file);
      // console.log(thumbnail_res);

      //Create a new Db Entry
      const res = await saveVideoDetails({

        videoId: uuidv4(),
        videoUrl: video_res.secure_url,
        thumbnailUrl: thumbnail_res.secure_url,
        ...formData,
        visibility: formData.visibility as Visibility,
        duration: videoDuration,
      });
      // console.log(res);

      router.push(`/video/${res.videoId}`);
    } catch (error) {
      toast.error("Upload Failed!!!");
      // console.error("Error Submitting Form: ", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="wrapper-md upload-page">
      <h1 className="tracking-normal">Upload a Video</h1>
      {error && <div className="error-field">{error}</div>}
      <form
        className="rounded-20 shadow-10 gap-6 w-full flex flex-col px-5 py-7.5"
        onSubmit={handleSubmit}
      >
        <FormField
          id="title"
          label="Title"
          value={formData.title}
          placeholder="Enter clear and concise video title"
          onChange={handleInputChange}
        />
        <FormField
          id="description"
          label="Description"
          value={formData.description}
          placeholder="Describe what this video is about"
          as="textarea"
          onChange={handleInputChange}
        />
        <FileInput
          id="video"
          label="Video"
          accept="video/*"
          file={video.file}
          previewUrl={video.previewUrl}
          inputRef={video.inputRef}
          onChange={video.handleFileChange}
          onReset={video.resetFile}
          type="video"
        />
        <FileInput
          id="thumbnail"
          label="Thumbnail"
          accept="image/*"
          file={thumbnail.file}
          previewUrl={thumbnail.previewUrl}
          inputRef={thumbnail.inputRef}
          onChange={thumbnail.handleFileChange}
          onReset={thumbnail.resetFile}
          type="image"
        />
        <FormField
          id="visibility"
          label="Visibility"
          value={formData.visibility}
          as="select"
          options={[
            { value: "public", label: "Public" },
            { value: "private", label: "Private" },
          ]}
          onChange={handleInputChange}
        />
        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? (
            <BeatLoader color="#ffffff" size={5} />
          ) : (
            "Upload Video"
          )}
        </button>
      </form>
    </div>
  );
};

export default Upload;
