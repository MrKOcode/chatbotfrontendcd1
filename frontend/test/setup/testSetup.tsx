import { expect, afterEach, beforeAll, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { server } from "@test/setup/server"; // Import MSW server setup

// Extend expect matchers for jest-dom
expect.extend(matchers);

// Clean up after each test to prevent memory leaks
afterEach(() => {
  cleanup();
});

// Start MSW server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));

// Reset handlers after each test to ensure test isolation
afterEach(() => server.resetHandlers());

// Close MSW server after all tests are finished
afterAll(() => server.close());
