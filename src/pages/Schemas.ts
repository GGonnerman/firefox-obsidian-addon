import { z } from "zod";

export const saveContentMessageSchema = z.object({
    kind: z.literal("saveContent"),
    id: z.int(),
    type: z.enum(["text", "image"]),
    data: z.string(),
    url: z.string(),
});

export const staleMessageSchema = z.object({
    kind: z.literal("stale"),
    hash: z.number(),
    timestamp: z.number(),
    path: z.string(),
});

export const MessageSchema = z.discriminatedUnion("kind", [
    saveContentMessageSchema,
    staleMessageSchema
]);

export type saveContentMessage = z.infer<typeof saveContentMessageSchema>;
export type staleMessage = z.infer<typeof staleMessageSchema>;