import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import { grabRandomBgPic } from "./utilities/pictures.js";

// ESM doesn't have __dirname or __filename; we have to emulate them:
// https://github.com/nodejs/help/issues/2907
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes imports
import jobRouter from "./routes/jobs.js";

const app = express();

app.use(express.static(path.join(__dirname, "public")));

// parse JSON bodies + URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Handlebars
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", async (req, res) => {
  res.render("index", { layout: "landing", bgPic: await grabRandomBgPic() });
});

// Job routes
app.use("/jobs", jobRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
