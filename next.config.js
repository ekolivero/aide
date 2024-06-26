/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
  experimental: {
    swcPlugins: [
      [
        require.resolve(
          "./next_component_hover.wasm"
        ),
        {},
      ],
    ],
  },
};

module.exports = nextConfig;
