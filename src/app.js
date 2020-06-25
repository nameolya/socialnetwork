import React from "react";
import Logo from "./logo";
import ProfilePic from "./profilePic";
import Uploader from "./uploader";
import axios from "./axios";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            ///hardcoded, this should come from axior request to database and setState
            // first: "Olga",
            // last: "Iva",
            uploaderIsVisible: false,
        };
    }

    toggleModal() {
        this.setState({
            //updates to an opposite true/false of what is currently in:
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    methodInApp(arg) {
        console.log("Im running in App!!! and my argument is: ", arg);
        this.setState({ imageUrl: arg });
        this.toggleModal();
    }

    componentDidMount() {
        console.log("app mounted!");
        axios
            .get("/user")
            .then(({ data }) => {
                console.log("data from server:", data);

                this.setState({
                    first: data.first,
                    last: data.last,
                    imageUrl: data.imageUrl,
                });
            })
            .catch((err) => console.log("error in axios.get:", err));
    }

    render() {
        return (
            <div>
                <h1>Here goes the App</h1>
                <Logo />
                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    imageUrl={this.state.imageUrl}
                    toggleModal={() => this.toggleModal()}
                />
                {this.state.uploaderIsVisible && (
                    <Uploader
                        methodInApp={this.methodInApp}
                        toggleModal={() => this.toggleModal()}
                    />
                )}
            </div>
        );
    }
}
