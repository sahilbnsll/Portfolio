# Sahil Bansal's Portfolio

A clean, minimal portfolio website built with Next.js, Tailwind CSS, and Shadcn UI. Features an AI chatbot, email contact form, and certification showcase.

## Live Demo

🌐 Check it out here: **[sahilbansal.dev](https://sahilbansal.dev)**

![Portfolio Screenshot](public/img/hero.png)

## Features

- Minimal design with Shadcn UI
- Light/dark mode toggle
- AI chatbot (Sahil Support) trained on my portfolio content - please be nice to it! 😊
- Contact form with email integration
- Responsive mobile design
- Skills & Certifications visualization

## Tech Stack

- Next.js
- Tailwind CSS
- Shadcn UI
- Groq API (Llama 3.1 8B for chatbot)
- Vercel (hosting)
- Formspree (contact form)
- Framer Motion (animations)

## Getting Started

```bash
git clone https://github.com/sahilbansal/portfolio.git my-portfolio
cd my-portfolio
npm install
cp .env.example .env.local
# add your API keys to .env.local
npm run dev
```

## Environment Variables

See .env.example

## Customization

- Update personal info in `src/data/*.json`
- Replace projects in `src/data/projects.json`
- Update skills in `src/data/skills.json`
- Replace your resume with `public/Sahil_Bansal_Resume.pdf`
- Modify chatbot prompt in `src/app/api/chat/route.ts`

## Deployment

I prefer [Vercel](https://vercel.com/) for Next.js projects:

1. Push your fork to GitHub
2. Connect repo to Vercel
3. Add environment variables
4. Deploy 🎉

## Costs

- Groq API: Free (beta)
- Formspree: Free tier
- Domain: ~$20/year
- Hosting: Free (Vercel)

## License

MIT

---

✨ Feel free to fork and make it your own!

-- Sahil
