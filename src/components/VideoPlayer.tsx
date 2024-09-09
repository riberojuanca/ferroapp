"use client";

import { useEffect, useRef } from "react";
import "plyr/dist/plyr.css"; // Asegúrate de importar los estilos de Plyr
import Plyr from "plyr";
import Hls from "hls.js";

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    // Initialize Plyr
    const player = new Plyr(video, {
      captions: { active: true, update: true, language: "en" },
    });

    const source =
      "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(source);
      hls.attachMedia(video);

      // Attach to window object with type assertion
      (window as Window & { hls?: Hls }).hls = hls;

      // Handle changing captions
      player.on("languagechange", () => {
        setTimeout(() => {
          hls.subtitleTrack = player.currentTrack;
        }, 50);
      });
    } else {
      video.src = source;
    }

    // Cleanup on component unmount
    return () => {
      player.destroy();
      const windowHls = (window as Window & { hls?: Hls }).hls;
      if (windowHls) {
        windowHls.destroy();
      }
    };
  }, []);

  return (
    <video
      style={{ width: "100%", height: "auto" }}
      ref={videoRef}
      controls
      crossOrigin="anonymous"
      playsInline
      poster="https://bitdash-a.akamaihd.net/content/sintel/poster.png"
    />
  );
};

export default VideoPlayer;
