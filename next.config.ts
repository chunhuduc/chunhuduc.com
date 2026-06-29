import type { NextConfig } from "next";

const CV_DOWNLOAD_FILENAME = "Chu-Nhu-Duc-Solution-Architect-CV-2026-06-30.pdf";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Force the CV to download with a readable, recruiter-friendly filename.
        // The static asset stays at /cv.pdf for the SA generation pipeline; this
        // header (which takes precedence over the anchor `download` attribute)
        // controls the saved name even on direct navigation.
        source: "/cv.pdf",
        headers: [
          {
            key: "Content-Disposition",
            value: `attachment; filename="${CV_DOWNLOAD_FILENAME}"`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
