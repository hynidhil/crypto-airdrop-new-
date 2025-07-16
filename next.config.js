/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    forceSwcTransforms: false,
  },
  env: {
    NEXT_FORCE_ESBUILD: '1',
  },
}

module.exports = nextConfig