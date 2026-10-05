# Contributing to AnishMart

## Prerequisites

- Node.js
- npm
- MySQL Server
- Git

## Local Setup

1. Clone the repository:

   git clone https://github.com/Veeraanish/AnishMart.git

2. Open the project:

   cd AnishMart

3. Install server dependencies:

   cd server
   npm install

4. Copy the environment template:

   Copy-Item .env.example .env

5. Update the local MySQL values inside `.env`.

6. Create/import the database using:

   ../db/schema.sql
   ../db/seed.sql

7. Start the project:

   npm start

8. Open:

   http://localhost:5000

## Development Workflow

- Create a feature branch for new work.
- Use clear commit messages such as:
  - feat:
  - fix:
  - test:
  - docs:
  - security:
- Run tests before pushing:

  npm test

- Never commit `.env`, passwords, API keys, database backups, or other secrets.
- Verify important changes on the deployed Railway URL before considering the work complete.

## Production

Live application:

https://anishmart-production.up.railway.app