const jwt = require('jsonwebtoken');
const SecretKey = require('../config.json').SecretKey
const file = '[middlewares/verifyToken.js]'
const logger = require('logger-line-number')

function verifyToken(req, res, next) {
    try {
        const token = req.headers['authorization'] || req.cookies.uToken;
        if (!token) {
            throw new Error('Unauthorise')
        }
        const decoded = jwt.verify(token, SecretKey.JWT_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        logger.log(file, err)
        return res.status(401).send({
            Status: 400,
            Response: err.toString()
        })
    }
}


module.exports = verifyToken