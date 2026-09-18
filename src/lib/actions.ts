"use server";

import { z } from "zod";
import { ContactFormSchema } from "./schemas";

type ContactFormInputs = z.infer<typeof ContactFormSchema>;

export async function sendEmail(data: ContactFormInputs) {
  const result = ContactFormSchema.safeParse(data);

  if (result.error) {
    const firstIssue = result.error.issues[0]?.message || "Invalid input data.";
    return { error: firstIssue };
  }

  try {
    const { name, email, message } = result.data;

    // Formspree endpoint
    const formId = process.env.FORMSPREE_FORM_ID || "mreegklb";
    const response = await fetch(`https://formspree.io/f/${formId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        message: message,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Formspree error:", responseData);
      throw new Error(responseData.error || "Failed to send message");
    }

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to send message";
    return { error: errorMessage };
  }
}
