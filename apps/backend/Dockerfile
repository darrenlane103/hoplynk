FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
RUN npm install --legacy-peer-deps

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./
COPY apps/backend ./apps/backend
COPY turbo.json ./
WORKDIR /app/apps/backend
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/apps/backend/dist ./dist
COPY --from=build /app/apps/backend/package.json ./package.json
COPY --from=build /app/apps/backend/data ./data
RUN chmod -R 755 /app/data && \
    chmod 644 /app/data/network_data.json && \
    chown -R node:node /app/data
USER node
EXPOSE 3001
CMD ["npm", "start"]

