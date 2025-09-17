// src/stores/auth.store.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // --- STATE ---
  // Tenta carregar o usuário e o token do localStorage ao iniciar.
  // Se não houver nada, começa como null.
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);
  const token = ref(localStorage.getItem('token') || null);
  // Flag para o roteador saber quando a verificação inicial terminou.
  const isLoading = ref(true);

  // --- GETTERS ---
  // O usuário é considerado autenticado se tivermos os dados E o token.
  const isAuthenticated = computed(() => !!user.value && !!token.value);

  // --- ACTIONS ---
  
  /**
   * Chamado pelo roteador para verificar o estado inicial.
   * A lógica de carregar do localStorage já faz o principal.
   */
  async function init() {
    // Em um app real, você poderia adicionar uma chamada à API aqui
    // para validar o token, mas por enquanto, isso é suficiente.
    isLoading.value = false;
  }
  
  /**
   * Ação para realizar o login. Recebe os dados do backend.
   * @param {object} userData - Os dados do usuário.
   * @param {string} authToken - O token JWT.
   */
  function login(userData, authToken) {
    user.value = userData;
    token.value = authToken;
    
    // Salva no localStorage para que a sessão persista.
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
  }

  /**
   * Ação para realizar o logout.
   */
  function logout() {
    user.value = null;
    token.value = null;

    // Remove do localStorage para encerrar a sessão.
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    init,
    login,
    logout,
  }
})