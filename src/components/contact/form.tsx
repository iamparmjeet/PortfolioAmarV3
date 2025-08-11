"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { FormSchemaInfer } from "@/lib/types";

import { formSchema } from "@/lib/types";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

;

export default function ContactForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaInfer>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormSchemaInfer) => {
    setIsSuccess(false);

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();
        toast.error(errData.error || "Failed to send message");
        return;
      }

      toast.success("Message sent successfully!");
      setIsSuccess(true);
      reset();
    }
    catch (error) {
      console.error("Error sending message:", error);
      setIsSuccess(false);
      reset();
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <div className="space-y-4">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          {...register("name")}
          placeholder="Your full name"
        />
        {errors.name && (
          <p className="text-red-600 -mt-2">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          {...register("email")}
          placeholder="Your email address"
        />
        {errors.email && (
          <p className="text-red-600 -mt-2">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <Label htmlFor="mobile">Mobile</Label>
        <Input
          type="tel"
          maxLength={10}
          {...register("mobile")}
          placeholder="Your 10 digit whatsapp number"
        />
        {errors.mobile && (
          <p className="text-red-600 -mt-2">{errors.mobile.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <Label htmlFor="subject">Subject</Label>
        <Input
          type="text"
          {...register("subject")}
          placeholder="Subject of your message"
        />
        {errors.subject && (
          <p className="text-red-600 -mt-2">{errors.subject.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <Label htmlFor="message">Message</Label>
        <Textarea
          {...register("message")}
          placeholder="Your message"
          rows={4}
        />
        {errors.message && (
          <p className="text-red-600 -mt-2">{errors.message.message}</p>
        )}
      </div>

      <Button
        className={cn(
          isSuccess
            ? "bg-green-600"
            : "bg-orange-500",
          "mt-4",
        )}
        type="submit"
      >
        {isSubmitting ? "Submitting..." : isSuccess ? "Submitted" : "Submit"}
      </Button>
    </form>
  );
}
