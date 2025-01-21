import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const createEventSchema = z.object({
  password: z.string().min(4),
  title: z.string(),
  detail: z.string().optional(),
  picture: z.instanceof(File)
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ).optional(),
  date: z.string()
    .refine(
      (val) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(val), 
      { message: "Invalid date format" }
    ),
  address: z.string().optional(),
})

export type ICreateEventSchema = typeof createEventSchema;