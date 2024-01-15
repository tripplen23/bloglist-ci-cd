// TODO: Printing normal log messages
const info = (...params) => {
  console.log(...params)
}
// TODO: Printing all error messages
const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info,
  error,
}
