const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    const token = req.headers['authorization'];

    if (token == undefined) {
        return res.status(403).json({
            status: false,
            message: "You don't have access permissions.",
        });
    }

    jwt.verify(token, 'ElectShop', function (error) {
        if (error) {
            return res.status(403).json({
                status: false,
                message: error.message,
            });
        }

        return next();
    });
};
