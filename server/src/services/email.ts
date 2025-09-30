import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM || "no-reply@example.com";

let resend: Resend | null = null;
if (resendApiKey) {
  resend = new Resend(resendApiKey);
}

export async function sendOtpEmail(to: string, code: string) {
  if (!resend) {
    console.log(`[DEV] OTP for ${to}: ${code}`);
    return;
  }
  await resend.emails.send({
    from,
    to,
    subject: "Your OTP Code",
    html: `<p>Your OTP code is <strong>${code}</strong>. It expires in 10 minutes.</p>`,
  });
}
