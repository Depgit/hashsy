const { createLogger, format, transports, config } = require('winston');

const userLogger = createLogger({
    transports: [
        new transports.Console()
    ]
});
const timeLogger = createLogger({
    transports: [
        new transports.Console()
    ]
});
module.exports = {
    userLogger,
    timeLogger
};
