# Tech Review Site

A Next.js-based tech review platform with admin capabilities for managing articles and reviews.

## Features

- 🚀 Built with Next.js 14 and TypeScript
- 🎨 Styled with Tailwind CSS
- 🔒 Authentication with NextAuth.js
- 📝 Rich text editing with TinyMCE
- 🗄️ PostgreSQL database with Prisma ORM
- 🔄 Redis caching for performance
- ✨ Optimized image handling
- 📱 Responsive design
- 👤 Admin dashboard for content management

## Deployment Instructions

### 1. GitHub Setup

1. Create a new GitHub repository
2. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

### 2. Vercel Setup

1. Create a [Vercel account](https://vercel.com/signup) if you don't have one
2. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
3. Login to Vercel:
   ```bash
   vercel login
   ```
4. Link your project:
   ```bash
   vercel link
   ```

### 3. Environment Setup

1. Create a Vercel project and add the following environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `REDIS_URL`: Your Redis connection string
   - `NEXTAUTH_URL`: Your production URL (e.g., https://your-site.vercel.app)
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXT_PUBLIC_BASE_URL`: Same as NEXTAUTH_URL

2. Add GitHub repository secrets:
   - Go to your GitHub repository settings
   - Navigate to Secrets and Variables > Actions
   - Add a new secret `VERCEL_TOKEN` (Get from Vercel dashboard > Settings > Tokens)

### 4. Database Setup

1. Set up a PostgreSQL database (recommended providers: Supabase, Railway, or Neon)
2. Set up a Redis instance (recommended providers: Upstash or Redis Labs)
3. Run migrations on production:
   ```bash
   npx prisma migrate deploy
   ```

### 5. Continuous Deployment

The repository includes two GitHub Actions workflows:

1. `ci.yml`: Runs tests, type checking, and security scans on every push and pull request
2. `deploy.yml`: Automatically deploys to Vercel when pushing to the main branch

To enable automatic deployments:

1. Push your code to the main branch
2. The GitHub Actions workflow will automatically:
   - Run tests and checks
   - Build the project
   - Deploy to Vercel

### 6. Post-Deployment

1. Create an admin user:
   ```bash
   vercel env pull .env.production.local
   npx ts-node scripts/create-admin.ts
   ```

2. Verify your deployment:
   - Visit your Vercel URL
   - Log in with your admin credentials
   - Try creating and editing articles

## Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

## Testing

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
