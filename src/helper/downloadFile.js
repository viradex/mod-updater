import axios from "axios";
import fs from "fs";

const downloadFile = async (url, path) => {
  const response = await axios.get(url, { responseType: "stream" });
  const writer = fs.createWriteStream(path);

  response.data.pipe(writer);

  await new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

export default downloadFile;
