import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Counter } from "@src/sample/code";

describe("Counter Component", () => {
  test("renders with default props", () => {
    render(<Counter />);

    expect(screen.getByTestId("counter-label")).toHaveTextContent("Counter");
    expect(screen.getByTestId("count-value")).toHaveTextContent("0");
  });

  test("renders with custom props", () => {
    render(<Counter initialCount={5} label="My Counter" />);

    expect(screen.getByTestId("counter-label")).toHaveTextContent("My Counter");
    expect(screen.getByTestId("count-value")).toHaveTextContent("5");
  });

  test("increments when increment button is clicked", async () => {
    render(<Counter />);
    const user = userEvent.setup();

    await user.click(screen.getByLabelText("Increment"));

    expect(screen.getByTestId("count-value")).toHaveTextContent("1");
  });

  test("decrements when decrement button is clicked", async () => {
    render(<Counter initialCount={5} />);
    const user = userEvent.setup();

    await user.click(screen.getByLabelText("Decrement"));

    expect(screen.getByTestId("count-value")).toHaveTextContent("4");
  });
});
