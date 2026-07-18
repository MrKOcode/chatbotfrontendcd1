import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("http://localhost:3000/api/profile", () => {
    return HttpResponse.json({
      firstName: "John",
      lastName: "Doe",
    });
  }),
];
