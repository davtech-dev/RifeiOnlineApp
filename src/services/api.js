// src/services/api.js

import axios from 'axios';

// 1. Cria uma nova instância do Axios com configuração personalizada
const api = axios.create({
  // 2. Define a URL base para todas as requisições feitas com esta instância
  //    O Vite substitui 'import.meta.env.VITE_API_BASE_URL' pelo valor do seu arquivo .env
  baseURL: import.meta.env.VITE_API_BASE_URL,

  // 3. (Opcional) Você também pode definir headers padrão aqui
  headers: {
    'Content-Type': 'application/json',
  }
});

// Futuramente, aqui será o lugar perfeito para adicionar "interceptors"
// para, por exemplo, anexar o token JWT a todas as requisições automaticamente.

// 4. Exporta a instância configurada
export default api;