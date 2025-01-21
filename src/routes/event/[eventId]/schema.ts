import { z } from "zod";

type IAttendee = {
  name: string,
  password: string
}

export const participateEventSchema = (attendees: IAttendee[]) => 
  z.object({
    name: z.string().max(50)
      .refine((name) => 
        !attendees.some((attendee) => attendee.name === name), 
        { message: "Someone else with the same name is attending. Choose another name to avoid confusion!" }
      ),
    password: z.string().min(4),
})
