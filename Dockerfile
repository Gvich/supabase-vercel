FROM node:lts as dependencies
WORKDIR /supabase-nextjs
COPY package.json ./
RUN npm install --frozen-lockfile

FROM node:lts as builder
WORKDIR /supabase-nextjs
COPY . .
COPY --from=dependencies /supabase-nextjs/node_modules ./node_modules
RUN npm run build

FROM node:lts as runner
WORKDIR /supabase-nextjs
ENV NODE_ENV production
# If you are using a custom next.config.js file, uncomment this line.
# COPY --from=builder /my-project/next.config.js ./
COPY --from=builder /supabase-nextjs/public ./public
COPY --from=builder /supabase-nextjs/.next ./.next
COPY --from=builder /supabase-nextjs/node_modules ./node_modules
COPY --from=builder /supabase-nextjs/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]