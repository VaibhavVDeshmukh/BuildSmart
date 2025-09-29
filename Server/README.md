# 🧾 S2M Account Server

This is the Account Service for the Scan To Model (S2M) platform. It is a Node.js server built with **TypeScript**, **Express.js**, and uses **Prisma ORM** for PostgreSQL.

---

## 📦 Tech Stack

- **Node.js** + **Express.js**
- **TypeScript**
- **Prisma ORM** (PostgreSQL)
- **Keycloak openid-connect authentication**
- **Docker** (for production/deployment)

---

## ⚙️ Environment Variables

Create a `.env` file in the root Dir using .env.sample:

NODE_ENV =development
ACCOUNT_SERVICE_PORT=4220
ACCOUNT_SERVICE_DATABASE_URL="postgresql://postgres:root@localhost:5432/s2m_support?schema=public"
IAM_CLIENT_SECRET=rSKOilm02nQKDuypsPVFsGEnWuOXKCvw
KEYCLOAK_BASE_URL=http://localhost:8080
REALM=s2m-app
SUPPORT_APP_REALM=s2m_support_app
SUPPORT_APP_CLIENT_SECRET=RWMRelkAzV5MNfbfNGzLiPLPJxmpMwy8
MAILSERVER_URL=http://localhost:8444
INVITE_BASE_URL = http://localhost:5173/verifyemail
DOMAIN = *
ENABLE_SELF_SSL = false
SINGLE_USE_SECRET = 69cbb8d2ddafaf6a627ffbd6470d3c81b5b53afac7b45f391bc6d9b35949bc8f00f465af27126e94eb9035f83ba8fdcc4aa88b55d39d466b391a475eec965a93

---


## 🧑‍💻 Running in Development
1. Install dependencies
npm install
2. Generate Prisma Client
npx prisma generate
3. Run DB migrations
npx prisma migrate dev --name init
This will create the DB schema locally.

4. Start the server (dev mode with TS)
npm run dev
The server will run on http://localhost:4220.

---


## 🚀 Running in Production
1. Build the project
npm run build
This compiles TypeScript to JavaScript in the dist/ folder.

2. Start the server (prod)
npm prod
Make sure .env is configured correctly in production.

---


## 🐳 Docker (Optional)
To build and run in Docker:
docker build -t s2m-account-server .
docker run -p 4000:4000 --env-file .env s2m-account-server


---


## 🧪 Scripts
Script	Description
npm run dev         -->	  Start server in dev (ts-node)
npm run build	    -->   Compile TypeScript to JS
npm run prod	    -->   Run compiled code (prod)
npx prisma studio   -->	  Open Prisma GUI
npx prisma db push  -->   To create Table in Database
npx prisma seed     -->   To insert seed data in db 
npx prisma generate -->   To generate prisma schema



