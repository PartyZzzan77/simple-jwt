const jwt = require('jsonwebtoken');
const { secret } = require('../secret');

module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            res.status(403).json({ message: 'User is not authorized' });
        }

        const decodeData = jwt.verify(token, secret);

        req.user = decodeData;
        next();
    } catch (err) {
        console.log(err.message);
        res.status(403).json({ message: 'User is not authorized' });
    }
};
