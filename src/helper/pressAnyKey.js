export default async (message, newline = false) => {
  return new Promise((resolve) => {
    if (!newline) {
      process.stdout.write(message + " ");
    } else {
      console.log(message);
    }

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once("data", () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      resolve();
    });
  });
};
