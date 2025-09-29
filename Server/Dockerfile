FROM node:22 

WORKDIR /app

RUN apt-get update && apt-get install -y dos2unix

COPY package*.json ./

RUN npm install 

COPY . .

COPY entrypoint.sh ./

RUN dos2unix /app/entrypoint.sh

RUN chmod +x entrypoint.sh

RUN npx prisma generate

RUN npm run build

ENTRYPOINT ["/app/entrypoint.sh"]

CMD ["npm","run","prod"]
