"use client";

import { z } from "zod";

export const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long."),
  email: z
    .string()
    .email("Invalid email address."),
  mobile: z
    .string()
    .refine(val => /^\d{10}$/.test(val), {
      message: "Mobile number must be exactly 10 digits.",
    }),
  subject: z
    .string()
    .min(2, "Subject must be at least 2 characters long."),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters long."),
});

export type FormSchemaInfer = z.infer<typeof formSchema>;
