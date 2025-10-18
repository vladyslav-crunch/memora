import {z} from "zod";
import {NameSchema} from "@/lib/validation/user/fields/name.schema";

export const ChangeUsernameSchema = z.object({
    name: NameSchema
});

export type ChangeUsernameValues = z.infer<typeof ChangeUsernameSchema>;