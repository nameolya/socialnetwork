import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import {
    receiveFriendsWannabes,
    acceptFriendRequest,
    unfriend,
} from "./actions";

export default function Friends() {
    const history = useHistory();
    const dispatch = useDispatch();
    const friends = useSelector(
        (state) =>
            state.friends &&
            state.friends.filter((friend) => friend.accepted == true)
    );
    const wannabes = useSelector(
        (state) =>
            state.friends &&
            state.friends.filter(
                (friend) => friend.accepted == false && !friend.unfriended
            )
    );
    console.log("const friends:", friends);
    console.log("const wannabes:", wannabes);

    useEffect(() => {
        dispatch(receiveFriendsWannabes());
    }, []);

    if (!friends) {
        return null;
    }

    const routeChange = (id) => {
        let path = `/user/${id}`;
        history.push(path);
    };

    return (
        <div className="friends">
            <div className="friends-title">
                <h1>Your friends:</h1>
                {!friends.length && <p>you have no friends :(</p>}
            </div>
            <div className="friends-box">
                {friends.map((elem, idx) => {
                    return (
                        <div className="friend-container" key={idx}>
                            <div className="friend-profile-image">
                                <img
                                    className="small"
                                    onClick={(e) => routeChange(`${elem.id}`)}
                                    src={elem.imageurl}
                                />
                            </div>
                            <p className="friends-p">
                                {elem.first} {elem.last}
                            </p>
                            <button
                                className="friends-button"
                                onClick={(e) =>
                                    dispatch(unfriend(`${elem.id}`))
                                }
                            >
                                Remove from friends
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="wannabes-title">
                <h1> Friend requests: </h1>
                {!wannabes.length && <p>you have no friend requests</p>}
            </div>
            <div className="wannabes-box">
                {wannabes.map((elem, idx) => {
                    return (
                        <div className="wannabe-container" key={idx}>
                            <div className="friend-profile-image">
                                <img
                                    className="small"
                                    src={elem.imageurl}
                                    onClick={(e) => routeChange(`${elem.id}`)}
                                />
                            </div>
                            <p className="friends-p">
                                {elem.first} {elem.last}
                            </p>
                            <button
                                className="friends-button"
                                onClick={(e) =>
                                    dispatch(acceptFriendRequest(`${elem.id}`))
                                }
                            >
                                Accept friend request
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
