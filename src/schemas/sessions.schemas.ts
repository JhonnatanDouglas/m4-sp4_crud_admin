import { z } from "zod";
import { userSchema } from "../schemas";

const sessionCreate = userSchema.pick({
  email: true,
  password: true,
});

export { sessionCreate };
