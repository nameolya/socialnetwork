import React, { Component } from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        console.log("props in Uploader: ", props);
    }

    componentDidMount() {
        console.log("uploader mounted!");
    }
    handleChange(e) {
        // console.log("e.target.value:", e.target.value);
        // console.log("e.target.name:", e.target.name);
        // this.setState(
        //     {
        //         [e.target.name]: e.target.value,
        //     },
        //     () => console.log("this.state:", this.state)
        // );

        let file = e.target.files[0];
        let formData = new FormData();
        formData.append("image", file);
        axios
            .post("/user/pic-upload", formData)
            .then((data) => {
                console.log("data from server in axios POST pic upload:", data);
                this.props.methodInApp(data);
            })
            .catch((err) => console.log("error in axios.post:", err));
    }

    render() {
        return (
            <div>
                <h2 className="uploader-text">Want to change your image?</h2>
                <input
                    type="file"
                    name="file"
                    accept="image/*"
                    onChange={(e) => this.handleChange(e)}
                />
                <p onClick={this.props.toggleModal}>x</p>
            </div>
        );
    }
}
