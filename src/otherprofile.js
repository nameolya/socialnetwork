import React, { Component } from "react";
import axios from "./axios";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    async componentDidMount() {
        const id = this.props.match.params.id;
        const { data } = await axios.get(`/user/${id}.json`);
        console.log("axios.get request user/id route, data:", data);
        console.log("otherprofile mounted!!");

        if (data.isSelf) {
            // server determined that the user whose data was requested is the user who made the request
            // redirect
            this.props.history.push("/");
        } else {
            this.setState(data);
        }
    }
    render() {
        return (
            <div>
                <img src={this.state.imageUrl} />
                <h1>
                    {this.state.first}
                    {this.state.last}
                </h1>
                <p>{this.state.bio}</p>
            </div>
        );
    }
}
