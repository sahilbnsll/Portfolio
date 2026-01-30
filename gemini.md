# Gemini Project Reference: Sahil Bansal's Portfolio

This document provides a comprehensive overview of the Sahil Bansal's Portfolio project for easy reference by the Gemini AI assistant.

## Project Overview

This is a personal portfolio website for Sahil Bansal, built with Next.js and Tailwind CSS. It showcases his skills, experience, projects, and certifications. The portfolio is designed to be clean, minimal, and responsive, with a focus on user experience. It also includes an AI-powered chatbot for user interaction.

## Tech Stack

- **Framework**: Next.js (v14)
- **Styling**: Tailwind CSS, Shadcn UI
- **UI Components**: Custom components, Radix UI, Lucide Icons
- **AI Chatbot**: Groq API (Llama 3.1 8B)
- **Animations**: Framer Motion
- **Contact Form**: Resend
- **Deployment**: Vercel
- **Linting**: ESLint
- **Formatting**: Prettier
- **Languages**: TypeScript, JavaScript, CSS

## Key Features

- **AI Chatbot**: An interactive chatbot ("Sahil Support") trained on the portfolio's content.
- **Contact Form**: A functional contact form with email integration using Resend.
- **Responsive Design**: The portfolio is fully responsive and works well on all screen sizes.
- **Light/Dark Mode**: A theme toggle for switching between light and dark modes.
- **Skills & Certifications**: Visualizations for skills and certifications.
- **Project Showcase**: A dedicated section to showcase personal and professional projects.
- **Experience Timeline**: A timeline of Sahil's career and education.
- **MDX Support**: Content from Markdown files can be rendered as components.

## Project Structure

- **`src/app/`**: The main application directory for a Next.js project using the App Router.
  - **`api/`**: Contains API routes for the chatbot and other server-side logic.
  - **`contact/`**: The contact page.
  - **`projects/`**: The projects page.
  - **`page.tsx`**: The main landing page of the portfolio.
  - **`layout.tsx`**: The main layout for the application.
- **`src/components/`**: Contains all the React components used in the application.
  - **`ui/`**: Contains the UI components from Shadcn UI.
  - **`email/`**: Contains the email template for the contact form.
- **`src/data/`**: Contains all the data for the portfolio in JSON and Markdown files.
- **`public/`**: Contains all the static assets like images, resume, and sounds.
- **`package.json`**: Lists the project's dependencies and scripts.
- **`next.config.mjs`**: The configuration file for Next.js.
- **`tailwind.config.ts`**: The configuration file for Tailwind CSS.

## Running the Project

1.  Clone the repository.
2.  Install dependencies with `npm install`.
3.  Copy `.env.example` to `.env.local` and add the required API keys.
4.  Run the development server with `npm run dev`.

## Customization

-   Personal information can be updated in the JSON files in the `src/data/` directory.
-   The chatbot prompt can be modified in `src/app/api/chat/route.ts`.
-   The resume can be replaced in the `public/` directory.

## Deployment

The project is deployed on Vercel. To deploy, connect the GitHub repository to a Vercel account, add the environment variables, and deploy.
