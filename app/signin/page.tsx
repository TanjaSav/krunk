'use client';
import Input from '../components/input';
import Button from '../components/button';
import Image from 'next/image';

const SignIn = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('Sign in attempt:', Object.fromEntries(formData));
  };
  return (
    <div className="min-h-screen p-8 bg-[#000000] flex items-center justify-center">
      <div className="max-w-md w-full space-y-6 flex flex-col items-center">
        <Image src="/images/logo.svg" alt="Logo" width={95} height={101} />
        <h1 className="text-2xl font-bold mb-6 text-center">Sign in</h1>
        <form onSubmit={handleSubmit} className="space-y-4 w-full flex flex-col items-center">
          <Input name="username" label="Notandanafn" placeholder="Notandanafn" />
          <Input type="email" name="email" label="Netfang" placeholder="Netfang" />
          <Input type="password" name="password" label="Lykilorð" placeholder="Lykilorð" />
          <Button type="submit">Staðfesta</Button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
