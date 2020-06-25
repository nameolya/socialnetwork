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
        let file = e.target.files[0];
        let formData = new FormData();
        formData.append("image", file);
        axios
            .post("/user/pic-upload", formData)
            .then((data) => {
                console.log(
                    "data from server in axios POST pic upload:",
                    data.data.imageUrl
                );
                this.props.newUserImage(data.data.imageUrl);
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
