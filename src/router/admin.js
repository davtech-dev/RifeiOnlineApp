// Layouts e Views do Admin
import AdminLayout from '@/layouts/AdminLayout.vue'
import CreateRaffleView from '@/views/admin/CreateRaffleView.vue'
import DashboardView from '@/views/admin/DashboardView.vue'
import RaffleList from '@/views/admin/RaffleList.vue'
// Assumindo que você terá uma view para edição, conforme planejado
import EditRaffleView from '@/views/admin/EditRaffleView.vue'
import RaffleDetailsView from '@/views/admin/RaffleDetailsView.vue'
import ProfileView from '@/views/admin/UserProfileForm.vue'

// O import abaixo não estava sendo usado, mantive caso seja para uso futuro.
// import ManageRafflesView from '@/views/admin/ManageRafflesView.vue'

const adminRoutes = [
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: { name: 'admin-dashboard' },
      },
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: DashboardView,
      },
      // --- SEÇÃO DE RIFAS CORRIGIDA E REORDENADA ---
      {
        // Rota para a listagem -> /admin/rifas/listar
        path: 'rifas/listar',
        name: 'admin-rifas-listar',
        component: RaffleList,
      },
      {
        // Rota para o formulário de criação -> /admin/rifas/criar
        // *Deve vir antes de qualquer rota com :id*
        path: 'rifas/criar',
        name: 'admin-rifas-criar',
        component: CreateRaffleView,
      },
      {
        // NOVO: Rota para edição de uma rifa -> /admin/rifas/editar/:id
        // Essencial para o botão "Editar" da nossa lista.
        path: 'rifas/editar/:id',
        name: 'admin-rifas-editar',
        component: EditRaffleView, // Você precisará criar este componente de view
        props: true, // Passa o :id da URL como prop para o componente
      },
      {
        // Rota para detalhes de uma rifa -> /admin/rifas/:id
        // *Esta é a rota mais genérica, por isso deve ser a ÚLTIMA*
        // Se ela vier antes de '/criar', o router pensará que 'criar' é um ID.
        path: 'rifas/:id',
        name: 'admin-rifas-detalhes',
        component: RaffleDetailsView,
        props: true,
      },
      // --- FIM DA SEÇÃO DE RIFAS ---
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