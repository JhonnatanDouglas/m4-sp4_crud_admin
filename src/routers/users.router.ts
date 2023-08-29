import { Router } from "express";
import { usersControllers } from "../controllers";
import middlewares from "../middlewares";
import { userCreateSchema } from "../schemas";

const userRouter: Router = Router();

userRouter.post(
  "",
  middlewares.validateBody(userCreateSchema),
  middlewares.validateUserEmailExists,
  usersControllers.create
);

userRouter.get(
  "",
  middlewares.verifyToken,
  middlewares.validateAdmin,
  usersControllers.read
);

userRouter.get(
  "/:id/courses",
  middlewares.verifyToken,
  middlewares.validateAdmin,
  middlewares.validateUserRegisterCourse,
  usersControllers.readUserCourses
);

export default userRouter;
