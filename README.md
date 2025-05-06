# Postoria Project Setup and Deployment Guide

## Prerequisites

Make sure you have the following installed:

- **Node.js**
- **npm** (package manager)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

Create .env file and add the following:
```bash
NEXT_USER_APP_PORT=3001
NEXT_PUBLIC_APP_API_URL=http://localhost:3000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

## Running in development mode
```bash
npm i
npm run dev
```