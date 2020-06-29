import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FindPeople() {
    const [person, setPerson] = useState("");
    const [persons, setPersons] = useState([]);

    useEffect(() => {
        (async () => {
            const { data } = await axios.get(`/app/persons/${person}`);
            console.log("get request /app/user/persons/person data:", data);
            setPersons(data);
        })();
    }, [person]);

    useEffect(() => {
        (async () => {
            const { data } = await axios.get(`/app/persons`);
            console.log("get request /app/user/persons data:", data);
            setPersons(data);
        })();
    }, []);

    const handleChange = (e) => {
        setPerson(e.target.value);
    };

    return (
        <div>
            <input
                onChange={handleChange}
                placeholder="who are you looking for?"
            ></input>
            {persons.map((elem, idx) => {
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
