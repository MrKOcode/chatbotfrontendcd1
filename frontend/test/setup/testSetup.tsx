import { expect, afterEach, beforeAll, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { server } from "@test/setup/server";

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

expect.extend(matchers);

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));

afterAll(() => server.close());
