const abstractController = require('./abstractController');

// Load model objects
const ResourceModel = require('../model/resourceModel');
const Sensor = require('../model/sensor');

// Load resourcemodel actions
const resourceModelActions = require('../model-actions/actions');

exports.get_resourcemodel = (req, res, next) => {
    resourceModelActions
        .get_resource_model(true)
        .then(resourceModel => abstractController.return_request(req, res, next, { resourceModel }))
        .catch(err => next(err));
};

exports.get_sensors = (req, res, next) => {
    Sensor.find()
        .then(sensors => abstractController.return_request(req, res, next, { sensors }))
        .catch(err => next(err));
};

exports.get_sensor_by_name = (req, res, next) => {
    Sensor.findOne({ name: req.params.name })
        .then(sensor => abstractController.return_request(req, res, next, { sensor }))
        .catch(err => next(err));
};
