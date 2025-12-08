import { z } from "zod";

export const saveContentMessageSchema = z.object({
    url: z.string(),
    type: z.enum(["text", "image"]),
    data: z.string(),
});

export type saveContentMessage = z.infer<typeof saveContentMessageSchema>;