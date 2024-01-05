"use strict";

import { lambdaHandler } from "../../app.js";
import { expect } from "chai";
var event, context;

describe("Webpage Function Tests", () => {
  beforeEach(() => {
    // Mock environment variables
    process.env.ENCRYPTION_KEY_BASE = "testKeyBase";
    process.env.STACK_NAME = "testStack";
    process.env.CSRF_TOKEN_SECRET = "testSecret";
  });

  it("should return an HTML page with a CSRF token", async () => {
    const response = await lambdaHandler();

    expect(response).to.be.an("object");
    expect(response.statusCode).to.equal(200);
    expect(response.headers["Content-Type"]).to.equal("text/html");
    expect(response.body).to.include('<form action="/submit" method="POST">');
    expect(response.body).to.include('name="csrfToken"');
  });
});
