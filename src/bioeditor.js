import React, { Component } from "react";
import axios from "./axios";

class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bioEditorIsVisible: false,
            draftbio: props.bio,
        };
        console.log("props in BioEditor: ", props);
        console.log("props.bio in BioEditor: ", props.bio);
        console.log(
            "this.state.bioEditorIsVisible in BioEditor: ",
            this.state.bioEditorIsVisible
        );
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

    submitBio(e) {
        e.preventDefault();
        console.log("submit bio request!");
        axios
            .post("/user/edit-bio", this.state)
            .then(({ data }) => {
                console.log("data from server:", data);
                this.props.changeBio(data.bio);
                console.log("this.props.bio after change:", this.props.bio);
                this.setState({ bioEditorIsVisible: false });
            })
            .catch((err) => console.log("error in axios.post:", err));
    }

    getCurrentDisplay() {
        if (this.state.bioEditorIsVisible) {
            return (
                <div className="bio-editor">
                    <h2>Edit your bio:</h2>
                    <textarea
                        className="bio-editor-textarea"
                        name="draftbio"
                        rows="3"
                        cols="50"
                        required
                        onChange={(e) => this.handleChange(e)}
                    >
                        {this.state.draftbio}
                    </textarea>
                    <p
                        className="edit-bio-p"
                        onClick={(e) => this.submitBio(e)}
                    >
                        Save
                    </p>
                    <p
                        className="edit-bio-p"
                        onClick={() =>
                            this.setState({
                                bioEditorIsVisible: false,
                            })
                        }
                    >
                        Go back
                    </p>
                </div>
            );
        } else if (this.props.bio) {
            return (
                <div className="bio-container">
                    <p className="bio-text">{this.props.bio}</p>

                    <i
                        onClick={() =>
                            this.setState({
                                bioEditorIsVisible: true,
                            })
                        }
                        class="em em-pencil2"
                        aria-role="presentation"
                        aria-label="PENCIL"
                    ></i>
                </div>
            );
        } else {
            return (
                <div>
                    <p
                        className="edit-bio-p"
                        onClick={() =>
                            this.setState({
                                bioEditorIsVisible: true,
                            })
                        }
                    >
                        Add bio
                    </p>
                </div>
            );
        }
    }
    render() {
        return <div>{this.getCurrentDisplay()}</div>;
    }
}

export default BioEditor;
