import dotenv from 'dotenv'

dotenv.config()

export default [
  {
    context: [
      "/api",
      "/apis"
    ],
    target: process.env.ANGULAR_KUBERNETES_API_URL,
    secure: false,
  },
]
