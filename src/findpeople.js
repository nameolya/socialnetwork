import React, { useState, useEffect } from "react";
import axios from "./axios";
import { useHistory } from "react-router-dom";

export default function FindPeople() {
    const history = useHistory();
    const [person, setPerson] = useState("");
    const [persons, setPersons] = useState([]);
    const [personListVisibility, setPersonListVisibility] = useState(true);

    useEffect(() => {
        (async () => {
            const { data } = await axios.get(`/app/persons/${person}`);
            console.log("get request /app/user/persons/person data:", data);
            setPersons(data);
            setPersonListVisibility(false);
        })();
    }, [person]);

    useEffect(() => {
        (async () => {
            const { data } = await axios.get(`/app/persons`);
            console.log("get request /app/user/persons data:", data);
            setPersons(data);
            setPersonListVisibility(true);
        })();
    }, []);

    const handleChange = (e) => {
        setPerson(e.target.value);
    };

    const routeChange = (id) => {
        let path = `/user/${id}`;
        history.push(path);
    };

    return (
        <div className="find-people">
            <div className="people-search">
                <div>
                    <h1>Find people</h1>
                </div>
                <div>
                    <input
                        className="find-people-input"
                        onChange={handleChange}
                        placeholder="who are you looking for:"
                    ></input>
                </div>
                <div>
                    {personListVisibility && <h2>Recently joined:</h2>}
                    {persons.length == 0 && (
                        <p className="error">No match found</p>
                    )}
                </div>
            </div>

            <div className="profile-box">
                {persons.map((elem, idx) => {
                    return (
                        <div className="find-people-container" key={idx}>
                            <div className="find-profile-image">
                                <img
                                    className="small"
                                    src={elem.imageurl}
                                    onClick={(e) => routeChange(`${elem.id}`)}
                                />
                            </div>
                            <div>
                                {elem.first} {elem.last}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
