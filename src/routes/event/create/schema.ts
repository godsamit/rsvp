import { z } from "zod";

export const createEventSchema = z.object({
  password: z.string().min(4).max(20),
  title: z.string(),
  detail: z.string().optional(),
  picture: z.string().optional(),
  date: z.string()
    .refine(
      (val) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(val), 
      { message: "Invalid date format" }
    ),
  address: z.string().optional(),
})

export type ICreateEventSchema = typeof createEventSchema;