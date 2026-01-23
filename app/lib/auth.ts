import { cookies } from 'next/headers';
import clientPromise from './mongodb';
import bcrypt from 'bcryptjs';

export interface User {
  _id: string;
  username: string;
  email: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createSession(username: string) {
  const cookieStore = await cookies();
  cookieStore.set('username', username, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const username = cookieStore.get('username')?.value;
  return username || null;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('username');
}

export async function getUserByUsername(username: string) {
  const client = await clientPromise;
  const database = client.db('twitter');
  const users = database.collection('users');
  return await users.findOne({ username });
}

export async function createUser(username: string, email: string, hashedPassword: string) {
  const client = await clientPromise;
  const database = client.db('twitter');
  const users = database.collection('users');
  return await users.insertOne({
    username,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  });
}
