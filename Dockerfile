FROM node:21

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

ENV PORT=3000
ENV NODE_ENV=prod
ENV MODEL_URL="https://storage.googleapis.com/mlgc-bucket-01/model.json"
ENV PORT_APP=3000
# ENV FIRESTORE_KEY=./firestore-serviceaccount.json

EXPOSE 3000

CMD ["npm", "start"]