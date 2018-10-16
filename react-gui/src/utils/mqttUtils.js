

export const getMQTTmessageAsObject = message => {
    const messageObject = {};
    let splitted = message.split(',');
    messageObject['msgID'] = splitted[0].replace('msg(', '');
    messageObject['type'] = splitted[1];
    messageObject['sender'] = splitted[2];
    messageObject['receiver'] = splitted[3];
    messageObject['payload'] = splitted[4];

    return messageObject;
};