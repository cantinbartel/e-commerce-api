const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_KEY, (err, user) => {
            if(err) res.status(403).json('Token is not valid') // 403 Forbidden
            req.user = user;
            next();
        })
    } else {
        return res.status(401).json('You are not authenticated'); // 401 Unauthorized
    }
};

const checkTokenAndAuthorization = (req, res, next) => {
    checkToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json({ message: 'You are bot allowed to execute that action' });
        }
    })
};

const checkTokenAndAdmin = (req, res, next) => {
    checkToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json({ message: 'You are not allowed to execute that action' });
        }
    })
};

module.exports = { 
    checkToken, 
    checkTokenAndAuthorization,
    checkTokenAndAdmin
};