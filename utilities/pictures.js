import { readdir } from "fs/promises";
import path from "path";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const grabRandomBgPic = async () => {
  try {
    const files = await readdir(path.join(__dirname, "../public/img"));
    const randomBgPc = files[Math.floor(Math.random() * files.length)];
    return randomBgPc;
  } catch (err) {
    console.error(err);
  }
};

export { grabRandomBgPic };
