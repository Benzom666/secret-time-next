const path = require("path");
require("dotenv").config();

module.exports = {
  images: {
    domains: [
      "lesociety.s3.ca-central-1.amazonaws.com",
      "secrettime-cdn.s3.eu-west-2.amazonaws.com",
      "d2hill0ae3zx76.cloudfront.net",
    ],
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
