import crypto from "crypto";

const SECRET_KEY = process.env.ENCRYPTION_KEY_BASE + process.env.STACK_NAME;
const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;
const key = crypto
  .createHash("sha256")
  .update(String(SECRET_KEY))
  .digest()
  .slice(0, 32);

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

export const lambdaHandler = async () => {
  const csrfToken = encrypt(process.env.CSRF_TOKEN_SECRET);

  const page = `
  <html>
    <head>
      <meta name="google" content="notranslate" />
      <style>
      body {
        background-color: #f1f1f1;
        font-family: sans-serif;
        text-align: left;
        font-size: 16px;
      }
      </style>
    </head>
    <body>
      <form action="/Prod/submit" method="POST">
        <input type="hidden" name="csrfToken" value="${csrfToken}" />
        <input type="text" name="data" />
        <input type="submit" value="Submit" />
      </form>
    </body>
  </html>
  `;

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html",
    },
    body: page,
  };
};
