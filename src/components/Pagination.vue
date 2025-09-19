<template>
  <nav v-if="totalPages > 1" class="pagination-container" aria-label="Pagination">
    <ul class="pagination-list">
      <li>
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="page-item"
        >
          Anterior
        </button>
      </li>

      <li v-for="page in totalPages" :key="page">
        <button @click="changePage(page)" :class="['page-item', { active: page === currentPage }]">
          {{ page }}
        </button>
      </li>

      <li>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="page-item"
        >
          Próximo
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
})

// Usando o padrão do v-model para componentes
const emit = defineEmits(['update:currentPage'])

function changePage(page) {
  if (page < 1 || page > props.totalPages) return
  emit('update:currentPage', page)
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}
.pagination-list {
  display: flex;
  list-style-type: none;
  padding: 0;
  gap: 0.5rem;
}
.page-item {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  font-weight: 500;
}
.page-item:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  color: #aaa;
}
.page-item.active {
  background-color: #2c5282;
  color: white;
  border-color: #2c5282;
}
</style>
