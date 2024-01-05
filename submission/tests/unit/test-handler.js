"use strict";

import { lambdaHandler } from "../../app.js";
import { expect } from "chai";
var event, context;

describe("CSRF Protection Tests", () => {
  beforeEach(() => {
    // Mock environment variables
    process.env.ENCRYPTION_KEY_BASE = "testKeyBase";
    process.env.STACK_NAME = "testStack";
    process.env.CSRF_TOKEN_SECRET = "testSecret";
  });

  it("should handle valid submission correctly", async () => {
    // Mock event with valid CSRF token
    const event = {
      body: "csrfToken=a8eae670de81d04f1294623a478e7490:3f3046dd4498f244c9fef0ec83648468&data=someData",
    };

    const response = await lambdaHandler(event);
    expect(response.statusCode).to.equal(200);
    expect(response.body).to.include("Received valid submission");
  });

  it("should handle invalid submission correctly", async () => {
    // Mock event with invalid CSRF token
    const event = {
      body: "csrfToken=a9eae670de81d04f1294623a478e7490:3f3046dd4498f244c9fef0ec83648468&data=someData",
    };

    const response = await lambdaHandler(event);
    expect(response.statusCode).to.equal(403);
  });

  it("should handle different length inputs in safeCompare", async () => {
    // Mock event with CSRF token of different length than secret
    const event = {
      body: "csrfToken=766c4c9a0f3d1df47f13b679831adad7:5da0bcf806a4d1b406b37a50e70cf636&data=someData",
    };

    const response = await lambdaHandler(event);
    expect(response.statusCode).to.equal(403);
  });

  it("should handle exceptions correctly", async () => {
    // Mock event with malformed CSRF token
    const event = {
      body: "csrfToken=malformedToken&data=someData",
    };

    const response = await lambdaHandler(event);
    expect(response.statusCode).to.equal(400);
  });
});
