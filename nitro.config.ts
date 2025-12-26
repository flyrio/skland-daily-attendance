import process from 'node:process'
import { defineConfig } from 'nitro'

export default defineConfig({
  serverDir: './',
  experimental: {
    tasks: true,
  },
  scheduledTasks: {
    '30 0/2 * * *': ['attendance'],
  },
  runtimeConfig: {
    app: {
      SKLAND_TOKEN: process.env.SKLAND_TOKEN?.split(',') ?? [],
      NOTIFICATION_URLS: process.env.NOTIFICATION_URLS?.split(',') ?? [],
      MAX_RETRIES: Number(process.env.MAX_RETRIES ?? '3'),
    }
  },
})
