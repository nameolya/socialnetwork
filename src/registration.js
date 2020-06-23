import React, { Component } from "react";
import axios from "axios";

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChange(e) {
        console.log("e.target.value:", e.target.value);
        console.log("e.target.name:", e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state:", this.state)
        );
    }

    submit() {
        console.log("submit request!");
        axios
            .post("/register", this.state)
            .then(({ data }) => {
                console.log("data from server:", data);
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => console.log("error in axios.post:", err));
    }

    render() {
        return (
            <div>
                <h1>Registration component:</h1>
                {this.state.error && (
                    <div> Something went wrong, please try again! </div>
                )}
                <input
                    name="first"
                    placeholder="first name"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    name="last"
                    placeholder="last name"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    name="email"
                    placeholder="email"
                    type="email"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    name="password"
                    placeholder="password"
                    type="password"
                    onChange={(e) => this.handleChange(e)}
                />
                <button onClick={() => this.submit()}>Submit</button>
            </div>
        );
    }
}

export default Registration;
