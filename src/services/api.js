import axios from 'axios';
import { useAuthStore } from '@/stores/auth.store';

// Cria a instância do Axios com a URL base do nosso .env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// --- INTERCEPTOR DE REQUISIÇÃO ---
// Esta função será executada ANTES de cada requisição ser enviada.
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.token;

    // Se o token existir, anexa ao cabeçalho Authorization
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Faz algo com o erro da requisição
    return Promise.reject(error);
  }
);

export default api;