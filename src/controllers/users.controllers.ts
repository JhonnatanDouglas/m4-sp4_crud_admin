import { Request, Response } from "express";
import { usersServices } from "../services";
import { UserFoundedCoursesList, UserRead, UserReturn } from "../interfaces";

const create = async (req: Request, res: Response): Promise<Response> => {
  const user: UserReturn = await usersServices.create(req.body);
  return res.status(201).json(user);
};

const read = async (req: Request, res: Response): Promise<Response> => {
  const users: UserRead = await usersServices.read();
  return res.status(200).json(users);
};

const readUserCourses = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const courses: UserFoundedCoursesList = await usersServices.readUserCourses(
    req.params.id
  );
  return res.status(200).json(courses);
};

export default { create, read, readUserCourses };
