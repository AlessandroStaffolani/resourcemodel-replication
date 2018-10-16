const ResourceModel = require('../model/resourceModel');
const Sensor = require('../model/sensor');
const Actuator = require('../model/actuator');
const Executor = require('../model/executor');
const ExecutorAction = require('../model/executorAction');

const get_resource_model = (populate = true) => {
    let resourceModel = ResourceModel.findOne({});
    if (populate) {
        resourceModel
            .populate('sensors')
            .populate('actuators')
            .populate({
                path: 'executors',
                populate: { path: 'actions' }
            })
            .populate({
                path: 'executors',
                populate: { path: 'actuators' }
            })
            .populate({
                path: 'executors',
                populate: { path: 'sensors' }
            })
            .populate({
                path: 'executors',
                populate: { path: 'last_action' }
            })

    }
    return resourceModel.then(resourceModel => resourceModel).catch(err => err);
};

const update_resource = (type, name, updatedData) => {
    let model = null;
    switch (type) {
        case 'sensor':
            model = Sensor;
            break;
        case 'actuator':
            model = Actuator;
            break;
        case 'executor':
            model = Executor;
            break;
        default: break;
    }
    if (model !== null) {
        return model.findOneAndUpdate({name: name}, updatedData, {new: true});
    } else {
        throw new Error('Model type error');
    }
};

const update_executors_last_action = (command) => {
    return ExecutorAction.findOne({command: command})
        .then(action => {
            return Executor.find({})
                .then(executors => {
                    executors.forEach(executor => {
                        executor.last_action = action._id;
                        return executor.save();
                    })
                })
        })
}

const update_sensonr_value = (category, name, value) => {
    return Sensor.findOneAndUpdate({category: category, name: name}, {value: value}, {new: true})
}

module.exports = {
    get_resource_model: get_resource_model,
    update_resource: update_resource,
    update_executors_last_action: update_executors_last_action,
    update_sensonr_value: update_sensonr_value,
};