import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";

config();
const app = express();
export const prisma = new PrismaClient();

const corsOptions = {
  origin: [process.env.FRONT_URL, process.env.FRONT_URL],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

// use middlewre to parse the data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.status(200).send(`<h1>Welcome to Employees data backend side</h1>`);
});

// import all route for handle request
import tableRoutes from "./routes/table.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import errorMiddleware from "./middleare/error.middleware.js";

// assign routes to base url
app.use("/api/v1/table", tableRoutes);
app.use("/api/v1/employee", employeeRoutes);

// handle all the error
app.use(errorMiddleware);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
