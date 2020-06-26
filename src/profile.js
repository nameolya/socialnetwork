import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bioeditor";

export default function Profile(props) {
    console.log("props in Profile:", props);
    return (
        <div>
            <h1>
                {props.first} {props.last}
            </h1>
            <ProfilePic
                first={props.first}
                last={props.last}
                imageUrl={props.imageUrl}
                toggleModal={props.toggleModal}
            />
            <BioEditor bio={props.bio} changeBio={props.changeBio} />
        </div>
    );
}
