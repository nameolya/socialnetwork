import React from "react";
import BioEditor from "./bioeditor";
import { render, fireEvent } from "@testing-library/react";
import axios from "axios";

jest.mock("axios");

test("When no bio is passed to it, an Add button is rendered", () => {
    const { container } = render(<BioEditor />);

    expect(container.querySelector("p").innerHTML).toBe("Add bio");
});

test("When a bio is passed to it, an Edit button is rendered", () => {
    const { container } = render(<BioEditor bio="Coder" />);

    expect(container.querySelector(".addeditbio").innerHTML).toBe("Edit bio");
});

test("Clicking either the Add or Edit button causes a textarea and a Save button to be rendered", () => {
    const myMockOnClick = jest.fn();
    const { container } = render(<BioEditor onClick={myMockOnClick} />);
    fireEvent.click(container.querySelector(".addeditbio"));
    expect(container.querySelector("button").innerHTML).toBe("Save");
    expect(container.querySelector("textarea")).toBeTruthy();
});
