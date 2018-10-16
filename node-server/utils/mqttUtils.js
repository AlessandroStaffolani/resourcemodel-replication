const mqtt = require('mqtt');
const config = require('../config/config');
const resourceModelActions = require('../model-actions/actions');

const topic = config.mqttTopic;
const client = mqtt.connect(config.mqttUrl);

client.on('connect', function() {
    client.subscribe(topic);
    console.log('client mqtt has subscribed successfully ');
});

//The command usually arrives as buffer, so I had to convert it to string data type;
client.on('message', function(topic, message) {
    console.log('mqtt RECEIVES:' + message.toString());

    messageObject = getMQTTmessageAsObject(message.toString());
    if (messageObject['msgID'] === 'updateModelMsg') {
        payloadObject = getPayloadAsObject(messageObject['payload']);
        if (payloadObject['type'] === 'sensor') {
            resourceModelActions.update_resource(payloadObject['type'], payloadObject['name'], { value: payloadObject['value'] })
                .then(updatedResource => {
                    let message = 'msg(modelUpdatedMsg,dispatch,node,react,modelUpdatedMsg(true),1)';
                    publish(message);
                })
                .catch(err => console.log(err));
        }
    }
});

const publish = msg => {
    console.log('mqtt publish ' + msg);
    client.publish(topic, msg);
}

const getMQTTmessageAsObject = message => {
    const messageObject = {};
    let splitted = message.split(',');
    messageObject['msgID'] = splitted[0].replace('msg(', '');
    messageObject['type'] = splitted[1];
    messageObject['sender'] = splitted[2];
    messageObject['receiver'] = splitted[3];
    messageObject['payload'] = splitted[4] + ',' + splitted[5] + ',' + splitted[6] + ',' + splitted[7];

    return messageObject;
};

const getPayloadAsObject = payload => {
    const payloadObject = {};
    let splitted = payload.split(',');
    payloadObject['type'] = splitted[0].replace('resource(', '');
    payloadObject['categ'] = splitted[1];
    payloadObject['name'] = splitted[2];
    payloadObject['value'] = splitted[3].replace(')', '');;

    return payloadObject;
};

module.exports = {
    publish
};