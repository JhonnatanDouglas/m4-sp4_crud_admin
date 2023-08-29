import { z } from "zod";

const courseSchema = z.object({
  id: z.number().positive(),
  name: z.string().max(15).nonempty(),
  description: z.string().nonempty(),
});

const courseCreateSchema = courseSchema.omit({ id: true });

const courseReadSchema = courseSchema.array();

export { courseSchema, courseCreateSchema, courseReadSchema };
