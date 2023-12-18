import { prisma } from "../app.js";
import asyncHandler from "../middleare/asyncHandler.middleware.js";
import AppError from "../utils/error.utils.js";

/**
 * @GET_TABLE_LIST
 * @ROUTE @GET
 * @ACCESS {{url}}/api/v1/table/list
 */

export const getTableList = asyncHandler(async (req, res, next) => {
  const tablelist = await prisma.table.findMany();

  res.status(200).json(tablelist);
});

/**
 * @CREATE_NEW_TABLE_WITH_EMPLOYEE_DATA
 * @ROUTE @POST
 * @ACCESS {{url}}/api/v1/table/
 */

export const createTable = asyncHandler(async (req, res, next) => {
  const { name, employeeList } = req.body;

  if (!name || !employeeList) {
    return next(
      new AppError(
        "name and employe list is required to create a new table",
        200
      )
    );
  }

  let newEmployeeList = employeeList.map((item) => {
    return { salary: item.salary, ...item };
  });

  const isNameExist = await prisma.table.findFirst({
    where: { name },
  });

  if (isNameExist) {
    return next(
      new AppError("please give another name this name is already taken", 400)
    );
  }

  const table = await prisma.table.create({
    data: { name },
  });

  // insert the table id in each employee of employee list
  let updateEmployeeList = [];
  newEmployeeList.map((emp) => {
    updateEmployeeList.push({ ...emp, tableId: table.id });
  });

  const employees = await prisma.employee.createMany({
    data: updateEmployeeList,
  });

  res.status(200).json({
    success: true,
    message: "table created successfuly",
    table,
    employees,
  });
});

/**
 * @GET_TABLE_WITH_EMPLOYEE_DATA
 * @ROUTE @POST
 * @ACCESS {{url}}/api/v1/table/
 */

export const getTable = asyncHandler(async (req, res, next) => {
  const { tableId } = req.query;

  if (!tableId) {
    return next(new AppError("table id is required to update the table", 400));
  }

  const employeeList = await prisma.employee.findMany({
    where: { tableId: Number(tableId) },
  });

  res.status(200).json(employeeList);
});

/**
 * @DELETE_TABLE
 * @ROUTE @POST
 * @ACCESS {{url}}/api/v1/table/list
 */

export const deleteTable = asyncHandler(async (req, res, next) => {
  const { tableId } = req.query;

  if (!tableId) {
    return next(new AppError("table id is required to delete the table", 400));
  }

  await prisma.table.delete({
    where: { id: Number(tableId) },
  });

  res.status(200).json({
    success: true,
    message: "table deleted successfully",
  });
});
