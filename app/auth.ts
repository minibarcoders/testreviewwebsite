import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './lib/prisma';
import { validateLogin, generateToken } from './lib/validation';
const bcryptjs = require('bcryptjs');

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { 
          label: 'Email', 
          type: 'email',
          placeholder: 'Enter your email'
        },
        password: { 
          label: 'Password', 
          type: 'password',
          placeholder: 'Enter your password'
        }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('Missing credentials');
            throw new Error('Invalid credentials');
          }

          console.log('Received credentials:', {
            email: credentials.email,
            password_length: credentials.password.length,
            password_first_char: credentials.password[0],
            password_last_char: credentials.password[credentials.password.length - 1]
          });
          
          // Validate input
          const { email, password } = validateLogin(credentials);
          console.log('Validated credentials');

          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              password: true,
              role: true,
              name: true,
              image: true,
            }
          });

          if (!user || !user.password) {
            console.log('User not found or password not set:', email);
            throw new Error('Invalid credentials');
          }
          console.log('Found user:', { id: user.id, email: user.email });

          // Log password details for debugging
          console.log('Password details:', {
            input_length: password.length,
            stored_length: user.password.length,
            input_first_char: password[0],
            input_last_char: password[password.length - 1]
          });

          const isPasswordValid = await bcryptjs.compare(password, user.password);
          console.log('Password comparison result:', isPasswordValid);

          if (!isPasswordValid) {
            console.log('Invalid password for user:', email);
            throw new Error('Invalid credentials');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name || user.email.split('@')[0],
            role: user.role,
            image: user.image,
            csrfToken: generateToken(), // Generate CSRF token during login
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.image = user.image;
        token.csrfToken = user.csrfToken; // Include CSRF token in JWT
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
        session.user.image = token.image;
        (session.user as any).csrfToken = token.csrfToken; // Include CSRF token in session
      }
      return session;
    }
  },
  events: {
    async signIn({ user }) {
      console.log('User signed in:', user.email);
    },
    async signOut({ token }) {
      console.log('User signed out:', token.email);
    },
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};
