const jwt = require('jsonwebtoken');
const { secret } = require('../secret');

module.exports = function (roles) {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next();
        }

        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                res.status(403).json({ message: 'User is not authorized' });
            }

            const { roles: userRoles } = jwt.verify(token, secret);

            let hasRole = false;
            userRoles.forEach((role) => {
                if (roles.includes(role)) {
                    hasRole = true;
                }
            });

            if (!hasRole) {
                res.status(403).json({ message: "You don't have access" });
            }

            next();
        } catch (err) {
            console.log(err.message);
            res.status(403).json({ message: 'User is not authorized' });
        }
    };
};
