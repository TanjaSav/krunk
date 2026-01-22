'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../components/input';
import Button from '../components/button';
import Image from 'next/image';
import Captcha from '../components/captcha';

const SignUp = () => {
  const router = useRouter();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!captchaToken) {
      alert('Vinsamlegast staðfestu að þú sért ekki vélmenni');
      return;
    }
    const formData = new FormData(e.currentTarget);
    console.log('Sign up attempt:', Object.fromEntries(formData));
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
        <form onSubmit={handleSubmit} className="space-y-4 w-full flex flex-col items-center">
          <Input name="username" label="Notandanafn" placeholder="Notandanafn" />
          <Input type="email" name="email" label="Netfang" placeholder="Netfang" />
          <Input type="password" name="password" label="Lykilorð" placeholder="Lykilorð" />
          <Captcha onChange={handleCaptchaChange} onExpired={handleCaptchaExpired} />
          <Button type="submit" disabled={!captchaToken}>Staðfesta</Button>
          <div className="flex items-center w-[229px] gap-2">
            <div className="flex-1 h-px bg-gray-600"></div>
            <span className="text-gray-400 text-sm">eða</span>
            <div className="flex-1 h-px bg-gray-600"></div>
          </div>
          <Button type="button" onClick={() => router.push('/login')}>Skrá inn</Button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
