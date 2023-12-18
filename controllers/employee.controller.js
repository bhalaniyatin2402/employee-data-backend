import { prisma } from "../app.js";
import asyncHandler from "../middleare/asyncHandler.middleware.js";
import AppError from "../utils/error.utils.js";

/**
 * @ADD_EMPLOYEE
 * @ROUTE @POST
 * @ACCESS {{url}}/api/v1/employee/
 */

export const addNewEmployee = asyncHandler(async (req, res, next) => {
  const { tableId } = req.query;

  const isTableExist = await prisma.table.findFirst({
    where: { id: Number(tableId) },
  });

  if (!isTableExist) {
    return next(new AppError("table is not exist on this table id", 400));
  }

  const data = { ...req.body, salary: Number(req.body.salary) };

  const employee = await prisma.employee.create({
    data: {
      ...data,
      tableId: Number(tableId),
    },
  });

  res.status(200).json(employee);
});

/**
 * @UPDATE_EMPLOYEE_DATA
 * @ROUTE @PUT
 * @ACCESS {{url}}/api/v1/employee/
 */

export const updateEmployee = asyncHandler(async (req, res, next) => {
  const { employeeId } = req.query;

  if (!employeeId) {
    return next(
      new AppError("employee id is required to update employee", 400)
    );
  }

  const isEmployeExist = await prisma.employee.findUnique({
    where: { id: Number(employeeId) },
  });

  if (!isEmployeExist) {
    return next(new AppError("employee is not exist on this employe id", 400));
  }

  let data;
  if (req.body.salary) {
    data = { ...req.body, salary: Number(req.body.salary) };
  } else {
    data = req.body;
  }

  const updateEmployee = await prisma.employee.update({
    where: { id: Number(employeeId) },
    data,
  });

  res.status(200).json({
    message: "user has been updated",
    updateEmployee,
  });
});

/**
 * @DELETE_EMPLOYEE
 * @ROUTE @DELETE
 * @ACCESS {{url}}/api/v1/employee/
 */

export const deleteEmployee = asyncHandler(async (req, res, next) => {
  const { employeeIds } = req.body;

  if (employeeIds.length < 1) {
    return next(new AppError("atleast on id required to delete employe", 400));
  }

  await prisma.employee.deleteMany({
    where: { id: { in: employeeIds } },
  });

  res.status(200).json({
    success: true,
    message: "employee has been deleted",
  });
});
