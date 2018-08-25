// module.exports = (req, res, next) => {
//     const user = req.user;
//     if (user.role === 'user') {
//         return next();
//     }
//     res.send(401, 'Unauthorized');
// };

module.exports = {
    isBusiness(req, res, next) {
        if (req.user.role === 'user' || req.user.role === 'admin') {
            return next();
        }
        return res.send(401, 'UnAuthorized');
    },
    isLawyer(req, res, next) {
        if (req.user.role === 'lawyer' || req.user.role === 'admin') {
            return next();
        }
        return res.send(401, 'UnAuthorized');
    },
    isAdmin(req, res, next) {
        if (req.user.role === 'admin') {
            return next();
        }
        return res.send(401, 'UnAuthorized');
    }
};
