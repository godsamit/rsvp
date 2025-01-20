import { z } from "zod";

export const participateEventSchema = z.object({
  name: z.string().max(50),
  password: z.string().min(4).max(20),
})

export type IParticipateEventSchema = typeof participateEventSchema;