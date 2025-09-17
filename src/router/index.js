import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

// Importação dos módulos de rotas
import webRoutes from './web'
import authRoutes from './auth'
import adminRoutes from './admin'

// Componente para a página 404
import NotFoundView from '@/views/errors/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...webRoutes,
    ...authRoutes,
    ...adminRoutes,
    // Rota "catch-all" para páginas não encontradas
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFoundView,
    },
  ],
})

// Guarda de Navegação Global para proteger rotas
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Espera a store de autenticação verificar se o usuário está logado
  if (authStore.isLoading) {
    await authStore.init()
  }

  // Verifica se a rota destino requer autenticação
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  // Se a rota exige login e o usuário NÃO está logado, redireciona para o login
  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  }
  // Se o usuário JÁ está logado e tenta acessar a página de login, redireciona para o dashboard
  else if (to.name === 'login' && authStore.isAuthenticated) {
    next({ name: 'admin-dashboard' })
  }
  // Em todos os outros casos, permite a navegação
  else {
    next()
  }
})

export default router