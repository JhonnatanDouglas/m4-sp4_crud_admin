import { Router } from "express";
import { sessionsControllers } from "../controllers";
import middlewares from "../middlewares";
import { sessionCreate } from "../schemas";

const sessionRouter: Router = Router();

sessionRouter.post(
  "",
  middlewares.validateBody(sessionCreate),
  middlewares.verifyUserEmail,
  sessionsControllers.create
);

export default sessionRouter;
