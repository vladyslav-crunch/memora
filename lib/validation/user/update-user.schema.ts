import {z} from "zod";
import {NameSchema} from "@/lib/validation/user/fields/name.schema";

export const UpdateUserSchema = z.object({
    name: NameSchema,
    image: z.url().optional(),
});
