import AppError from "../utils/error.utils.js";

// use in controller to catch error
// after binding controller function in asyncHandler don't need to cover in try and catch
const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(new AppError(err, 400)));
  };
};

export default asyncHandler;
