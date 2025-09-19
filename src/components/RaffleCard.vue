<template>
  <div class="raffle-card">
    <img :src="raffle.imageUrl" :alt="raffle.name" class="raffle-image" />
    <div class="raffle-info">
      <h3 class="raffle-name">{{ raffle.name }}</h3>
      <div class="raffle-details">
        <p><strong>Sorteio:</strong> {{ formattedDate }}</p>
        <p><strong>Números:</strong> {{ raffle.total_numbers }}</p>
        <div :class="['status-badge', statusClass]">{{ formattedStatus }}</div>
      </div>
    </div>
    <div class="raffle-actions">
      <button @click="onEdit" class="btn btn-edit">Editar</button>
      <button @click="onDelete" class="btn btn-delete">Excluir</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Define as props que o componente espera receber do componente pai (RaffleList)
const props = defineProps({
  raffle: {
    type: Object,
    required: true,
  },
})

// Define os eventos que o componente pode emitir para o pai
const emit = defineEmits(['edit', 'delete'])

// Formata a data para um padrão mais legível (ex: 25/12/2025)
const formattedDate = computed(() => {
  return new Date(props.raffle.draw_date).toLocaleDateString('pt-BR')
})

// Calcula uma classe CSS dinâmica baseada no status da rifa para estilização
const statusClass = computed(() => {
  if (props.raffle.status === 'ativa')
    return 'inline-flex  rounded-sm bg-emerald-800 px-2 py-1 text-sm leading-4 font-semibold text-emerald-700'
  if (props.raffle.status === 'em_analise')
    return 'inline-flex rounded-sm bg-orange-500 px-2 py-1 text-sm leading-4 font-semibold text-orange-700'
  if (props.raffle.status === 'pausada')
    return 'inline-flex rounded-sm bg-purple-800 px-2 py-1 text-sm leading-4 font-semibold text-purple-700'
  if (props.raffle.status === 'soteada')
    return 'inline-flex rounded-sm bg-primary-800 px-2 py-1 text-sm leading-4 font-semibold text-primary-700'
  if (props.raffle.status === 'cancelada')
    return 'inline-flex rounded-sm bg-red-500 px-2 py-1 text-sm leading-4 font-semibold text-red-700'
  return 'Indefinido'
})

const formattedStatus = computed(() => {
  const status = props.raffle.status;
  if (status === 'ativa') return 'Ativa';
  if (status === 'em_analise') return 'Em Análise';
  if (status === 'pausada') return 'Pausada';
  if (status === 'sorteada') return 'Sorteada'; // Corrigido
  if (status === 'cancelada') return 'Cancelada';
  return 'Indefinido';
});

// Funções que emitem os eventos para o componente pai quando os botões são clicados
const onEdit = () => {
  emit('edit', props.raffle.id)
}

const onDelete = () => {
  emit('delete', props.raffle.id)
}
</script>

<style scoped>
.raffle-card {
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: transform 0.2s ease-in-out;
}

.raffle-card:hover {
  transform: translateY(-5px);
}

.raffle-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.raffle-info {
  padding: 16px;
}

.raffle-name {
  margin: 0 0 12px 0;
  font-size: 1.25rem;
}

.raffle-details p {
  margin: 4px 0;
  color: #555;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  color: #fff;
  margin-top: 10px;
}

.status-open {
  background-color: #28a745;
} /* Verde */
.status-closed {
  background-color: #dc3545;
} /* Vermelho */
.status-default {
  background-color: #6c757d;
} /* Cinza */

.raffle-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 0 16px 16px;
  margin-top: auto; /* Empurra os botões para o final */
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-edit {
  background-color: #ffc107; /* Amarelo */
  color: #212529;
}

.btn-delete {
  background-color: #dc3545; /* Vermelho */
  color: white;
}
</style>
