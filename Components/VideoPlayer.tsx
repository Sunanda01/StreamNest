"use client";
import { cn } from "@/lib/util";
import { useEffect } from "react";
import {
  incrementVideoViews,
} from "@/lib/actions/video";

import { VideoPlayerProps } from "..";

const VideoPlayer = ({ videoId, className, videoUrl, thumbnailUrl }: VideoPlayerProps) => {
  useEffect(() => {
    const incrementView = async () => {
      try {
        await incrementVideoViews(videoId);
      } catch (error) {
        // console.error("Failed to increment view count:", error);
        throw error;
      }
    };

    incrementView();
  }, [videoId]);
  return (
    <div className={cn("video-player", className)}>
      <video
        controls
        preload="metadata"
        src={videoUrl}
        poster={thumbnailUrl} // ✅ Show preview frame before play
        style={{ width: "100%", borderRadius: 12, background: "#000" }}
        onError={(e) => {
          console.error("Video failed to load:", e)
          throw e
        }}
      />
    </div>
  );
}
export default VideoPlayer;
