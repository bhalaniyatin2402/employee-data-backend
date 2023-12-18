import { Router } from "express";
const router = Router();
import {
  createTable,
  getTable,
  deleteTable,
  getTableList
} from "../controllers/table.controller.js";

router
  .route("/")
  .post(createTable)
  .get(getTable)
  .delete(deleteTable);

router.route('/list').get(getTableList)

export default router;
