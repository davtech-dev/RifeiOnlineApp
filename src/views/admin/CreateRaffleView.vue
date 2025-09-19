<template>
  <div class="create-raffle-container">
    <h2>Cadastrar Nova Rifa</h2>
    <RaffleForm
      v-model="newRaffle"
      :is-submitting="isSubmitting"
      button-text="Criar Rifa"
      @submit="handleCreateRaffle"
    />
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import axios from 'axios';
import RaffleForm from '@/components/forms/RaffleForm.vue';

const router = useRouter();
const isSubmitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const newRaffle = ref({
  title: '',
  description: '',
  rules: '',
  draw_date: '',
  status: 'ativa',
  total_numbers: 100,
  price_per_number: 5.0,
  awards: [{ placement: 1, description: '' }],
  images: [],
});

// Lida com o upload de arquivos para Cloudinary
async function uploadFiles(files) {
  if (!files || files.length === 0) return [];
  
  const uploadPromises = files.map(async (file) => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'rifas';
    const paramsToSign = { timestamp, folder };
    const sigResponse = await api.post('/api/upload/generate-signature', paramsToSign);
    const { signature } = sigResponse.data;
    const formData = new FormData();
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('signature', signature);
    formData.append('timestamp', timestamp);
    formData.append('folder', folder);
    const uploadResult = await axios.post(uploadUrl, formData);
    return { url: uploadResult.data.secure_url, is_primary: false };
  });
  
  return await Promise.all(uploadPromises);
}

const handleCreateRaffle = async ({ formData, newFiles }) => {
  isSubmitting.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  try {
    const uploadedImageUrls = await uploadFiles(newFiles);
    if (uploadedImageUrls.length > 0) {
      uploadedImageUrls[0].is_primary = true;
    }

    const finalPayload = { ...formData, images: uploadedImageUrls };
    const response = await api.post('/api/raffles', finalPayload);
    
    successMessage.value = `Rifa criada com sucesso! ID: ${response.data.raffleId}`;
    setTimeout(() => {
      router.push({ name: 'admin-rifas-listar' });
    }, 2000);
  } catch (error) {
    errorMessage.value = 'Falha ao criar a rifa. Verifique os campos e tente novamente.';
    console.error(error.response ? error.response.data : error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.create-raffle-container { max-width: 800px; margin: auto; padding: 2rem; }
.error-message { color: #c53030; margin-top: 1rem; }
.success-message { color: #2f855a; margin-top: 1rem; }
</style>