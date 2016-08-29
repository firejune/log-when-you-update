module.exports = {
  type: 'react-component',
  build: {
    externals: {
      'react': 'React'
    },
    global: 'LogWhenYouUpdate',
    jsNext: false,
    umd: true
  }
}
