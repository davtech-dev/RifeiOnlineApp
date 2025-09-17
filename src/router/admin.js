// Layouts e Views do Admin
import AdminLayout from '@/layouts/AdminLayout.vue'
import CreateRaffleView from '@/views/admin/CreateRaffleView.vue'
import DashboardView from '@/views/admin/DashboardView.vue'
import ManageRafflesView from '@/views/admin/ManageRafflesView.vue'
import RaffleDetailsView from '@/views/admin/RaffleDetailsView.vue'
import ProfileView from '@/views/admin/UserProfileForm.vue'

const adminRoutes = [
  {
    path: '/admin',
    component: AdminLayout,
    // A proteção é aplicada aqui, no layout pai.
    // Todas as rotas filhas (children) herdarão essa verificação.
    meta: { requiresAuth: true },
    children: [
      {
        // Redireciona /admin para o dashboard
        path: '',
        redirect: { name: 'admin-dashboard' },
      },
      {
        // Rota do dashboard -> /admin/dashboard
        path: 'dashboard',
        name: 'admin-dashboard',
        component: DashboardView,
      },
      {
        // Rota de gerenciamento de rifas -> /admin/rifas
        path: 'rifas',
        name: 'admin-rifas',
        component: ManageRafflesView,
      },
      {
        // Rota para o formulário de criação -> /admin/rifas/criar
        path: 'rifas/criar',
        name: 'admin-rifas-criar',
        component: CreateRaffleView,
      },
      {
        // Rota para detalhes de uma rifa -> /admin/rifas/:id
        path: 'rifas/:id',
        name: 'admin-rifas-detalhes',
        component: RaffleDetailsView,
      },
      {
        // Rota de perfil do usuário -> /admin/profile
        path: 'profile',
        name: 'admin-profile',
        component: ProfileView,
      },
    ],
  },
]

export default adminRoutes