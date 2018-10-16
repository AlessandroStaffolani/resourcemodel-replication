const express = require('express');
const resourceModelController = require('../../controller/resourceModelController');

const router = express.Router();

router.get("/", resourceModelController.get_resourcemodel);

router.get("/sensors", resourceModelController.get_sensors);

router.get("/sensors/:name", resourceModelController.get_sensor_by_name);

module.exports = router;