import crypto from "crypto";

const SECRET_KEY = process.env.ENCRYPTION_KEY_BASE + process.env.STACK_NAME;
const ALGORITHM = "aes-256-cbc";
const key = crypto
  .createHash("sha256")
  .update(String(SECRET_KEY))
  .digest()
  .slice(0, 32);

function decrypt(text) {
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

function safeCompare(userInput, secret) {
  let userInputBuffer = Buffer.from(userInput);
  const secretBuffer = Buffer.from(secret);

  // The buffers must be equal size; we can pad the user input to match
  if (userInputBuffer.length !== secretBuffer.length) {
    userInputBuffer = Buffer.concat(
      [userInputBuffer, Buffer.alloc(secretBuffer.length - userInputBuffer.length)],
      secretBuffer.length
    );
  }

  return crypto.timingSafeEqual(userInputBuffer, secretBuffer);
}

export const lambdaHandler = async (event) => {
  const formData = parseFormData(event.body);
  console.log("Received submission:", formData);

  try {
    const csrfToken = decrypt(formData.csrfToken);

    if (safeCompare(csrfToken, process.env.CSRF_TOKEN_SECRET)) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Received valid submission",
          receivedData: formData,
        }),
      };
    } else {
      return {
        statusCode: 403,
      };
    }
  } catch {
    return {
      statusCode: 400,
    };
  }
};

// Helper function to parse form data
function parseFormData(body) {
  const formData = {};
  const pairs = body.split("&");

  for (let pair of pairs) {
    const [key, value] = pair.split("=");
    formData[decodeURIComponent(key)] = decodeURIComponent(value.replace(/\+/g, " "));
  }

  return formData;
}
