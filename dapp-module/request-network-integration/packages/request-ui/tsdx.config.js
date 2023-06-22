const images = require('@rollup/plugin-image');

module.exports = {
  rollup(config, options) {
    config.plugins = [
      images({ include: ['**/*.svg', '**/*.png', '**/*.jpg'] }),
      ...config.plugins,
    ];

    return config;
  },
};
