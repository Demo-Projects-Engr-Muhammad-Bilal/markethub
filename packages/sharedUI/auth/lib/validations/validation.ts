import { z } from "zod";

// 🟢 Password Regex: Min 8 chars, 1 Uppercase, 1 Lowercase, 1 Number, 1 Special Char
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// 🟢 Sign Up Schema
export const signUpSchema = z.object({
          fullname: z.string().min(3, "Name must be at least 3 characters long"),
          email: z.string().email("Invalid email address format"),
          password: z.string().regex(passwordRegex, "Weak password"),
          confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
          message: "Passwords do not match",
          path: ["confirmPassword"],
});

// 🟢 Sign In Schema
export const signInSchema = z.object({
          email: z.string().email("Invalid email address format"),
          password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
          email: z.string().email("Invalid email address format"),
});

// 🟢 Reset Password Schema
export const resetPasswordSchema = z.object({
          newPassword: z.string().regex(passwordRegex, "Weak password"),
          confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
          message: "Passwords do not match",
          path: ["confirmPassword"],
});