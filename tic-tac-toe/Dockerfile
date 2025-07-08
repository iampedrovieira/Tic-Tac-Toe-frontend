FROM node:current-alpine3.15

WORKDIR /home/app

RUN cd /home/app

COPY . /home/app/

RUN npm install

RUN npm run build

CMD [ "npm", "run","start" ]

EXPOSE 3000