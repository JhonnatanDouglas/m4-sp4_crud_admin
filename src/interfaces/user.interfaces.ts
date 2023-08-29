import { z } from "zod";
import {
  userCreateSchema,
  userReadSchema,
  userReturnSchema,
  userSchema,
} from "../schemas";
import { QueryResult } from "pg";

type User = z.infer<typeof userSchema>;

type UserCreate = z.infer<typeof userCreateSchema>;

type UserRead = z.infer<typeof userReadSchema>;

type UserReturn = z.infer<typeof userReturnSchema>;

type UserResult = QueryResult<User>;

type UserFoundedCourses = {
  courseId: number;
  courseName: string;
  courseDescription: string;
  userActiveInCourse: boolean;
  userId: number;
  userName: string;
};

type UserFoundedCoursesList = UserFoundedCourses[];

type UserFoundedCoursesResult = QueryResult<UserFoundedCourses>;

export {
  User,
  UserCreate,
  UserRead,
  UserResult,
  UserReturn,
  UserFoundedCourses,
  UserFoundedCoursesList,
  UserFoundedCoursesResult,
};
