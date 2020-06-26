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
                this.props.changeBio(data);
                this.setState({ bioEditorIsVisible: false });
            })
            .catch((err) => console.log("error in axios.post:", err));
    }

    getCurrentDisplay() {
        if (this.state.bioEditorIsVisible) {
            return (
                <div>
                    <h1>Edit your bio:</h1>
                    <form>
                        <textarea
                            name="draftbio"
                            rows="4"
                            cols="50"
                            onChange={(e) => this.handleChange(e)}
                        >
                            {this.state.draftbio}
                        </textarea>
                        <button onClick={(e) => this.submitBio(e)}>
                            Submit
                        </button>
                    </form>
                    <p
                        onClick={() =>
                            this.setState({
                                bioEditorIsVisible: false,
                            })
                        }
                    >
                        x
                    </p>
                </div>
            );
        } else if (this.props.bio) {
            return (
                <div>
                    <p>{this.props.bio}</p>
                    <p
                        onClick={() =>
                            this.setState({
                                bioEditorIsVisible: true,
                            })
                        }
                    >
                        Edit bio
                    </p>
                </div>
            );
        } else {
            return (
                <div>
                    <p
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
