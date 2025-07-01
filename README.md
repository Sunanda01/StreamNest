This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## StreamNest

A video streaming platform designed to deliver high-quality content with a smooth user experience that supports screen recording and uploading video.

<img src="/public/screenshots/Poster.png" alt="Poster" />

## Quick Glimpses

<table>
  <tr>
    <td>SignIn Page<br><img src="/public/screenshots/sign-in.png" alt="Register Page" /></td>
     <td>Home Page<br><img src="/public/screenshots/home.png" alt="Home Page" /></td>
    </tr>
   <tr>
    <td>Start Recording<br/> <img src="/public/screenshots/start-recording.png" alt="Start Recording" /></td>
     <td>Stop Recording<br/> <img src="/public/screenshots/stop-recording.png" alt="Stop Recording" /></td>
  </tr>
   <tr>
    <td>Screen Recording<br/> <img src="/public/screenshots/screen-recording.png" alt="Screen Recording" /></td>
     <td>Upload Video<br/> <img src="/public/screenshots/uplaod-video.png" alt="Upload Video" /></td>
  </tr>
  <tr>
    <td>Video Detail Page<br/> <img src="/public/screenshots/video-detail.png" alt="Video Detail Page" /></td>
     <td>Profile Page<br/> <img src="/public/screenshots/profile.png" alt="Profile Page" /></td>
  </tr>
</table>

## Clone the repo

```bash
git clone https://github.com/Sunanda01/StreamNest.git
```

## Add .env of this project

```bash
NEXT_PUBLIC_BASE_URL=
NEXT_PUBLIC_BUNNY_STORAGE_ZONE=
NEXT_PUBLIC_BUNNY_STORAGE_ACCESS_KEY=

#Better Auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

#Google Cloud 
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

#XATA POSTGRES
XATA_API_KEY=
DATABASE_URL_POSTGRES=
DATABASE_URL=

#Bunny
BUNNY_LIBRARY_ID=
BUNNY_STREAM_ACCESS_KEY=
BUNNY_STORAGE_ACCESS_KEY=
BUNNY_STORAGE_ZONE=

#Arcjet
ARCJET_API_KEY=
```

## Architecture Overview
```bash
                 🌍 Client (Browser)
                        │
                        ▼
               ┌────────────────────┐
               │     API Layer      │
               │  (Next.js + SA)    │
               └────────┬───────────┘
                        │
            ┌───────────▼───────────┐
            │       Arcjet          │  ◄─ Bot detection, abuse filter
            └───────────┬───────────┘
                        │
       ┌────────────────┴──────────────┐
       ▼                               ▼
┌──────────────┐              ┌──────────────────────┐
│   Bunny CDN  │              │    Database Layer     │
│  (HLS Video) │              │ Drizzle → PostgreSQL  │
└──────────────┘              │       + Xata DB       │
                              └──────────────────────┘


```

