import dotenv from 'dotenv'

dotenv.config()

export default [
  {
    context: [
      "/api",
      "/apis"
    ],
    target: process.env.VITE_KUBERNETES_API_URL,
    secure: false,
  },
]
