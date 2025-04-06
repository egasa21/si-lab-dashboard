import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_PRESET: process.env.PRESET_NAME,
    NEXT_PUBLIC_CLOUDINARY_API: process.env.CLOUDINARY_URL,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME
  },
};

export default nextConfig;
