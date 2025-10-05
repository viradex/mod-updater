import readline from "readline";

const pressAnyKey = async (message, newline = false) => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    if (!newline) process.stdout.write(message + " ");
    else console.log(message);

    process.stdin.once("data", () => {
      rl.close();
      resolve();
    });
  });
};

export default pressAnyKey;
