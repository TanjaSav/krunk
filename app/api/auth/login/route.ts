import { NextResponse } from "next/server";
import {
  getUserByUsername,
  verifyPassword,
  createSession,
  verifyRecaptcha,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, captchaToken } = body;

    // 1. Validate required fields
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required" },
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

    // 3. Sanitize username input
    const sanitizedUsername = username.trim();

    // 4. Validate username format
    if (!sanitizedUsername || sanitizedUsername.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid username format" },
        { status: 400 },
      );
    }

    // 5. Check if user exists
    const user = await getUserByUsername(sanitizedUsername);
    if (!user || !user.password) {
      return NextResponse.json(
        { success: false, error: "Invalid username or password" },
        { status: 401 },
      );
    }

    // 6. Verify password
    const isValidPassword = await verifyPassword(
      password,
      user.password as string,
    );
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: "Invalid username or password" },
        { status: 401 },
      );
    }

    // 7. Create session with sanitized username
    await createSession(sanitizedUsername);

    return NextResponse.json({
      success: true,
      message: "Login successful",
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to login" },
      { status: 500 },
    );
  }
}
