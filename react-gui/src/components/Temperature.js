import React, { Component } from 'react';
import '../components-styles/temperature.css';

export default class Temperature extends Component {
    render() {
        // Component get temperature from props (from parent component)
        const { temperature } = this.props;
        console.log(temperature);
        return (
            <div className="temperature">
                <h1 className="mb-4">TEMPERATURE: {temperature.value} C°</h1>
                {temperature.value > 20 ? (
                    <div className="text-center text-warning">
                        <i className="fas fa-exclamation-triangle fa-10x" />
                    </div>
                ) : (
                    <div className="text-center text-success">
                        <i className="fas fa-check-circle fa-10x" />
                    </div>
                )}
            </div>
        );
    }
}
