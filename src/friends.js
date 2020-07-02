import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "./axios";
import { receiveFriendsWannabes } from "./actions";

export default function Friends() {
    const dispatch = useDispatch();
    const friends = useSelector(
        // (state) => state.friends && state.users.filter((user) => user.hot == null) ///friends
        (state) => state.friends
    );
    console.log("const friends:", friends);

    useEffect(() => {
        dispatch(receiveFriendsWannabes());
    }, []);

    return (
        <div>
            {friends.map((elem, idx) => {
                return (
                    <div key={idx}>
                        <img src={elem.imageurl} />
                        {elem.first}
                        {elem.last}
                    </div>
                );
            })}
        </div>
    );
}
