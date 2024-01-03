FROM node:20.6.1
LABEL description="jprobanheiro"
WORKDIR /jprobanheiro
COPY . .
RUN yarn
CMD ["yarn", "run", "ws"]