import React from "react";
import { useState } from "react";

interface CounterProps {
  initialCount?: number;
  label?: string;
}

export const Counter = ({
  initialCount = 0,
  label = "Counter",
}: CounterProps) => {
  const [count, setCount] = useState(initialCount);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);

  return (
    <div className="counter">
      <h2 data-testid="counter-label">{label}</h2>
      <div className="counter-controls">
        <button onClick={decrement} aria-label="Decrement">
          -
        </button>
        <span data-testid="count-value">{count}</span>
        <button onClick={increment} aria-label="Increment">
          +
        </button>
      </div>
    </div>
  );
};
