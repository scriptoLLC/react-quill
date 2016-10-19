if (process.env.NODE_ENV === 'dev') {
  module.exports = window.React
} else {
  module.exports = require('react')
}
