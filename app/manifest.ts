import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    short_name: "StreamNest",
    name: "StreamNest",
    description: "Capture. Upload. Share effortlessly",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color: "#2196f3",
    background_color: "#2196f3",
    display: "standalone",
    scope: "/",
    start_url: "/",
  };
}
