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

---

## StreamNest

A video streaming platform designed to deliver high-quality content with a smooth user experience that supports screen recording and uploading video.

<img src="/public/screenshots/Poster.jpg" alt="Poster" />

---

## Quick Glimpses

<table>
  <tr>
    <td>SignIn Page<br><img src="/public/screenshots/sign-in.png" alt="Register Page" /></td>
     <td>Home Page<br><img src="/public/screenshots/home.png" alt="Home Page" /></td>
    </tr>
     <tr>
    <td colspan=2>Home2 Page<br><img src="/public/screenshots/home2.png" alt="Home2 Page" /></td>
    </tr>
    <tr>
    <td>Filter<br/> <img src="/public/screenshots/filter.png" alt="Filter" /></td>
     <td>Update Visibility<br/> <img src="/public/screenshots/update_visibility.png" alt="Update Visibility" /></td>
  </tr>
   <tr>
    <td>Video Detail Page<br/> <img src="/public/screenshots/video-detail.png" alt="Video Detail Page" /></td>
     <td>Profile Page<br/> <img src="/public/screenshots/profile.png" alt="Profile Page" /></td>
  </tr>
   <tr>
    <td>Start Recording<br/> <img src="/public/screenshots/start-recording.png" alt="Start Recording" /></td>
     <td>Stop Recording<br/> <img src="/public/screenshots/stop-recording.png" alt="Stop Recording" /></td>
  </tr>
   <tr>
    <td>Screen Recording<br/> <img src="/public/screenshots/screen-recording.png" alt="Screen Recording" /></td>
     <td>Upload Video<br/> <img src="/public/screenshots/uplaod-video.png" alt="Upload Video" /></td>
  </tr>
</table>

---

## Clone the repo

```bash
git clone https://github.com/Sunanda01/StreamNest.git
```
---

## Add .env of this project

```bash
NEXT_PUBLIC_BASE_URL= 

#Better Auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL= 

#Google Cloud 
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

#Arcjet
ARCJET_API_KEY=

#Supabase
SUPABASE_PROJECT_PASSWORD=
DATABASE_URL_POSTGRES=

#Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
NEXT_PUBLIC_CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

```
---

## Architecture Overview

```bash
                                  🌍 Client (Browser)
                        │
         ┌──────────────┼──────────────────┐
         │              │                  │
         ▼              ▼                  ▼
   Upload Video   Upload Thumbnail     View Video
     (FormData)      (FormData)         (HLS/URL)
         │              │                  │
         ▼              ▼                  │
 ┌────────────────┐ ┌────────────────┐     │
 │ Cloudinary API │ │ Cloudinary API │     │
 │ (video/upload) │ │ (image/upload) │     │
 └────────────────┘ └────────────────┘     │
         │              │                  │
         ▼              ▼                  │
    Secure URLs saved in ↓                 │
                 ┌─────────────────────────┘
                 │
         ┌───────▼────────┐
         │     API Layer  │
         │ (Next.js + SA) │
         └───────┬────────┘
                 │
          ┌──────▼──────┐
          │   Arcjet    │   ◄─ Bot detection, abuse filter
          └──────┬──────┘
                 │
      ┌──────────▼────────────────┐
      │   Drizzle ORM (type-safe) │
      └──────────┬────────────────┘
                 │
        ┌────────▼────────┐
        │   Supabase DB   │
        │ (PostgreSQL)    │
        └─────────────────┘

```
---

## 🔄 Key Architecture Changes

| Component            | Before                           | Now                                    |
|----------------------|----------------------------------|----------------------------------------|
| **Video Upload**     | Bunny CDN (HLS)                  | Cloudinary (via `/video/upload`)       |
| **Thumbnail Upload** | Bunny / Static or Xata           | Cloudinary (`/image/upload`)           |
| **Database**         | Xata + PostgreSQL (via Drizzle)  | Supabase PostgreSQL (via Drizzle ORM)  |
| **Bot Protection**   | Arcjet                           | Arcjet (unchanged)                     |
| **ORM**              | Drizzle                          | Drizzle (still used with Supabase)     |
