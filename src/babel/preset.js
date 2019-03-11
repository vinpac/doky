const { PluginItem } = require('@babel/core')

const env = process.env.NODE_ENV
const isProduction = env === 'production'
const isDevelopment = env === 'development'
const isTest = env === 'test'

module.exports = (_, options = {}) => {
  const presetEnvConfig = {
    // In the test environment `modules` is often needed to be set to true, babel figures that out by itself using the `'auto'` option
    // In production/development this option is set to `false` so that webpack can handle import/export with tree-shaking
    modules: isDevelopment || isProduction ? false : 'auto',
    ...options['preset-env'],
  }

  return {
    presets: [
      [require('@babel/preset-env').default, presetEnvConfig],
      [
        require('@babel/preset-react'),
        {
          // This adds @babel/plugin-transform-react-jsx-source and
          // @babel/plugin-transform-react-jsx-self automatically in development
          development: isDevelopment || isTest,
          ...options['preset-react'],
        },
      ],
    ],
    plugins: [
      require('babel-plugin-react-require'),
      require('@babel/plugin-syntax-dynamic-import'),
      [
        require('@babel/plugin-proposal-class-properties'),
        options['class-properties'] || {},
      ],
      require('@babel/plugin-proposal-object-rest-spread'),
      [
        require('@babel/plugin-transform-runtime'),
        {
          corejs: 2,
          helpers: true,
          regenerator: true,
          useESModules: !isTest && presetEnvConfig.modules !== 'commonjs',
          ...options['transform-runtime'],
        },
      ],
      process.env.NODE_ENV === 'production' &&
        require('babel-plugin-transform-react-remove-prop-types'),
    ].filter(Boolean),
  }
}
