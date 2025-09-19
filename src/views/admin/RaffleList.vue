<template>
  <div class="raffle-list-container">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-4xl font-black text-black dark:text-white">Minhas Rifas</h2>

      <RouterLink
        class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-700 px-3 py-2 text-sm font-semibold leading-5 text-white hover:border-gray-600 hover:bg-gray-600 focus:ring-3 focus:ring-gray-400/50 active:border-gray-700 active:bg-gray-700 dark:focus:ring-gray-400/90"
        :to="{ name: 'admin-rifas-criar' }"
      >
        Nova Rifa
      </RouterLink>
    </div>
    <div v-if="loading" class="loading-message flex justify-center items-center py-20">
      <svg
        width="100"
        height="101"
        viewBox="0 0 20 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="animate-spin"
      >
        <circle cx="10" cy="10.5" r="8.5" stroke="#E5E7EB" stroke-width="3" />
        <mask id="path-2-inside-1_2527_20905" fill="white">
          <path
            d="M18.5172 10.5C19.3361 10.5 20.0113 9.83252 19.8903 9.02257C19.6474 7.39692 19.0062 5.84812 18.014 4.51868C16.7246 2.79109 14.9114 1.52642 12.8448 0.913166C10.7781 0.299916 8.5686 0.370921 6.54558 1.1156C4.9888 1.68865 3.60659 2.63704 2.51635 3.86711C1.97316 4.47997 2.17495 5.40767 2.86134 5.85436C3.54773 6.30104 4.45707 6.09214 5.03749 5.51442C5.75143 4.8038 6.61392 4.2506 7.57003 3.89866C8.9931 3.37482 10.5473 3.32488 12.0011 3.75626C13.4549 4.18764 14.7303 5.07726 15.6373 6.29251C16.2467 7.109 16.6679 8.0431 16.8787 9.02811C17.05 9.82892 17.6983 10.5 18.5172 10.5Z"
          />
        </mask>
        <path
          d="M18.5172 10.5C19.3361 10.5 20.0113 9.83252 19.8903 9.02257C19.6474 7.39692 19.0062 5.84812 18.014 4.51868C16.7246 2.79109 14.9114 1.52642 12.8448 0.913166C10.7781 0.299916 8.5686 0.370921 6.54558 1.1156C4.9888 1.68865 3.60659 2.63704 2.51635 3.86711C1.97316 4.47997 2.17495 5.40767 2.86134 5.85436C3.54773 6.30104 4.45707 6.09214 5.03749 5.51442C5.75143 4.8038 6.61392 4.2506 7.57003 3.89866C8.9931 3.37482 10.5473 3.32488 12.0011 3.75626C13.4549 4.18764 14.7303 5.07726 15.6373 6.29251C16.2467 7.109 16.6679 8.0431 16.8787 9.02811C17.05 9.82892 17.6983 10.5 18.5172 10.5Z"
          stroke="#00783A"
          stroke-width="8"
          mask="url(#path-2-inside-1_2527_20905)"
        />
      </svg>
    </div>
    <div v-if="error" class="error-message">{{ error }}</div>

    <div v-if="!loading && !error">
      <div class="raffle-grid">
        <RaffleCard
          v-for="raffle in raffles"
          :key="raffle.id"
          :raffle="raffle"
          @edit="handleEditRaffle"
          @delete="handleDeleteRaffle"
        />
      </div>

      <Pagination v-model:currentPage="currentPage" :totalPages="paginationInfo.totalPages" />
    </div>
  </div>
</template>

<script setup>
import Pagination from '@/components/Pagination.vue' // ** NOVO: Importa o componente **
import RaffleCard from '@/components/RaffleCard.vue'
import api from '@/services/api'
import { ref, watch } from 'vue' // ** NOVO: Importa o watch **
import { useRouter } from 'vue-router'

const router = useRouter()

// ** NOVO: Estado para paginação **
const raffles = ref([])
const currentPage = ref(1)
const paginationInfo = ref({
  totalPages: 1,
  totalItems: 0,
})
const itemsPerPage = 12 // Definimos o limite aqui também

const loading = ref(true)
const error = ref(null)

// ** ATUALIZADO: Função para buscar os dados da API com paginação **
const fetchRaffles = async (page) => {
  loading.value = true
  try {
    const response = await api.get('/api/raffles', {
      params: {
        page: page,
        limit: itemsPerPage,
      },
    })
    // A resposta agora é um objeto
    raffles.value = response.data.data
    paginationInfo.value = response.data.pagination
  } catch (err) {
    console.error('Erro ao buscar rifas:', err)
    error.value = 'Não foi possível carregar as rifas. Tente novamente mais tarde.'
  } finally {
    loading.value = false
  }
}

// ** NOVO: Observa mudanças na página atual e busca os novos dados **
watch(currentPage, (newPage) => {
  fetchRaffles(newPage)
})

// ** ATUALIZADO: Busca a primeira página quando o componente é montado **
fetchRaffles(currentPage.value)

// Funções handleEditRaffle e handleDeleteRaffle permanecem as mesmas
const handleEditRaffle = (raffleId) => {
  router.push({ name: 'admin-rifas-editar', params: { id: raffleId } }) // Rota nomeada é mais segura
}

const handleDeleteRaffle = async (raffleId) => {
  if (!confirm('Você tem certeza que deseja excluir esta rifa? Esta ação não pode ser desfeita.')) {
    return
  }
  try {
    await api.delete(`/api/raffles/${raffleId}`)
    // Recarrega a página atual para refletir a exclusão
    fetchRaffles(currentPage.value)
    alert('Rifa excluída com sucesso!')
  } catch (err) {
    console.error('Erro ao excluir rifa:', err)
    alert('Erro ao excluir a rifa. Tente novamente.')
  }
}
</script>

<style scoped>
/* Estilos existentes permanecem os mesmos */
.raffle-list-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.raffle-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
.loading-message,
.error-message {
  text-align: center;
  font-size: 1.2rem;
  padding: 40px;
}
.error-message {
  color: #dc3545;
}
</style>
