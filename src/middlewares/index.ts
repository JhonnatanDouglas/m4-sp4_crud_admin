import { handleErrors } from "./handdleErros.middleware";
import { validateBody } from "./validateBody.middlewares";
import { validateUserEmailExists } from "./validateUserEmailExists.middlewares";
import { verifyUserEmail } from "./verifyUserEmail.middlewares";
import { verifyToken } from "./verifyToken.middlewares";
import { validateAdmin } from "./validateAdmin.middlewares";
import { validateUserRegisterCourse } from "./validateUserRegisterCourse.middlewares";
import { verifyUserAndCourses } from "./verifyUserAndCourseExists.middlewares";
import { verifyDeletedUserAndCourse } from "./verifyDeletedUserAndCourse.middlewares";

export default {
  handleErrors,
  validateBody,
  validateUserEmailExists,
  verifyUserEmail,
  verifyToken,
  validateAdmin,
  validateUserRegisterCourse,
  verifyUserAndCourses,
  verifyDeletedUserAndCourse,
};
