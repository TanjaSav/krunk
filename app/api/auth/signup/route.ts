import { NextResponse } from "next/server";
import {
  createUser,
  getUserByUsername,
  hashPassword,
  createSession,
  verifyRecaptcha,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password, captchaToken } = body;

    // 1. Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 },
      );
    }

    if (!captchaToken) {
      return NextResponse.json(
        { success: false, error: "Please complete the captcha" },
        { status: 400 },
      );
    }

    // 2. Verify reCAPTCHA token
    // Extract user's IP address from request headers (optional but recommended)
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const remoteip = forwarded?.split(",")[0] || realIp || undefined;

    const isRecaptchaValid = await verifyRecaptcha(captchaToken, remoteip);
    if (!isRecaptchaValid) {
      return NextResponse.json(
        {
          success: false,
          error: "reCAPTCHA verification failed. Please try again.",
        },
        { status: 400 },
      );
    }

    // 3. Sanitize and validate inputs
    const sanitizedUsername = username.trim();
    const sanitizedEmail = email.trim().toLowerCase();

    // Validate username format (alphanumeric and underscore, 3-20 chars)
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(sanitizedUsername)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Username must be 3-20 characters and contain only letters, numbers, and underscores",
        },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password length (minimum 6 characters)
    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must be at least 6 characters long",
        },
        { status: 400 },
      );
    }

    // 4. Check if username already exists
    const existingUser = await getUserByUsername(sanitizedUsername);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Username already exists" },
        { status: 400 },
      );
    }

    // 5. Create user with sanitized data
    const hashedPassword = await hashPassword(password);
    await createUser(sanitizedUsername, sanitizedEmail, hashedPassword);
    await createSession(sanitizedUsername);

    return NextResponse.json({
      success: true,
      message: "User created successfully",
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create user" },
      { status: 500 },
    );
  }
}
