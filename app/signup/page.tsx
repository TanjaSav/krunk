"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Input from "../components/input";
import Button from "../components/button";
import Image from "next/image";
import Captcha from "../components/captcha";
import ReCAPTCHA from "react-google-recaptcha";

const SignUp = () => {
  const router = useRouter();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!captchaToken) {
      alert("Vinsamlegast staðfestu að þú sért ekki vélmenni");
      return;
    }
    const formData = new FormData(e.currentTarget);
    const data = {
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      captchaToken,
    };

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        router.push("/");
        router.refresh();
      } else {
        setCaptchaToken(null);
        captchaRef.current?.reset();
        alert("Villa: " + result.error);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setCaptchaToken(null);
      captchaRef.current?.reset();
      alert("Villa við að stofna aðgang");
    }
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  const handleCaptchaExpired = () => {
    setCaptchaToken(null);
  };
  return (
    <div className="min-h-screen p-8 bg-[#000000] flex items-center justify-center">
      <div className="max-w-md w-full space-y-6 flex flex-col items-center">
        <Image src="/images/logo.svg" alt="Logo" width={95} height={101} />
        <h1 className="text-2xl font-bold mb-6 text-center">Sign up</h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full flex flex-col items-center"
        >
          <Input
            name="username"
            label="Notandanafn"
            placeholder="Notandanafn"
          />
          <Input
            type="email"
            name="email"
            label="Netfang"
            placeholder="Netfang"
          />
          <Input
            type="password"
            name="password"
            label="Lykilorð"
            placeholder="Lykilorð"
          />
          <Captcha
            ref={captchaRef}
            onChange={handleCaptchaChange}
            onExpired={handleCaptchaExpired}
          />
          <Button type="submit" disabled={!captchaToken}>
            Staðfesta
          </Button>
          <div className="flex items-center w-[229px] gap-2">
            <div className="flex-1 h-px bg-gray-600"></div>
            <span className="text-gray-400 text-sm">eða</span>
            <div className="flex-1 h-px bg-gray-600"></div>
          </div>
          <Button type="button" onClick={() => router.push("/login")}>
            Skrá inn
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
