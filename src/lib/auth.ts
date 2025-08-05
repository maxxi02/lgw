import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin as adminPlugin } from "better-auth/plugins";
import { db } from "./database/db";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  trustedOrigins: [process.env.NODE_ENV, "http://localhost:3000"],
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  database: mongodbAdapter(db),
  appName: "LGW Warehouse",
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    adminPlugin({
      adminRoles: ["admin"],
      defaultRole: "user",
    }),
    // twoFactor({
    //   skipVerificationOnEnable: true,
    //   otpOptions: {
    //     async sendOTP({ user, otp }) {
    //       await resend.emails.send({
    //         from: `LGW Warehouse <${SENDER_EMAIL}>`,
    //         to: user.email, // verification email must be sent to the current user email to approve the change
    //         subject: "2FA Verification",
    //         text: `Verify your OTP: ${otp}`,
    //       });
    //     },
    //   },
    // }),
    nextCookies(),
  ],
});
