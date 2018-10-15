const abstractController = require('./abstractController');

exports.index = (req, res, next) => {
    abstractController.return_request(req, res, next, {
        msg: "Frontend Server is working fine"
    })
}