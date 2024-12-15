FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
COPY apps/frontend/package*.json ./apps/frontend/
RUN npm install --legacy-peer-deps

FROM node:20-alpine AS build
WORKDIR /app
ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./
COPY apps/frontend ./apps/frontend
COPY turbo.json ./
WORKDIR /app/apps/frontend
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/apps/frontend/.next ./.next
COPY --from=build /app/apps/frontend/public ./public
COPY --from=build /app/apps/frontend/package.json ./package.json
COPY --from=build /app/apps/frontend/next.config.ts ./next.config.ts
WORKDIR /app/apps/frontend
EXPOSE 3000
CMD ["npm", "start"]

