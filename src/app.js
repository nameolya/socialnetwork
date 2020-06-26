import React from "react";
import axios from "./axios";
import Logo from "./logo";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
        };
    }

    toggleModal() {
        this.setState({
            //updates to an opposite true/false of what is currently in:
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    newUserImage(arg) {
        console.log("newUserImage is running in App, argument is: ", arg);
        this.setState({ imageUrl: arg });
    }

    changeBio(arg) {
        console.log("changeBio is running in App, argument is: ", arg);
        this.setState({ bio: arg });
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
                    bio: data.bio,
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
                        newUserImage={(arg) => this.newUserImage(arg)}
                        toggleModal={() => this.toggleModal()}
                    />
                )}

                <Profile
                    first={this.state.first}
                    last={this.state.last}
                    imageUrl={this.state.imageUrl}
                    bio={this.state.bio}
                    toggleModal={() => this.toggleModal()}
                    changeBio={(arg) => this.changeBio(arg)}
                />
            </div>
        );
    }
}
