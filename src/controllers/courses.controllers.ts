import { Request, Response } from "express";
import { Course, CourseInUserList, CourseRead } from "../interfaces";
import { courseServices } from "../services";

const create = async (req: Request, res: Response): Promise<Response> => {
  const course: Course = await courseServices.create(req.body);
  return res.status(201).json(course);
};

const read = async (req: Request, res: Response): Promise<Response> => {
  const users: CourseRead = await courseServices.read();
  return res.status(200).json(users);
};

const registerCourseUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const messageResult: string = await courseServices.registerCourseUser(
    req.params.userId,
    req.params.courseId
  );
  return res.status(201).json({ message: messageResult });
};

const readAllUsersInThisCourse = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const users: CourseInUserList = await courseServices.readAllUsersInThisCourse(
    req.params.id
  );
  return res.status(200).json(users);
};

const disableCourse = async (
  req: Request,
  res: Response
): Promise<Response> => {
  await courseServices.disableCourse(req.params.userId, req.params.courseId);
  return res.status(204).send();
};

export default {
  create,
  read,
  readAllUsersInThisCourse,
  registerCourseUser,
  disableCourse,
};
