const { userLogger } = require("../singletons/logger")

function info(file,msg) {
    userLogger.info(`${file} : ${msg}`)
}
function error(file,msg) {
    userLogger.error(`${file} : ${msg}`)
}

module.exports = {
    info,
    error
}