import { z } from "zod";
import { emailSchema, passwordSchema } from "./common";

export const loginSchema = z.object({
  username: emailSchema,
  password: passwordSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
