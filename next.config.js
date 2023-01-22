/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
}

const withTM = require('next-transpile-modules')(['hashconnect']);

module.exports = { ...nextConfig, ...withTM() }
