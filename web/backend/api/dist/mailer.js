import nodemailer from "nodemailer";
import { env } from "./config.js";
function getTransport() {
    if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
        return null;
    }
    return nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465,
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
        auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
        },
    });
}
export async function sendOtpEmail(email, otp, purpose, options) {
    const transport = getTransport();
    if (!transport) {
        throw new Error("SMTP is not configured on server");
    }
    const isRegistration = purpose === "registration";
    const isPasswordReset = purpose === "password-reset";
    const isProfileEmailChange = purpose === "profile-email-old" || purpose === "profile-email-new";
    const subject = isRegistration
        ? "GigBit registration OTP"
        : isPasswordReset
            ? "GigBit Password Verification"
            : isProfileEmailChange
                ? "GigBit Email Verification"
                : "GigBit OTP";
    const usernameLine = !isRegistration && options?.username
        ? `<p style="margin:0 0 8px;"><strong>Registered Username:</strong> ${options.username}</p>`
        : "";
    const html = `
    <div style="font-family: Inter, Arial, sans-serif; line-height:1.5; color:#0f172a;">
      <h2 style="margin:0 0 8px;">GigBit</h2>
      ${usernameLine}
      <p style="margin:0 0 10px;">Your one-time password is:</p>
      <div style="font-size:28px; letter-spacing:6px; font-weight:700; color:#1E3A8A; margin:8px 0 12px;">${otp}</div>
      <p style="margin:0 0 6px;">This OTP is valid for 10 minutes.</p>
      <p style="margin:0; color:#475569;">If you did not request this, you can ignore this email.</p>
    </div>
  `;
    let info;
    try {
        info = await transport.sendMail({
            from: env.SMTP_FROM || env.SMTP_USER,
            to: email,
            subject,
            html,
        });
    }
    catch (_) {
        // Retry once for transient SMTP/network issues.
        info = await transport.sendMail({
            from: env.SMTP_FROM || env.SMTP_USER,
            to: email,
            subject,
            html,
        });
    }
    const accepted = (info.accepted ?? []).map((v) => String(v).toLowerCase());
    const rejected = (info.rejected ?? []).map((v) => String(v).toLowerCase());
    const target = email.toLowerCase();
    if (rejected.includes(target) || !accepted.includes(target)) {
        throw new Error("SMTP rejected recipient");
    }
    return {
        messageId: String(info.messageId ?? ""),
        response: String(info.response ?? ""),
        accepted,
        rejected,
    };
}
export async function sendAdminPasswordEmail(email, password) {
    const transport = getTransport();
    if (!transport) {
        throw new Error("SMTP is not configured on server");
    }
    const subject = "GigBit Admin Portal Access";
    const html = `
    <div style="font-family: Inter, Arial, sans-serif; line-height:1.5; color:#0f172a;">
      <h2 style="margin:0 0 8px;">GigBit Admin Access</h2>
      <p style="margin:0 0 8px;">Admin Email: <strong>${email}</strong></p>
      <p style="margin:0 0 8px;">Temporary Password:</p>
      <div style="font-size:22px; letter-spacing:2px; font-weight:700; color:#1E3A8A; margin:8px 0 12px;">${password}</div>
      <p style="margin:0 0 6px;">Please login and change this password from the admin portal immediately.</p>
      <p style="margin:0; color:#475569;">If you did not request this, contact GigBit support.</p>
    </div>
  `;
    let info;
    try {
        info = await transport.sendMail({
            from: env.SMTP_FROM || env.SMTP_USER,
            to: email,
            subject,
            html,
        });
    }
    catch (_) {
        info = await transport.sendMail({
            from: env.SMTP_FROM || env.SMTP_USER,
            to: email,
            subject,
            html,
        });
    }
    const accepted = (info.accepted ?? []).map((v) => String(v).toLowerCase());
    const rejected = (info.rejected ?? []).map((v) => String(v).toLowerCase());
    const target = email.toLowerCase();
    if (rejected.includes(target) || !accepted.includes(target)) {
        throw new Error("SMTP rejected recipient");
    }
    return {
        messageId: String(info.messageId ?? ""),
        response: String(info.response ?? ""),
        accepted,
        rejected,
    };
}
