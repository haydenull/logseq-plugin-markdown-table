module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  babel: {
    plugins: [['import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: 'css',
    }]],
  },
  // babel: {
  //   loaderOptions: {
  //     exclude: /node_modules/,
  //   }
  // }
}