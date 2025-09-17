// Layouts e Views Públicas
import PublicLayout from '@/layouts/PublicLayout.vue'
import HomeView from '@/views/HomeView.vue'
import RaffleDetailsView from '@/views/web/RaffleDetailsView.vue'

const webRoutes = [
  {
    path: '/',
    component: PublicLayout,
    children: [
      {
        path: '', // Rota raiz /
        name: 'home',
        component: HomeView,
      },
      {
        path: 'rifa/:id', // Rota para detalhes da rifa, ex: /rifa/123
        name: 'raffle-details',
        component: RaffleDetailsView,
      },
    ],
  },
]

export default webRoutes