import { cookies } from "next/headers";
import clientPromise from "./mongodb";
import bcrypt from "bcryptjs";

export interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Verifies a reCAPTCHA token with Google's API
 * @param token - The reCAPTCHA token from the client (must be verified within 2 minutes)
 * @param remoteip - Optional. The user's IP address for additional verification
 * @returns true if verification succeeds, false otherwise
 */
export async function verifyRecaptcha(
  token: string | null | undefined,
  remoteip?: string,
): Promise<boolean> {
  if (!token) {
    console.error("reCAPTCHA: No token provided");
    return false;
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error("RECAPTCHA_SECRET_KEY is not configured");
    // In development, allow requests if secret key is missing (for testing)
    // In production, this should fail
    if (process.env.NODE_ENV === "production") {
      return false;
    }
    console.warn(
      "⚠️  reCAPTCHA verification skipped (secret key not configured)",
    );
    return true; // Allow in development for testing
  }

  try {
    // Build POST body with required parameters
    const bodyParams = new URLSearchParams({
      secret: secretKey,
      response: token,
    });

    // Add optional remoteip parameter if provided
    if (remoteip) {
      bodyParams.append("remoteip", remoteip);
    }

    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: bodyParams.toString(),
      },
    );

    const data = await response.json();

    // Handle verification response
    if (!data.success) {
      const errorCodes = data["error-codes"] || [];

      // Map error codes to user-friendly messages
      const errorMessages: Record<string, string> = {
        "missing-input-secret": "reCAPTCHA secret key is missing",
        "invalid-input-secret": "reCAPTCHA secret key is invalid",
        "missing-input-response": "reCAPTCHA response token is missing",
        "invalid-input-response": "reCAPTCHA response token is invalid",
        "bad-request": "Invalid reCAPTCHA request",
        "timeout-or-duplicate":
          "reCAPTCHA token expired or already used. Please try again.",
      };

      const errorMessage = errorCodes
        .map((code: string) => errorMessages[code] || code)
        .join(", ");

      console.error("reCAPTCHA verification failed:", {
        success: data.success,
        "error-codes": errorCodes,
        message: errorMessage,
        challenge_ts: data.challenge_ts,
        hostname: data.hostname,
      });

      // Special handling for timeout-or-duplicate
      if (errorCodes.includes("timeout-or-duplicate")) {
        console.warn(
          "⚠️  reCAPTCHA token expired or already used. User needs to complete challenge again.",
        );
      }
    } else {
      // Log successful verification (optional, can be removed in production)
      if (process.env.NODE_ENV === "development") {
        console.log("reCAPTCHA verification successful:", {
          challenge_ts: data.challenge_ts,
          hostname: data.hostname,
        });
      }
    }

    // Google returns { success: true/false, 'error-codes': [...] }
    // Tokens are valid for 2 minutes and can only be verified once
    return data.success === true;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}

export async function createSession(username: string) {
  const cookieStore = await cookies();
  cookieStore.set("username", username, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const username = cookieStore.get("username")?.value;
  return username || null;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("username");
}

export async function getUserByUsername(username: string) {
  const client = await clientPromise;
  const database = client.db("twitter");
  const users = database.collection("users");
  return await users.findOne({ username });
}

export async function createUser(
  username: string,
  email: string,
  hashedPassword: string,
) {
  const client = await clientPromise;
  const database = client.db("twitter");
  const users = database.collection("users");
  return await users.insertOne({
    username,
    email,
    password: hashedPassword,
    profilePicture: "/images/circle.png",
    createdAt: new Date(),
  });
}
