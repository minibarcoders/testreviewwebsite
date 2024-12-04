# Fixed or Custom - Tech Review Site

A modern tech review and blog platform built with Next.js 14, featuring in-depth reviews, tech insights, and the latest in consumer technology.

## Features

- 🚀 Built with Next.js 14 and App Router
- 💅 Styled with Tailwind CSS
- 📊 Google Analytics 4 Integration
- 🗃️ PostgreSQL Database with Prisma ORM
- 🔒 Authentication with NextAuth.js
- 📝 Rich Text Editor for Content Creation
- 🖼️ Image Optimization and Management
- 🎯 SEO Optimized

## Getting Started

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/tech-review-site.git
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
Create a \`.env.local\` file with the following variables:
\`\`\`
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
NEXT_PUBLIC_GA_ID=
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

## Database Setup

1. Run Prisma migrations:
\`\`\`bash
npx prisma migrate dev
\`\`\`

2. Seed the database (if needed):
\`\`\`bash
npx prisma db seed
\`\`\`

## Deployment

The site is deployed on Vercel. Push to main branch to trigger automatic deployment.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for your own purposes.

## Contact

For any questions or feedback, please reach out through the contact form on the site.
