import {z, ZodType} from "zod";

export class AuthValidation {
    static readonly LOGIN: ZodType = z.object({
        email: z.string().min(1).max(255),
        password: z.string().min(1).max(255),
    });

}