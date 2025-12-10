import { Request, Response } from 'express';
import { z } from 'zod';
import supabase from '../utils/supabase';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';

// Validation schemas
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum(['RESIDENT', 'ARTIST', 'HOA_ADMIN']).optional(),
  suburbId: z.string().uuid().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const magicLinkSchema = z.object({
  email: z.string().email(),
});

/**
 * POST /api/auth/signup
 * Create a new user account
 */
export async function signup(req: Request, res: Response) {
  try {
    const body = signupSchema.parse(req.body);

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', body.email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await hashPassword(body.password);

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email: body.email,
        password: hashedPassword,
        name: body.name,
        role: body.role || 'RESIDENT',
        suburb_id: body.suburbId,
      })
      .select('id, email, name, role, suburb_id, created_at')
      .single();

    if (error || !user) {
      console.error('Signup error:', error);
      return res.status(500).json({ error: 'Failed to create account' });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        suburbId: user.suburb_id,
        createdAt: user.created_at,
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
 * Login with email and password
 */
export async function login(req: Request, res: Response) {
  try {
    const body = loginSchema.parse(req.body);

    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', body.email)
      .single();

    if (error || !user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await comparePassword(body.password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        suburbId: user.suburb_id,
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

/**
 * POST /api/auth/magic-link
 * Request a magic link for passwordless login (simplified - no email sending)
 */
export async function requestMagicLink(req: Request, res: Response) {
  try {
    const body = magicLinkSchema.parse(req.body);

    // Find or create user
    let { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', body.email)
      .single();

    if (!user) {
      // Create user if doesn't exist
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          email: body.email,
          name: body.email.split('@')[0],
          role: 'RESIDENT',
        })
        .select()
        .single();

      if (error || !newUser) {
        return res.status(500).json({ error: 'Failed to create user' });
      }
      user = newUser;
    }

    // For MVP, just return a token directly (skip email)
    const token = generateToken(user.id);

    res.json({
      message: 'Magic link generated',
      token, // In production, send via email instead
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Magic link error:', error);
    res.status(500).json({ error: 'Failed to send magic link' });
  }
}

/**
 * GET /api/auth/verify-magic/:token
 * Verify magic link (simplified for MVP)
 */
export async function verifyMagicLink(req: Request, res: Response) {
  try {
    res.status(501).json({ 
      error: 'Magic link verification not implemented yet. Use regular login instead.' 
    });
  } catch (error) {
    console.error('Verify magic link error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
}

