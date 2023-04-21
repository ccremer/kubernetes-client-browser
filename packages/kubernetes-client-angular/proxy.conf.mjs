import dotenv from 'dotenv'

dotenv.config()

console.log("proxy url", process.env.VITE_KUBERNETES_API_URL)
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
