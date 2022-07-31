FROM node:14.19.0
WORKDIR /app
COPY package.json .
# RUN npm install

ARG NODE_ENV
RUN if ["$NODE_ENV" = "dev"]; \
        then npm install; \
        else npm install --only=prod; \
        fi
COPY . .
EXPOSE 4000
# CMD ["npm","run","dev"]
CMD ["node","server"]



#sudo systemctl restart docker.socket docker.service

#sudo chmod 666 /var/run/docker.sock