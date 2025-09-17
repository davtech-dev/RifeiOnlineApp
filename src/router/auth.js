// Layouts e Views de Autenticação
import AuthLayout from '@/layouts/AuthLayout.vue'
import LoginView from '@/views/admin/LoginView.vue'

const authRoutes = [
  {
    path: '/login',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'login',
        component: LoginView,
      },
      // Futuramente, você pode adicionar outras rotas aqui, como /register
      // {
      //   path: '/register',
      //   name: 'register',
      //   component: () => import('@/views/auth/RegisterView.vue')
      // }
    ],
  },
]

export default authRoutes