import {z} from "zod";

export const usernameValidation = z
    .string()
    .min(2,"Username must be at least 2 characters long")
    .max(20,"Username must be at most 20 characters long")
    .regex(/^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/,"Username must not contain special character")

export const signUpSchema = z.object({
    username:usernameValidation,
    email:z.string().email({message: "Please enter a valid email"}),
    password:z.string().min(6,{message:"Password must be at least 6 characters long"}),
})