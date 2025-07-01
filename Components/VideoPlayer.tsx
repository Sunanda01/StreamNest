// import { createIframeLink } from "@/lib/util"
// import { VideoPlayerProps } from ".."

// const VideoPlayer = ({ videoId }: VideoPlayerProps) => {
//     return (
//         <div className="video-player">
//             <iframe
//                 //   ref={iframeRef}
//                 src={createIframeLink(videoId)}
//                 loading="lazy"
//                 title="Video player"
//                 style={{ border: 0, zIndex: 50 }}
//                 allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
//                 allowFullScreen
//             //   onLoad={() => setState((prev) => ({ ...prev, isLoaded: true }))}
//             />
//         </div>
//     )
// }

// export default VideoPlayer

"use client";

import { cn, createIframeLink } from "@/lib/util";
import { useEffect, useRef, useState } from "react";
import {
  incrementVideoViews,
  // getVideoProcessingStatus,
} from "@/lib/actions/video";
import { initialVideoState } from "@/constants";
import { VideoPlayerProps } from "..";

const VideoPlayer = ({ videoId, className, videoUrl, thumbnailUrl }: VideoPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [state, setState] = useState(initialVideoState);

  //   useEffect(() => {
  //     const checkProcessingStatus = async () => {
  //   const status = await getVideoProcessingStatus(videoId,videoUrl);
  //   console.log("Video processing status", status); // 👈 check what you get here
  //   setState((prev) => ({
  //     ...prev,
  //     isProcessing: !status.isProcessed,
  //   }));

  //   return status.isProcessed;
  // };


  //     checkProcessingStatus();

  //     const intervalId = setInterval(async () => {
  //       const isProcessed = await checkProcessingStatus();
  //       if (isProcessed) {
  //         clearInterval(intervalId);
  //       }
  //     }, 3000);
  //     return () => {
  //       clearInterval(intervalId);
  //     };
  //   }, [videoId]);

  useEffect(() => {
    if (state.isLoaded && !state.hasIncrementedView && !state.isProcessing) {
      const incrementView = async () => {
        try {
          await incrementVideoViews(videoId);
          setState((prev) => ({ ...prev, hasIncrementedView: true }));
        } catch (error) {
          console.error("Failed to increment view count:", error);
        }
      };

      incrementView();
    }
  }, [videoId, state.isLoaded, state.hasIncrementedView, state.isProcessing]);
  return (
    <div className={cn("video-player", className)}>
      <video
        controls
        preload="metadata"
        src={videoUrl}
        poster={thumbnailUrl} // ✅ Show preview frame before play
        style={{ width: "100%", borderRadius: 12, background: "#000" }}
        onError={(e) => console.error("Video failed to load:", e)}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );



  
      {/* {state.isProcessing ? (
      <div>
        <p>Processing video...</p>
      </div>
    ) : (
      <div>
        <video
          controls
          preload="metadata"
          src={videoUrl}
          // poster={thumbnailUrl} // ✅ Show preview frame before play
          style={{ width: "100%", borderRadius: 12, background: "#000" }}
          onError={(e) => console.error("Video failed to load:", e)}
        >
          Your browser does not support the video tag.
        </video>
      </div>
      
    )} */}
      
}

//   return (
//     <div className={cn("video-player", className)}>
//       {state.isProcessing ? (
//         <div>
//           <p>Processing video...</p>
//         </div>
//       ) : (
//         <div>
//           <video
//           controls
//           src={videoUrl}
//           style={{ width: '100%', border: 0 }}
//           // poster="https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/vTIMESTAMP/YOUR_THUMBNAIL_ID.jpg"
//         />

//         </div>
//       )}
//     </div>
//   );
// };

export default VideoPlayer;
