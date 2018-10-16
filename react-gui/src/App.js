import React, { Component } from 'react';
import logo from './logo.svg';
import Temperature from './components/Temperature';
import mqtt from 'mqtt';
import config from './config/config';
import { getMQTTmessageAsObject } from './utils/mqttUtils';
import axios from 'axios';

const MQTT_HOST = config.mqttUrl;
const MQTT_TOPIC = config.mqttTopic;

class App extends Component {
    constructor(props) {
        super(props);
        // Init the state of the component
        this.state = {
            resourceModel: null // Will contain all the resource saved on mongo
        };

        // Init MQTT broker
        this.clientMqtt = mqtt.connect(MQTT_HOST);
        this.clientMqtt.on('connect', () => {
            // On connect to MQTT host, subscribe topic
            this.clientMqtt.subscribe(MQTT_TOPIC);
            console.log('Client subscribed to topic: ' + MQTT_TOPIC);
        });
    }

    componentDidMount() {
        // Once component is ready we execute the code below

        this.loadResourceModelFromServer(); // Make the GET request for the resource model data

        // Create an handler to catch any message from MQTT
        this.clientMqtt.on('message', (topic, message, packet) => {
            let messageObject = getMQTTmessageAsObject(message.toString());
            // If message id is "modelUpdatedMsg" then load again the resource from mongo
            if (messageObject['msgID'] === 'modelUpdatedMsg') {
                this.loadResourceModelFromServer();
            }
        });
    }

    loadResourceModelFromServer = () => {
        // GET request doesn't need
        axios
            .get('/api/resource')
            .then(response => {
                this.setState({ resourceModel: response.data.resourceModel });
            })
            .catch(err => console.log(err));
    };

    render() {
        // Method used to inject the component (HTML) to the DOM
        console.log(this.state.resourceModel);
        return (
            <div className="App">
                <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbar"
                        aria-controls="navbar"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbar">
                        <a className="navbar-brand" href="/" onClick={event => this.handleLinkClick(event, 'home')}>
                            <img src={logo} width="30" height="30" className="d-inline-block align-top app-logo" alt="" />
                            UNIBO Code
                        </a>
                    </div>
                </nav>
                <div className="container">
                    <div className="row my-5">
                        <div className="col-12 col-md-10 col-lg-8 mx-auto">
                            {/* If resource model is not null create component Temperature passing temperature object from resource model */}
                            {this.state.resourceModel ? <Temperature temperature={this.state.resourceModel.sensors[0]} /> : ''}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
