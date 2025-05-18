import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config, { isServer }) {   // <-- ajouter { isServer }
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  env: {
    API_URL: "http://localhost:3001/api",
    SECRET : "secret",
    NEXT_PUBLIC_EMAILJS_SERVICE_ID:"service_tyegafr",
    NEXT_PUBLIC_EMAILJS_TEMPLATE_ID : "template_l7v4ljs",
    NEXT_PUBLIC_EMAILJS_PUBLIC_KEY : "QL6iMrwhQi3fX0cdl"
  
  },
};

export default nextConfig;
