import React, { Component } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

class Login extends Component {
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

    submit(e) {
        e.preventDefault();
        console.log("submit request!");
        axios
            .post("/login", this.state)
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
            <div className="login">
                <h1 className="welcome-component-header">Login</h1>

                <input
                    className="welcome-input"
                    name="email"
                    placeholder="email"
                    type="email"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    className="welcome-input"
                    name="password"
                    placeholder="password"
                    type="password"
                    onChange={(e) => this.handleChange(e)}
                />
                <button
                    className="welcome-button"
                    onClick={(e) => this.submit(e)}
                >
                    Submit
                </button>

                {this.state.error && (
                    <div> Something went wrong, please try again! </div>
                )}

                <Link className="welcome-link" to="/reset">
                    {" "}
                    Reset password{" "}
                </Link>
                <Link className="welcome-link" to="/">
                    {" "}
                    Register
                </Link>
            </div>
        );
    }
}

export default Login;
