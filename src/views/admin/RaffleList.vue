<template>
  <div class="raffle-list-container">
    <h1>Minhas Rifas</h1>
    <div v-if="loading" class="loading-message">Carregando rifas...</div>
    <div v-if="error" class="error-message">{{ error }}</div>

    <div v-if="!loading && !error" class="raffle-grid">
      <RaffleCard
        v-for="raffle in raffles"
        :key="raffle.id"
        :raffle="raffle"
        @edit="handleEditRaffle"
        @delete="handleDeleteRaffle"
      />
    </div>
  </div>
</template>

<script setup>
import RaffleCard from '@/components/RaffleCard.vue'
import api from '@/services/api' // Seu cliente Axios/Fetch configurado
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router' // Para navegação

const router = useRouter()
const raffles = ref([])
const loading = ref(true)
const error = ref(null)

// Função para buscar os dados da API
const fetchRaffles = async () => {
  try {
    // Exemplo de chamada de API. Substitua pelo seu endpoint real.
    const response = await api.get('/api/raffles')
    raffles.value = response.data
  } catch (err) {
    console.error('Erro ao buscar rifas:', err)
    error.value = 'Não foi possível carregar as rifas. Tente novamente mais tarde.'
  } finally {
    loading.value = false
  }
}

// Hook do ciclo de vida: busca os dados quando o componente é montado
onMounted(fetchRaffles)

// Função chamada quando o evento 'edit' é emitido pelo RaffleCard
const handleEditRaffle = (raffleId) => {
  console.log('Editar rifa com ID:', raffleId)
  // Navega para a página de edição, passando o ID da rifa na URL
  router.push(`/rifas/editar/${raffleId}`)
}

// Função chamada quando o evento 'delete' é emitido pelo RaffleCard
const handleDeleteRaffle = async (raffleId) => {
  // Confirmação do usuário é uma ótima prática de UX
  if (!confirm('Você tem certeza que deseja excluir esta rifa? Esta ação não pode ser desfeita.')) {
    return
  }

  try {
    // 1. Chamar a API para deletar a rifa no backend
    await api.delete(`/raffles/${raffleId}`)

    // 2. Atualizar o estado local para remover a rifa da UI sem precisar recarregar a página
    raffles.value = raffles.value.filter((raffle) => raffle.id !== raffleId)

    // Opcional: Mostrar uma notificação de sucesso (Toast/Snackbar)
    alert('Rifa excluída com sucesso!')
  } catch (err) {
    console.error('Erro ao excluir rifa:', err)
    // Opcional: Mostrar notificação de erro
    alert('Erro ao excluir a rifa. Tente novamente.')
  }
}
</script>

<style scoped>
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
