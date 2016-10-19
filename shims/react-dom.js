if (process.env.NODE_ENV === 'dev') {
  module.exports = window.ReactDOM
} else {
  module.exports = require('react-dom')
}
