import { z } from "zod";

export const saveContentMessageSchema = z.object({
    id: z.int(),
    type: z.enum(["text", "image"]),
    data: z.string(),
    url: z.string(),
});

export type saveContentMessage = z.infer<typeof saveContentMessageSchema>;