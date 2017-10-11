FROM node:boron
ADD package.json package.json
RUN npm install
ADD . .
RUN npm run build

EXPOSE 8090
CMD [ "npm", "start" ]
