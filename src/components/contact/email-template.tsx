import * as React from "react";

import type { FormSchemaInfer } from "@/lib/types";

export function ContactFormEmailTemplate({
  name,
  email,
  mobile,
  subject,
  message,
}: FormSchemaInfer) {
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
          maxWidth: "600px",
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
            backgroundColor: "#007bff",
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
            You have received a new message from your website contact form.
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
                <td
                  style={{
                    fontWeight: "bold",
                    padding: "8px",
                    border: "1px solid #ddd",
                    width: "30%",
                  }}
                >
                  Name
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {name}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    fontWeight: "bold",
                    padding: "8px",
                    border: "1px solid #ddd",
                  }}
                >
                  Email
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {email}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    fontWeight: "bold",
                    padding: "8px",
                    border: "1px solid #ddd",
                  }}
                >
                  Mobile
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {mobile}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    fontWeight: "bold",
                    padding: "8px",
                    border: "1px solid #ddd",
                  }}
                >
                  Subject
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {subject}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    fontWeight: "bold",
                    padding: "8px",
                    border: "1px solid #ddd",
                  }}
                >
                  Message
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {message}
                </td>
              </tr>
            </tbody>
          </table>

          <p style={{ fontSize: "14px", color: "#777", marginTop: "20px" }}>
            This message was sent from your website contact form.
          </p>
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
          Your Company. All rights reserved.
        </div>
      </div>
    </div>
  );
}
