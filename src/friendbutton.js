import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton(props) {
    console.log("props in FriendButton:", props);
    const [buttonText, setButtonText] = useState("");

    useEffect(() => {
        (async () => {
            const { data } = await axios.get(
                `/app/check-friendship/${props.otherId}`
            );
            console.log("get request data /app/check-friendship/", data[0][0]);
            if (data[0].length == 0) {
                setButtonText("Send Friend Request");
            } else if (data[0][0].accepted) {
                setButtonText("Unfriend");
            } else if (data[0][0].sender_id == data[1]) {
                setButtonText("Cancel Friend Request");
            } else {
                setButtonText("Accept Friend Request");
            }
        })();
    }, []);

    const onClick = async (e) => {
        e.preventDefault(e);
        let buttonText = e.target.innerHTML.split(" ").join("-");
        console.log("buttonText:", buttonText);

        try {
            const { data } = await axios.post(
                `/app/${buttonText}/${props.otherId}`
            );
            console.log(
                "post request data /app/${buttonText}/${props.otherId}",
                data
            );

            if (!data.success) {
                setError(true);
            } else {
                if ((buttonText = "Accept-Friend-Request")) {
                    setButtonText("Unfriend");
                }
                if ((buttonText = "Send-Friend-Request")) {
                    setButtonText("Cancel Friend Request");
                }
                if ((buttonText = "Unfriend")) {
                    setButtonText("Send Friend Request");
                }
                if ((buttonText = "Cancel-Friend-Request")) {
                    setButtonText("Send Friend Request");
                }
            }
        } catch (err) {
            console.log("something went wrong... make a p for that");
        }
    };

    return <button onClick={(e) => onClick(e)}>{buttonText}</button>;
}
