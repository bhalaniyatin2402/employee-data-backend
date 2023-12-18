import { Router } from "express";
const router = Router();
import {
  addNewEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employee.controller.js";

router
  .route("/")
  .post(addNewEmployee)
  .put(updateEmployee)
  .delete(deleteEmployee);

export default router;
