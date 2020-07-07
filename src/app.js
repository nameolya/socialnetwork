import React from "react";
import axios from "./axios";
import Logo from "./logo";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import OtherProfile from "./otherprofile";
import FindPeople from "./findpeople";
import Friends from "./friends";
import { BrowserRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import Chat from "./chat";

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
            .get("/app/user")
            .then(({ data }) => {
                console.log("GET request in app, data from server:", data);

                this.setState({
                    first: data.first,
                    last: data.last,
                    imageUrl: data.imageUrl,
                    bio: data.bio,
                    id: data.id,
                });
            })
            .catch((err) => console.log("error in axios.get:", err));
    }

    render() {
        return (
            <BrowserRouter>
                <div className="main">
                    <div className="header">
                        <div className="logo-container">
                            <Logo />
                        </div>
                        <div>
                            <h1 className="main-header">CITRUS</h1>
                            <h1 className="main-header">
                                Healthy food community
                            </h1>
                            <div className="header-menu">
                                <Link to="/">Home</Link>
                                <Link to="/users">Find People</Link>
                                <Link to="/friends">Friends</Link>
                                <Link to="/chat">Chat</Link>
                            </div>
                        </div>
                        <div className="profile-image">
                            <ProfilePic
                                first={this.state.first}
                                last={this.state.last}
                                imageUrl={this.state.imageUrl}
                                imageSize="small"
                                toggleModal={() => this.toggleModal()}
                            />
                        </div>
                    </div>

                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                first={this.state.first}
                                last={this.state.last}
                                imageUrl={this.state.imageUrl}
                                bio={this.state.bio}
                                imageSize="large"
                                toggleModal={() => this.toggleModal()}
                                changeBio={(arg) => this.changeBio(arg)}
                            />
                        )}
                    />
                    <Route
                        path="/user/:id"
                        render={(props) => (
                            <OtherProfile
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />

                    <Route path="/users" component={FindPeople} />

                    <Route path="/friends" component={Friends} />

                    <Route path="/chat" component={Chat} />

                    {this.state.uploaderIsVisible && (
                        <Uploader
                            newUserImage={(arg) => this.newUserImage(arg)}
                            toggleModal={() => this.toggleModal()}
                        />
                    )}
                </div>
            </BrowserRouter>
        );
    }
}
