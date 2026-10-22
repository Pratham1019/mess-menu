import { randomBytes, scrypt } from "node:crypto";
import { emitKeypressEvents } from "node:readline";

if (!process.stdin.isTTY) {
  console.error(
    "Run this command in a terminal. The password is entered without echo; never pass it as an argument.",
  );
  process.exit(1);
}
async function hidden(prompt) {
  process.stderr.write(prompt);
  emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  return new Promise((resolve) => {
    let value = "";
    const onKey = (input, key) => {
      if (key?.ctrl && key.name === "c") {
        process.stdin.setRawMode(false);
        process.stderr.write("\n");
        process.exit(130);
      }
      if (key?.name === "return") {
        process.stdin.off("keypress", onKey);
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stderr.write("\n");
        resolve(value);
      } else if (key?.name === "backspace")
        value = [...value].slice(0, -1).join("");
      else if (input && !key?.ctrl && !key?.meta) value += input;
    };
    process.stdin.on("keypress", onKey);
  });
}
const password = await hidden("Admin password (at least 16 characters): ");
if (password.length < 16 || Buffer.byteLength(password) > 1024) {
  console.error("Use 16 or more characters, at most 1024 UTF-8 bytes.");
  process.exit(1);
}
if (password !== (await hidden("Confirm password: "))) {
  console.error("Passwords do not match.");
  process.exit(1);
}
const salt = randomBytes(16);
const key = await new Promise((resolve, reject) =>
  scrypt(
    password,
    salt,
    64,
    { N: 131072, r: 8, p: 1, maxmem: 160 * 1024 * 1024 },
    (error, derived) => (error ? reject(error) : resolve(derived)),
  ),
);
console.log(`scrypt$131072$8$1$${salt.toString("hex")}$${key.toString("hex")}`);
