import express from "express";
const jobRouter = express.Router();
import seeds from "../seedData/seeds.js";
import Job from "../models/Job.js";
import { Sequelize } from "sequelize";

const Op = Sequelize.Op;

jobRouter.get("/", async (req, res) => {
  try {
    const jobs = await Job.findAll({ raw: true });
    res.render("jobs", { jobs });
  } catch (e) {
    console.log(e);
  }
});

// Display add job from
jobRouter.get("/add", (req, res) => {
  res.render("add");
});

// Add a new job
jobRouter.post("/add", async (req, res) => {
  let { title, technologies, budget, description, contact_email } = req.body;
  let errors = [];
  if (!title) {
    errors.push({ text: "Please add a title" });
  }
  if (!technologies) {
    errors.push({ text: "Please add some technologies" });
  }
  if (!description) {
    errors.push({ text: "Please add a description" });
  }
  if (!contact_email) {
    errors.push({ text: "Please add a contact email" });
  }

  if (errors.length) {
    res.render("add", {
      errors,
      title,
      technologies,
      budget,
      description,
      contact_email,
    });
  } else {
    if (!budget) {
      budget = "Unknown";
    } else {
      budget = `$${budget}`;
    }

    // Make lowercase and remove spaces after commas
    technologies = technologies.toLowerCase().replace(/, /g, ",");

    await Job.create({
      title,
      technologies,
      budget,
      description,
      contact_email,
    });
    res.redirect("/jobs");
  }
});

// Search for Jobs
jobRouter.get("/search", async (req, res) => {
  let { term } = req.query;
  term = term.toLowerCase();
  try {
    const filteredJobs = await Job.findAll({
      where: { technologies: { [Op.like]: `%${term}%` } },
      raw: true,
    });
    res.render("jobs", { jobs: filteredJobs });
  } catch (e) {
    console.log(e);
  }
});

// Seed jobs from mock data if database is empty
jobRouter.post("/seed", async (req, res) => {
  let isDatabaseSeeded;

  try {
    const jobs = await Job.findAll();
    if (jobs.length) isDatabaseSeeded = true;
  } catch (e) {
    console.log(e);
  }

  if (!databaseSeeded) {
    const seedPromises = seeds.map(async (seed) => {
      try {
        return await Job.create(seed);
      } catch (e) {
        console.log(e);
      }
    });

    try {
      const seedResults = await Promise.all(seedPromises);
      console.log({ seedResults });
      res.redirect("/jobs");
    } catch (e) {
      console.log(e);
    }
  }
});

export default jobRouter;
