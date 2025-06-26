const withTM = require("next-transpile-modules")([
  "rc-util",
  "rc-pagination",
  "rc-picker",
  "@ant-design/icons-svg",
  "rc-input",
]);

const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

module.exports = withTM(nextConfig);
