import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost/sales/public/api/mobile',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Auto-attach token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('sales_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto-handle 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sales_token')
      localStorage.removeItem('sales_user')
      window.location.href = '/#/login'
    }
    return Promise.reject(err)
  }
)

export default ({ app }) => {
  app.config.globalProperties.$api = api
}

export { api }
