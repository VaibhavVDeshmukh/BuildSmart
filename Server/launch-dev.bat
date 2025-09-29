call npx prisma db push --force-reset
call npx prisma db seed
call npx prisma generate
call npm run dev