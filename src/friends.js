import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    receiveFriendsWannabes,
    acceptFriendRequest,
    unfriend,
} from "./actions";

export default function Friends() {
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

    return (
        <div>
            <div>
                <h1>Your friends:</h1>
                {!friends.length && <p>you have no friends :(</p>}
                {friends.map((elem, idx) => {
                    return (
                        <div key={idx}>
                            <img src={elem.imageurl} />
                            {elem.first}
                            {elem.last}
                            <p
                                onClick={(e) =>
                                    dispatch(unfriend(`${elem.id}`))
                                }
                            >
                                Remove from friends
                            </p>
                        </div>
                    );
                })}
            </div>
            <div>
                <h1> Friend requests: </h1>
                {!wannabes.length && <p>you have no friend requests</p>}
                {wannabes.map((elem, idx) => {
                    return (
                        <div key={idx}>
                            <img src={elem.imageurl} />
                            {elem.first}
                            {elem.last}
                            <p
                                onClick={(e) =>
                                    dispatch(acceptFriendRequest(`${elem.id}`))
                                }
                            >
                                Accept friend request
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
