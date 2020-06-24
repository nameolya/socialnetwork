import React from "react";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        console.log("app mounted!");
    }
    render() {
        return (
            <div>
                <h1>Here goes the App</h1>
            </div>
        );
    }
}
