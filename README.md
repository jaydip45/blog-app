# Full-Stack Blog Platform

A modern, responsive, and feature-rich blog platform built with Next.js, Node.js, and MySQL.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router, runs on port 3001), TypeScript, Tailwind CSS, TanStack Query, Zustand.
- **Backend**: Node.js, Express, Prisma ORM, JWT, Bcrypt, Zod.
- **Database**: MySQL.
- **DevOps**: Docker, Docker Compose.

## Features

- **Authentication**: JWT-based login/register with role support (Admin, Author, User).
- **Blog Management**: CRUD operations for posts, Rich Text Editor (TipTap), Categories, and Tags.
- **Interactions**: Like and Comment on posts.
- **Search & Filter**: Search by title/content and filter by category/tag.
- **Modern UI**: Clean, responsive design with dark mode support and premium aesthetics.
- **SEO**: Slug-based routing and meta tags.

## Getting Started

### Prerequisites

- Node.js (v18+)
- Docker and Docker Compose
- MySQL (if running locally without Docker)

### Installation

1. **Clone the repository**
2. **Setup environment variables**
   - Create `.env` in `backend/` (see `.env.example`)
   - Create `.env.local` in `frontend/` (see `.env.example`)

3. **Run with Docker (Recommended)**
   ```bash
   docker-compose up --build
   ```

4. **Initialize Database and Seed**
   ```bash
   cd backend
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

## API Documentation

### Auth
- `POST /api/auth/register` - Create a new account
- `POST /api/auth/login` - Login to account
- `GET /api/auth/me` - Get current user profile

### Blogs
- `GET /api/posts` - Get all posts (supports pagination, search, filters)
- `GET /api/posts/:slug` - Get single post by slug
- `POST /api/posts` - Create post (Author/Admin only)
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Interactions & Taxonomy
- `GET /api/interactions/categories` - Get all categories
- `GET /api/interactions/tags` - Get all tags
- `POST /api/interactions/comments` - Add a comment
- `POST /api/interactions/likes` - Toggle like on a post

## Contact
Project created by Antigravity AI.
