"use client";
import { useState, useEffect, forwardRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface CaptchaProps {
  onChange: (token: string | null) => void;
  onExpired?: () => void;
}

const Captcha = forwardRef<ReCAPTCHA, CaptchaProps>(function Captcha(
  { onChange, onExpired },
  ref,
) {
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  useEffect(() => {
    setMounted(true);
    if (!siteKey || siteKey === "your-site-key-here") {
      setError(
        "reCAPTCHA site key not configured. Please add NEXT_PUBLIC_RECAPTCHA_SITE_KEY to your .env.local file (local) or Vercel environment variables (production)",
      );
    }
  }, [siteKey]);

  if (!mounted) {
    return (
      <div
        className="flex flex-col items-center gap-2"
        style={{ minHeight: "78px" }}
      >
        {/* Placeholder to prevent layout shift */}
      </div>
    );
  }

  if (!siteKey || siteKey === "your-site-key-here") {
    return (
      <div className="flex flex-col items-center gap-2 p-4 border border-red-500 rounded-lg bg-red-50">
        <p className="text-red-600 text-sm text-center">
          reCAPTCHA is not configured. Please add NEXT_PUBLIC_RECAPTCHA_SITE_KEY
          to your .env.local file (local) or Vercel environment variables
          (production)
        </p>
        <p className="text-xs text-gray-600 text-center">
          Get your key from:{" "}
          <a
            href="https://www.google.com/recaptcha/admin/create"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Google reCAPTCHA
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <ReCAPTCHA
        ref={ref}
        sitekey={siteKey}
        onChange={(token) => {
          setError(null);
          onChange(token);
        }}
        onExpired={() => {
          setError(null);
          if (onExpired) onExpired();
        }}
        onError={() => {
          setError("reCAPTCHA error. Please check your site key is valid.");
          onChange(null);
        }}
      />
      {error && (
        <p className="text-red-500 text-xs text-center mt-2">{error}</p>
      )}
    </div>
  );
});

export default Captcha;
