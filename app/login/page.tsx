'use client';
import Input from '../components/input';
import Button from '../components/button';

const Login = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('Login attempt:', Object.fromEntries(formData));
  };
  return (
    <div className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="username" label="Notandanafn" placeholder="Notandanafn" />
          <Input type="password" name="password" label="Lykilorð" placeholder="Lykilorð" />
          <Button type="submit">Staðfesta</Button>
        </form>
      </div>
    </div>
  );
};

export default Login;