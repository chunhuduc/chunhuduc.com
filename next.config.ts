import type { NextConfig } from "next";

// Dateless fallback name for direct navigation to /cv.pdf. The Download CV
// buttons (components/DownloadCvButton.tsx) stamp the click date themselves.
const CV_DOWNLOAD_FILENAME = "Chu-Nhu-Duc-Solution-Architect-CV.pdf";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Force the CV to download with a readable, recruiter-friendly filename
        // when the URL is opened directly. The static asset stays at /cv.pdf for
        // the SA generation pipeline.
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
