import { Router } from "express";
import { coursesControllers } from "../controllers";
import middlewares from "../middlewares";
import { courseCreateSchema } from "../schemas";

const courseRouter: Router = Router();

courseRouter.post(
  "",
  middlewares.verifyToken,
  middlewares.validateAdmin,
  middlewares.validateBody(courseCreateSchema),
  coursesControllers.create
);

courseRouter.get("", coursesControllers.read);

courseRouter.post(
  "/:courseId/users/:userId",
  middlewares.verifyToken,
  middlewares.validateAdmin,
  middlewares.verifyUserAndCourses,
  coursesControllers.registerCourseUser
);

courseRouter.get(
  "/:id/users",
  middlewares.verifyToken,
  middlewares.validateAdmin,
  coursesControllers.readAllUsersInThisCourse
);

courseRouter.delete(
  "/:courseId/users/:userId",
  middlewares.verifyToken,
  middlewares.validateAdmin,
  middlewares.verifyDeletedUserAndCourse,
  coursesControllers.disableCourse
);

export default courseRouter;
