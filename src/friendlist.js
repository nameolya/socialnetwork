import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { receiveBuddies, receiveConnections } from "./actions";

export default function Friends(props) {
    const history = useHistory();
    const dispatch = useDispatch();
    const otherId = props.otherId;
    const connections = useSelector((state) => state.connections);
    const buddies = useSelector((state) => state.buddies);
    console.log("const buddies:", buddies);
    console.log("const connections:", connections);

    // const mutuals = useSelector((state) => {
    //     state.buddies.filter((buddy) => {
    //         return state.connections.indexOf(buddy) != -1;
    //     });
    // });
    // console.log("const mutuals:", mutuals);
    console.log("const buddies:", buddies);

    useEffect(() => {
        dispatch(receiveBuddies(otherId));
        dispatch(receiveConnections());
    }, []);

    if (!buddies) {
        return null;
    }

    const routeChange = (id) => {
        let path = `/user/${id}`;
        history.push(path);
    };

    return (
        <div className="friendlist">
            {/* <div className="friends-title">
                {mutuals.length && <h1>Mutual friends:</h1>}
            </div>
            <div className="friends-box">
                {mutuals.map((elem, idx) => {
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
                        </div>
                    );
                })}
            </div> */}

            <div>
                {buddies.length && <p className="friendlist-p"> Friends: </p>}
            </div>
            <div className="friendlist-box">
                {buddies.map((elem, idx) => {
                    return (
                        <div className="friendlist-container" key={idx}>
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
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
