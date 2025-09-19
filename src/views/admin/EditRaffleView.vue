<template>
  <div class="edit-raffle-container">
    <h2>Editar Rifa</h2>
    <div v-if="loading" class="loading-spinner">Carregando...</div>
    <RaffleForm
      v-if="raffleToEdit"
      v-model="raffleToEdit"
      :is-submitting="isSubmitting"
      button-text="Salvar Alterações"
      @submit="handleUpdateRaffle"
      @delete-image="handleDeleteImage"
    />
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
  </div>
</template>

<script setup>
import RaffleForm from '@/components/forms/RaffleForm.vue'
import api from '@/services/api'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isSubmitting = ref(false)
const loading = ref(true)
const errorMessage = ref('')
const successMessage = ref('')
const raffleToEdit = ref(null)

// Busca os dados da rifa ao carregar a página
onMounted(async () => {
  try {
    const raffleId = route.params.id
    const response = await api.get(`/api/raffles/${raffleId}`)
    // Garante que a data esteja no formato YYYY-MM-DD para o input
    if (response.data.draw_date) {
      response.data.draw_date = response.data.draw_date.split('T')[0]
    }
    raffleToEdit.value = response.data
  } catch (error) {
    errorMessage.value = 'Não foi possível carregar os dados da rifa.'
  } finally {
    loading.value = false
  }
})

// Função de upload (reutilizada da criação)
async function uploadFiles(files) {
  if (!files || files.length === 0) return []
  // ... (copie a função uploadFiles completa da CreateRaffleView.vue)
  const uploadPromises = files.map(async (file) => {
    const timestamp = Math.round(new Date().getTime() / 1000)
    const folder = 'rifas'
    const paramsToSign = { timestamp, folder }
    const sigResponse = await api.post('/api/upload/generate-signature', paramsToSign)
    const { signature } = sigResponse.data
    const formData = new FormData()
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    formData.append('file', file)
    formData.append('api_key', apiKey)
    formData.append('signature', signature)
    formData.append('timestamp', timestamp)
    formData.append('folder', folder)
    const uploadResult = await axios.post(uploadUrl, formData)
    return { url: uploadResult.data.secure_url, is_primary: false }
  })
  return await Promise.all(uploadPromises)
}

const handleUpdateRaffle = async ({ formData, newFiles }) => {
  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    const raffleId = route.params.id
    // 1. Faz upload de novas imagens, se houver
    const newImageUrls = await uploadFiles(newFiles)

    // 2. Combina imagens existentes com as novas
    const allImages = [...(formData.images || []), ...newImageUrls]

    // 3. Garante que a primeira imagem seja a primária
    if (allImages.length > 0) {
      allImages.forEach((img, index) => {
        img.is_primary = index === 0
      })
    }

    const finalPayload = { ...formData, images: allImages }
    await api.put(`/api/raffles/${raffleId}`, finalPayload)

    successMessage.value = 'Rifa atualizada com sucesso!'
    setTimeout(() => router.push({ name: 'admin-rifas-listar' }), 2000)
  } catch (error) {
    errorMessage.value = 'Falha ao salvar as alterações.'
    console.error(error.response ? error.response.data : error)
  } finally {
    isSubmitting.value = false
  }
}

const handleDeleteImage = async (imageToDelete) => {
  try {
    // ** IMPORTANTE: Você precisará criar este endpoint no seu backend! **
    // Ele deve receber a URL, extrair o public_id e deletar de Cloudinary e do DB.
    await api.post('/api/upload/delete-image', { imageUrl: imageToDelete.url })

    // Remove a imagem da UI instantaneamente para feedback do usuário
    const index = raffleToEdit.value.images.findIndex((img) => img.url === imageToDelete.url)
    if (index > -1) {
      raffleToEdit.value.images.splice(index, 1)
    }
    alert('Imagem excluída com sucesso.')
  } catch (error) {
    alert('Erro ao excluir a imagem.')
    console.error(error)
  }
}
</script>

<style scoped>
.edit-raffle-container {
  max-width: 800px;
  margin: auto;
  padding: 2rem;
}
.error-message {
  color: #c53030;
  margin-top: 1rem;
}
.success-message {
  color: #2f855a;
  margin-top: 1rem;
}
.loading-spinner {
  text-align: center;
  padding: 2rem;
}
</style>
