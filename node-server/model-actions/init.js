const ResourceModel = require('../model/resourceModel');
const Sensor = require('../model/sensor');
const Actuator = require('../model/actuator');
const Executor = require('../model/executor');
const ExecutorAction = require('../model/executorAction');
const config = require('../config/config');
const resourceModelAction = require('./actions');

const init = () => {
    ResourceModel.find()
        .then(resourceModel => {
            if (resourceModel.length === 0) {
                let initPromise = init_resource_model().then(() => {
                    let populateSensorsPromise = populate_sensors();
                    //let populateActuatorsPromise = resourceModelActions.populate_actuators();
                    //let populateExecutorsPromise = resourceModelActions.populate_executors();
            
                    let populateResourceModelPromie = Promise.all([
                        populateSensorsPromise,
                        //populateActuatorsPromise,
                        //populateExecutorsPromise
                    ]).then(results => {
                        resourceModelAction.get_resource_model().then(resourceModel => {
                            console.log(resourceModel);
                        });
                    });
                    populateResourceModelPromie.catch(err => console.log(err));
                });
                initPromise.catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
};

const init_resource_model = () => {
    let resourceModelData = {
        name: 'Resource Model',
        description: 'Object with all the resources of the system',
        manufacturer: 'Alessandro Staffolani',
        mqttHost: config.mqttUrl,
        mqttTopic: config.mqttTopic,
        sensors: [],
        actuators: [],
        executors: []
    };

    return create_document_if_not_exist(ResourceModel, resourceModelData);
};

const populate_sensors = () => {
    let temperatureData = {
        category: 'temperature',
        name: 'cityTemperature',
        value: 0,
        unit: 'gradi celsius',
        code: 1,
        maxValue: 20,
        description: 'Temperature of city: '
    };
    let tempPromise = create_document_if_not_exist(Sensor, temperatureData, { code: temperatureData.code });

    return add_array_of_object([tempPromise], 'sensors');
};

const populate_actuators = () => {};

const populate_executors = () => {
    generate_executor_actions()
        .then(actions => {
            let sensorsPromise = generate_executors_virtual_sensors();
            let actuatorsPromise = generate_executors_virtual_actuators();

            let virtualRobotPromise = Promise.all([sensorsPromise, actuatorsPromise]).then(results => {
                let virtualRobot = {
                    category: 'virtualRobot',
                    name: 'soffritti',
                    state: true,
                    code: 1,
                    actions: actions,
                    last_action: null,
                    description: 'Virtual robot',
                    sensors: results[0],
                    actuators: results[1]
                };
                return create_document_if_not_exist(Executor, virtualRobot, { code: virtualRobot.code });
            });

            sensorsPromise = generate_executors_real_sensors();
            actuatorsPromise = generate_executors_real_actuators();

            let realRobotPromise = Promise.all([sensorsPromise, actuatorsPromise]).then(results => {
                let realRobot = {
                    category: 'realRobot',
                    name: 'fuffolo',
                    state: true,
                    code: 2,
                    actions: actions,
                    last_action: null,
                    description: 'Real robot',
                    sensors: results[0],
                    actuators: results[1]
                };
                return create_document_if_not_exist(Executor, realRobot, { code: realRobot.code });
            });

            return add_array_of_object([virtualRobotPromise, realRobotPromise], 'executors');
        })
        .catch(err => err);
};

const create_document_if_not_exist = (model, objectData, queryParam = {}) => {
    return model
        .find(queryParam)
        .then(result => {
            if (result.length === 0) {
                let modelObject = new model(objectData).save();
                modelObject.then(modelObject => modelObject);
                modelObject.catch(err => err);
                return modelObject;
            }
        })
        .catch(err => err);
};

const generate_executor_actions = () => {
    let forward = {
        command: 'w',
        name: 'Forward',
        description: 'Go forward'
    };
    let wPromise = create_document_if_not_exist(ExecutorAction, forward, { command: forward.command });
    let right = {
        command: 'd',
        name: 'Right',
        description: 'Go right'
    };
    let dPromise = create_document_if_not_exist(ExecutorAction, right, { command: right.command });
    let left = {
        command: 'a',
        name: 'Left',
        description: 'Go left'
    };
    let aPromise = create_document_if_not_exist(ExecutorAction, left, { command: left.command });
    let backword = {
        command: 's',
        name: 'Backword',
        description: 'Go backword'
    };
    let sPromise = create_document_if_not_exist(ExecutorAction, backword, { command: backword.command });
    let stop = {
        command: 'h',
        name: 'Stop',
        description: 'Stop executor'
    };
    let hPromise = create_document_if_not_exist(ExecutorAction, stop, { command: stop.command });
    let auto = {
        command: 'auto',
        name: 'Autopilot',
        description: 'Autopilot'
    };
    let autoPromise = create_document_if_not_exist(ExecutorAction, auto, { command: auto.command });

    return Promise.all([wPromise, dPromise, aPromise, sPromise, hPromise, autoPromise]);
};

const generate_executors_virtual_sensors = () => {
    let sonar1Data = {
        category: 'sonarVirtual',
        name: 'sonar1',
        value: 0,
        unit: 'point',
        code: 3,
        description: 'Room sonar 1'
    };
    let sonar1Promise = create_document_if_not_exist(Sensor, sonar1Data, { code: sonar1Data.code });
    let sonar2Data = {
        category: 'sonarVirtual',
        name: 'sonar2',
        value: 0,
        unit: 'point',
        code: 4,
        description: 'Room sonar 2'
    };
    let sonar2Promise = create_document_if_not_exist(Sensor, sonar2Data, { code: sonar2Data.code });
    let sonar3Data = {
        category: 'sonarRobot',
        name: 'sonarVirtual',
        value: 0,
        unit: 'point',
        code: 5,
        description: 'Robot virtual sonar'
    };
    let sonar3Promise = create_document_if_not_exist(Sensor, sonar3Data, { code: sonar3Data.code });
    return Promise.all([sonar1Promise, sonar2Promise, sonar3Promise]);
};

const generate_executors_virtual_actuators = () => {
    let ledHueData = {
        category: 'leds',
        name: 'ledHue',
        value: false,
        code: 1,
        description: 'Philips hue lamp mock'
    };
    let ledHuePromise = create_document_if_not_exist(Actuator, ledHueData, { code: ledHueData.code });
    return Promise.all([ledHuePromise]);
};

const generate_executors_real_sensors = () => {
    let sonar4Data = {
        category: 'sonarRobot',
        name: 'sonarReal',
        value: 0,
        unit: 'point',
        code: 6,
        description: 'Robot real sonar'
    };
    let sonar4Promise = create_document_if_not_exist(Sensor, sonar4Data, { code: sonar4Data.code });
    return Promise.all([sonar4Promise]);
};

generate_executors_real_actuators = () => {
    let ledRealData = {
        category: 'leds',
        name: 'ledReal',
        value: false,
        code: 2,
        description: 'Real led on robot'
    };
    let ledRealPromise = create_document_if_not_exist(Actuator, ledRealData, { code: ledRealData.code });
    return Promise.all([ledRealPromise]);
};

const add_array_of_object = (arrayObjectPromise, field) => {
    arrayObjectPromise.push(resourceModelAction.get_resource_model(false));
    return Promise.all(arrayObjectPromise)
        .then(results => {
            let resourceModel = results[results.length - 1];
            for (let i = 0; i < results.length - 1; i++) {
                resourceModel[field].push(results[i]);
            }

            return resourceModel
                .save()
                .then(resourceModel => resourceModel)
                .catch(err => err);
        })
        .catch(err => err);
};

module.exports = {
    init: init
};
