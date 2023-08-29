import { z } from "zod";

const userSchema = z.object({
  id: z.number().positive(),
  name: z.string().max(50).nonempty(),
  email: z.string().email().max(50).nonempty(),
  password: z.string().max(120).nonempty(),
  admin: z.boolean().default(false),
});

const userCreateSchema = userSchema.omit({ id: true });

const userReturnSchema = userSchema.omit({ password: true });

const userReadSchema = userReturnSchema.array();

export { userSchema, userCreateSchema, userReturnSchema, userReadSchema };
