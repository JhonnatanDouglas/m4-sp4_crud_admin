import { z } from "zod";
import { courseCreateSchema, courseReadSchema, courseSchema } from "../schemas";
import { QueryResult } from "pg";

type Course = z.infer<typeof courseSchema>;

type CourseCreate = z.infer<typeof courseCreateSchema>;

type CourseRead = z.infer<typeof courseReadSchema>;

type CourseResult = QueryResult<Course>;

type CourseInUser = {
  userId: number;
  userName: string;
  courseId: number;
  courseName: string;
  courseDescription: string;
  userActiveInCourse: boolean;
};

type CourseInUserList = CourseInUser[];

type CourseInUserResult = QueryResult<CourseInUser>;

type InsertCourse = {
  active: boolean;
  userId: number;
  courseId: number;
};

type InsertCourseResult = QueryResult<InsertCourse>;

export {
  Course,
  CourseCreate,
  CourseRead,
  CourseResult,
  CourseInUser,
  CourseInUserList,
  CourseInUserResult,
  InsertCourse,
  InsertCourseResult,
};
