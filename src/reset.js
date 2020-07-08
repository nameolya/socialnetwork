import React, { Component } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

class Reset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
        };
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

    submitEmail(e) {
        e.preventDefault();
        console.log("submit email request!");
        axios
            .post("/reset/start", this.state)
            .then(({ data }) => {
                if (data.success) {
                    this.setState({
                        step: 2,
                    });
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => console.log("error in axios.post:", err));
    }

    submitCodeAndPassword(e) {
        e.preventDefault();
        console.log("submit pass reset code!");
        axios
            .post("/reset/verify", this.state)
            .then(({ data }) => {
                if (data.success) {
                    this.setState({
                        step: 3,
                    });
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => console.log("error in axios.post:", err));
    }

    getCurrentDisplay() {
        const step = this.state.step;

        if (step == 1) {
            return (
                <div className="reset">
                    <h1 className="welcome-component-header">Password reset</h1>
                    <input
                        className="welcome-input"
                        name="email"
                        placeholder="email"
                        type="email"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <button
                        className="welcome-button"
                        onClick={(e) => this.submitEmail(e)}
                    >
                        Submit
                    </button>
                    {this.state.error && (
                        <div className="error">
                            {" "}
                            Something went wrong, please try again!{" "}
                        </div>
                    )}
                </div>
            );
        } else if (step == 2) {
            return (
                <div className="reset">
                    <h1 className="welcome-component-header">Password reset</h1>

                    <p className="welcome-p">
                        We sent you a secret code on your email. The code is
                        valid 10 minutes. Please enter the code:
                    </p>

                    <input
                        className="welcome-input"
                        name="code"
                        placeholder="secret code"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <input
                        className="welcome-input"
                        name="password"
                        placeholder="new password"
                        type="password"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <button
                        className="welcome-button"
                        onClick={(e) => this.submitCodeAndPassword(e)}
                    >
                        Submit
                    </button>
                    {this.state.error && (
                        <div className="error">
                            Something went wrong, please try again!{" "}
                        </div>
                    )}
                </div>
            );
        } else {
            return (
                <div className="reset">
                    <h1 className="welcome-component-header">Password reset</h1>
                    {this.state.error && (
                        <div className="error">
                            Something went wrong, please try again!{" "}
                        </div>
                    )}
                    <p className="welcome-p">
                        Your password was successfully changed.
                    </p>
                    <Link className="welcome-link" to="/login">
                        Log in
                    </Link>
                </div>
            );
        }
    }

    render() {
        return <div>{this.getCurrentDisplay()}</div>;
    }
}

export default Reset;
