const path = require("path");
require("dotenv").config();

const buildImageRemotePatterns = () => {
  const patterns = [
    // Vercel Blob storage patterns
    {
      protocol: "https",
      hostname: "*.public.blob.vercel-storage.com",
    },
    {
      protocol: "https",
      hostname: "public.blob.vercel-storage.com",
    },
    // Legacy S3/CloudFront patterns (for migration period)
    {
      protocol: "https",
      hostname: "secrettime-cdn.s3.eu-west-2.amazonaws.com",
    },
    {
      protocol: "https",
      hostname: "*.s3.*.amazonaws.com",
    },
    {
      protocol: "https",
      hostname: "d2hill0ae3zx76.cloudfront.net",
    },
    {
      protocol: "https",
      hostname: "i.ibb.co", // placeholder images
    },
  ];

  // Add custom domains from env if provided
  if (process.env.NEXT_PUBLIC_IMAGE_DOMAINS) {
    const extraDomains = process.env.NEXT_PUBLIC_IMAGE_DOMAINS.split(",")
      .map((domain) => domain.trim())
      .filter(Boolean);
    extraDomains.forEach((hostname) => {
      patterns.push({ protocol: "https", hostname });
    });
  }

  return patterns;
};

module.exports = {
  images: {
    remotePatterns: buildImageRemotePatterns(),
    unoptimized: true,
  },

  devIndicators: {
    autoPrerender: false,
    buildActivity: false,
  },

  env: {
    modules: ["auth", "event"],
    MAPBOX_TOKEN:
      "pk.eyJ1Ijoic2VjcmV0dGltZSIsImEiOiJja3poN3dhY2IwZXk3Mm5vMmlqdnpqMDNxIn0.RELof70VoVmL4Y4-C8HHmw",
  },
  async redirects() {
    return [
      // {
      //   source: "/home",
      //   destination: "/",
      //   permanent: true,
      // },
    ];
  },
};
