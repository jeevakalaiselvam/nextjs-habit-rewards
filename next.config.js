const withTM = require('next-transpile-modules')([
  'rc-util',
  'rc-pagination',
  'rc-picker',
  '@ant-design/icons-svg',
  'rc-input',
]);

const nextConfig = {};

module.exports = withTM(nextConfig);
