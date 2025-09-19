# Database Setup with Prisma and NeonDB

This project uses Prisma as the ORM and NeonDB as the PostgreSQL database provider, integrated with NextAuth.js for authentication.

## Prerequisites

1. A NeonDB account and database
2. Google OAuth credentials for NextAuth

## Setup Instructions

### 1. Environment Variables

Copy the `env.example` file to `.env` and fill in the required values:

```bash
cp env.example .env
```

Required environment variables:
- `DATABASE_URL`: Your NeonDB connection string
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `NEXTAUTH_SECRET`: A random secret for NextAuth (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL`: Your app URL (http://localhost:3000 for development)

### 2. Database Migration

Once you have your `DATABASE_URL` configured, run the migration to create the database tables:

```bash
bun run db:migrate
```

This will:
- Create the initial migration
- Apply the migration to your NeonDB database
- Generate the Prisma client

### 3. Available Scripts

- `bun run db:generate` - Generate Prisma client
- `bun run db:push` - Push schema changes to database (for development)
- `bun run db:migrate` - Create and apply migrations
- `bun run db:studio` - Open Prisma Studio (database GUI)

## Database Schema

The database includes the following models required by NextAuth.js:

- **User**: User accounts with email, name, and profile image
- **Account**: OAuth provider accounts linked to users
- **Session**: User sessions for authentication
- **VerificationToken**: Email verification tokens

## NextAuth Integration

The application is configured to use:
- Prisma adapter for database storage
- Database session strategy
- Google OAuth provider

## Getting Your NeonDB Connection String

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project or select an existing one
3. Go to the "Connection Details" section
4. Copy the connection string and use it as your `DATABASE_URL`

The connection string format:
```
postgresql://username:password@hostname:port/database?sslmode=require
```

## Troubleshooting

### Common Issues

1. **Connection refused**: Check your `DATABASE_URL` and ensure your NeonDB database is active
2. **Migration fails**: Ensure you have the correct permissions on your database
3. **NextAuth errors**: Verify all environment variables are set correctly

### Reset Database

To reset your database (⚠️ This will delete all data):

```bash
bunx prisma migrate reset
```

This will:
- Drop the database
- Recreate it
- Run all migrations
- Run seed scripts (if any)
