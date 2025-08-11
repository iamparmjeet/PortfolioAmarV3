// src/components/contact/contact-form-email-template.tsx

import * as React from "react";

import type { FormSchemaInfer } from "@/lib/types";

import { FullDateAndTime } from "@/lib/utils"; // Import the utility functions

// Define prop types properly
type ContactFormEmailTemplateProps = {
  submissionTime?: string; // This prop is actually handled by FullDateAndTime() if called within the template
  trackingPixel?: string;
} & FormSchemaInfer;

export function ContactFormEmailTemplate({
  name,
  email,
  mobile,
  subject,
  message,
  clientwebsite, // Use clientwebsite from the props
  trackingPixel,
}: ContactFormEmailTemplateProps) {
  // Use the utility function for formatting the website
  const submissionDateTime = FullDateAndTime(); // Get the current date/time

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f4f4f4",
        padding: "20px",
        color: "#333",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: "#007bff", // Blue for submission notification
            padding: "20px",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "22px" }}>
            📩 New Contact Form Submission
          </h1>
        </div>

        {/* Body */}
        <div style={{ padding: "20px" }}>
          <p style={{ fontSize: "16px" }}>
            You have received a new message from
            {" "}
            <a href="https://amarjeetmishra.com" target="_blank" rel="noopener noreferrer" style={{ color: "#007bff", textDecoration: "none" }}>
              amarjeetmishra.com
            </a>
            {" "}
            contact form.
          </p>

          <p style={{ fontSize: "14px", color: "#777", marginTop: "10px" }}>
            Submitted at:
            {" "}
            {submissionDateTime}
          </p>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "15px",
            }}
          >
            <tbody>
              <tr>
                <td style={{ fontWeight: "bold", padding: "8px", border: "1px solid #ddd", width: "30%" }}>Name</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{name || "Not Provided"}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold", padding: "8px", border: "1px solid #ddd" }}>Email</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  <a href={`mailto:${email}`} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff", textDecoration: "none" }}>
                    {email || "Not Provided"}
                  </a>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold", padding: "8px", border: "1px solid #ddd" }}>Mobile</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{mobile || "Not Provided"}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold", padding: "8px", border: "1px solid #ddd" }}>Website</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {clientwebsite === ""
                    ? (
                        "Not Provided"
                      )
                    : (
                        <a href={clientwebsite} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff", textDecoration: "none" }}>
                          {clientwebsite}
                        </a>
                      )}
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold", padding: "8px", border: "1px solid #ddd" }}>Subject</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{subject || "No Subject"}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold", padding: "8px", border: "1px solid #ddd" }}>Message</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{message || "No message provided."}</td>
              </tr>
            </tbody>
          </table>

          {/* Tracking Pixel */}
          {trackingPixel && (
            <img
              src={trackingPixel}
              alt=""
              width="1"
              height="1"
              style={{ display: "block", border: 0, outline: "none", height: "1px", width: "1px", visibility: "hidden" }}
            />
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            backgroundColor: "#f0f0f0",
            padding: "15px",
            textAlign: "center",
            fontSize: "12px",
            color: "#777",
          }}
        >
          ©
          {" "}
          {new Date().getFullYear()}
          {" "}
          <a href="https://amarjeetmishra.com" target="_blank" rel="noopener noreferrer" style={{ color: "#007bff", textDecoration: "none" }}>
            amarjeetmishra.com
          </a>
          {" "}
          All rights reserved.
        </div>
      </div>
    </div>
  );
}

// --- Confirmation Email Template ---

type ConfirmationEmailTemplateProps = {
  name: string;
  email: string;
  mobile?: string;
  subject: string;
  message?: string;
  clientwebsite?: string;
  trackingPixel?: string;
};

export function ConfirmationEmailTemplate({
  name,
  subject,
  clientwebsite,
  trackingPixel,
}: ConfirmationEmailTemplateProps) {
  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f4f4f4",
        padding: "20px",
        color: "#333",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: "#28a745", // Green for confirmation
            padding: "20px",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "22px" }}>
            ✅ Thank You for Contacting Us!
          </h1>
        </div>

        {/* Body */}
        <div style={{ padding: "20px" }}>
          <p style={{ fontSize: "18px", marginBottom: "15px" }}>
            Hi
            {" "}
            {name || "Valued User"}
            ,
          </p>
          <p style={{ fontSize: "16px", marginBottom: "15px" }}>
            Thank you for reaching out! We've successfully received your message
            regarding "
            <strong>{subject || "your inquiry"}</strong>
            ".
          </p>
          <p style={{ fontSize: "16px", marginBottom: "20px" }}>
            We appreciate you taking the time to contact us. Our team will review
            your submission and get back to you as soon as possible.
          </p>
          <p style={{ fontSize: "14px", color: "#6c757d", marginTop: "20px" }}>
            This is an automated confirmation of your submission.
          </p>
          <p style={{ fontSize: "14px", color: "#6c757d", marginTop: "20px" }}>
            Submission Time:
            {" "}
            {FullDateAndTime()}
          </p>

          {clientwebsite && (
            <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
              <p style={{ fontSize: "15px", fontWeight: "bold" }}>Your submitted website:</p>
              <p style={{ fontSize: "15px" }}>
                <a href={clientwebsite} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff", textDecoration: "none" }}>
                  {clientwebsite}
                </a>
              </p>
            </div>
          )}

          {/* Tracking Pixel */}
          {trackingPixel && (
            <img
              src={trackingPixel}
              alt=""
              width="1"
              height="1"
              style={{ display: "block", border: 0, outline: "none", height: "1px", width: "1px", visibility: "hidden" }}
            />
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            backgroundColor: "#f0f0f0",
            padding: "15px",
            textAlign: "center",
            fontSize: "12px",
            color: "#777",
          }}
        >
          ©
          {" "}
          {new Date().getFullYear()}
          {" "}
          {/* Using new Date() here to render year */}
          {" "}
          <a href="https://amarjeetmishra.com" target="_blank" rel="noopener noreferrer" style={{ color: "#007bff", textDecoration: "none" }}>
            amarjeetmishra.com
          </a>
          . All rights reserved.
        </div>
      </div>
    </div>
  );
}
