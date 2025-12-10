import { Request, Response } from 'express';
import { z } from 'zod';
import supabase from '../utils/supabase';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';

const signupSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
});

/**
 * POST /api/auth/signup
 * Simple signup - email optional for Alpha
 */
export async function signup(req: Request, res: Response) {
  try {
    const body = signupSchema.parse(req.body);

    // For Alpha, create user with minimal info
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email: body.email,
        name: body.name,
      })
      .select()
      .single();

    if (error || !user) {
      console.error('Signup error:', error);
      return res.status(500).json({ error: 'Failed to create account' });
    }

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
}

/**
 * POST /api/auth/login
 * Simple login - just email for Alpha
 */
export async function login(req: Request, res: Response) {
  try {
    const body = loginSchema.parse(req.body);

    // Find user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', body.email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
}

