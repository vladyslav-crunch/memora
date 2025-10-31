import {z} from "zod";
import {NameSchema} from "@/lib/validation/user/fields/name.schema";

export const UpdateUserSchema = z.object({
    name: NameSchema.optional(),
    image: z.url().optional(),
});
