const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_CONFIG_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_CONFIG_SUPABASE_PUBLISHABLE_KEY,
  },
};