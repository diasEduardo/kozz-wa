FROM node:20

WORKDIR /app

COPY . .

#instala o chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update
RUN apt --fix-broken install
RUN apt-get install google-chrome-stable -y
RUN apt-get install -y --no-install-recommends ffmpeg

RUN yarn install

COPY ./node_modules/kozz-types/dist/Common/index.d.ts ./node_modules/kozz-types/dist/Common/index.d.ts

CMD yarn start