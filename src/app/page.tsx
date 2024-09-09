"use client";

import React, { useEffect, useRef } from "react";
import "plyr/dist/plyr.css"; // Asegúrate de que este CSS esté disponible en el cliente
import Hls from "hls.js";

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    // Import Plyr dynamically
    import("plyr").then((Plyr) => {
      const plyrInstance = new Plyr.default(video, {
        captions: { active: true, update: true, language: "en" },
      });

      const source = "http://localhost:8081/hls/stream.m3u8"; // Cambia la URL aquí

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          plyrInstance.play();
        });

        // Handle changing captions
        plyrInstance.on("languagechange", () => {
          setTimeout(() => {
            hls.subtitleTrack = plyrInstance.currentTrack;
          }, 50);
        });

        return () => {
          hls.destroy();
        };
      } else {
        video.src = source;
      }

      return () => {
        plyrInstance.destroy();
      };
    });
  }, []);

  return (
    <section className="w-full h-screen flex justify-center items-center">
      <video
        ref={videoRef}
        controls
        crossOrigin="anonymous"
        playsInline
        poster="http://localhost:8081/path/to/your/poster.png" // Cambia la URL aquí
      />
    </section>
  );
};

export default VideoPlayer;
