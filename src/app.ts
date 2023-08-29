import "express-async-errors";
import express, { Application, json } from "express";
import middlewares from "./middlewares";
import { courseRouter, sessionRouter, userRouter } from "./routers";

const app: Application = express();
app.use(json());

app.use("/users", userRouter);
app.use("/login", sessionRouter);
app.use("/courses", courseRouter);

app.use(middlewares.handleErrors);
export default app;
