/** @type {import('next').NextConfig} */
// import withPWA from 'next-pwa';
const withPWA = require('next-pwa')

const nextConfig = {
  reactStrictMode: true,
}

module.exports = withPWA({
  pwa: {
    dest: 'public',
    sw: 'service-worker.js'
  },
  ...nextConfig
});