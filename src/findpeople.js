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
        <div>
            <h1>Find people</h1>
            {personListVisibility && <p>Recently joined:</p>}
            <input
                onChange={handleChange}
                placeholder="who are you looking for?"
            ></input>
            {persons.map((elem, idx) => {
                return (
                    <div key={idx}>
                        <img
                            src={elem.imageurl}
                            onClick={(e) => routeChange(`${elem.id}`)}
                        />
                        {elem.first}
                        {elem.last}
                    </div>
                );
            })}
        </div>
    );
}
