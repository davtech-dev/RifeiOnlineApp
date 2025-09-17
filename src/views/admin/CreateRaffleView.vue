<template>
  <div class="create-raffle-container">
    <h2>Cadastrar Nova Rifa</h2>
    <form @submit.prevent="handleSubmit" class="raffle-form">
      <div class="form-group">
        <label for="title">Título da Rifa</label>
        <input type="text" id="title" v-model="raffle.title" required />
      </div>

      <div class="form-group">
        <label>Descrição / Regras</label>
        <QuillEditor
          theme="snow"
          toolbar="essential"
          v-model:content="raffle.description"
          contentType="html"
          placeholder="Descreva os detalhes e as regras da sua rifa aqui..."
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="total_numbers">Total de Números</label>
          <input type="number" id="total_numbers" v-model.number="raffle.total_numbers" required />
        </div>
        <div class="form-group">
          <label for="price">Preço por Número (R$)</label>
          <input
            type="number"
            step="0.01"
            id="price"
            v-model.number="raffle.price_per_number"
            required
          />
        </div>
      </div>

      <fieldset>
        <legend>Prêmios</legend>
        <div v-for="(award, index) in raffle.awards" :key="index" class="dynamic-item">
          <input type="number" v-model.number="award.placement" placeholder="Lugar (ex: 1)" />
          <input type="text" v-model="award.description" placeholder="Descrição do prêmio" />
          <button type="button" @click="removeAward(index)" class="remove-btn">×</button>
        </div>
        <button type="button" @click="addAward" class="add-btn">Adicionar Prêmio</button>
      </fieldset>

      <fieldset>
        <legend>Imagens</legend>
        <div class="form-group">
          <label for="images-upload">Selecione as Imagens</label>
          <input
            type="file"
            id="images-upload"
            @change="handleFileSelect"
            multiple
            accept="image/png, image/jpeg, image/webp"
          />
        </div>
        <div v-if="selectedFiles.length > 0" class="image-preview-container">
          <div v-for="(file, index) in selectedFiles" :key="index" class="image-preview">
            <img :src="getPreviewUrl(file)" :alt="file.name" />
            <span>{{ file.name }}</span>
          </div>
        </div>
      </fieldset>

      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

      <button type="submit" :disabled="isSubmitting" class="submit-btn">
        {{ isSubmitting ? 'Salvando...' : 'Salvar Rifa' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import api from '@/services/api' // Nossa instância Axios configurada
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css' // Importa o tema do editor
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'; // Importa o axios global para o upload direto

const router = useRouter()

// Estado do formulário
const raffle = ref({
  title: '',
  description: '',
  total_numbers: 100,
  price_per_number: 5.0,
  images: [{ url: '', is_primary: true }],
  awards: [{ placement: 1, description: '' }],
})

const selectedFiles = ref([]);

// Estado de controle da UI
const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// NOVO: Função para lidar com a seleção de arquivos
function handleFileSelect(event) {
  selectedFiles.value = Array.from(event.target.files);
}
// NOVO: Função para gerar URLs de pré-visualização
function getPreviewUrl(file) {
    return URL.createObjectURL(file);
}
// Funções para adicionar/remover campos dinâmicos
const addAward = () => {
  raffle.value.awards.push({ placement: raffle.value.awards.length + 1, description: '' })
}
const removeAward = (index) => {
  raffle.value.awards.splice(index, 1)
}

// Função de envio do formulário
async function handleSubmit() {
  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // 1. Fazer o upload das imagens primeiro
    const uploadedImageUrls = [];
    if (selectedFiles.value.length > 0) {
      // Pega a assinatura do nosso backend
      const sigResponse = await api.get('/api/upload/generate-signature');
      const { timestamp, signature } = sigResponse.data;

      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const uploadPromises = selectedFiles.value.map(file => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        // Opcional: pasta no Cloudinary
        formData.append('folder', 'rifas'); 

        return axios.post(uploadUrl, formData);
      });

      const uploadResults = await Promise.all(uploadPromises);
      uploadResults.forEach(result => {
        uploadedImageUrls.push({ url: result.data.secure_url, is_primary: false });
      });
    }

    // Define a primeira imagem como principal, se houver
    if (uploadedImageUrls.length > 0) {
        uploadedImageUrls[0].is_primary = true;
    }
    
    // 2. Monta o payload final com as URLs das imagens
    const finalPayload = {
      ...raffle.value,
      images: uploadedImageUrls,
    };

    // 3. Envia o payload final para a API
    const response = await api.post('/api/raffles', raffle.value)

    successMessage.value = `Rifa criada com sucesso! ID: ${response.data.raffleId}`

    // Limpa o formulário e redireciona após um tempo
    setTimeout(() => {
      router.push({ name: 'admin-rifas' }) // Redireciona para a lista de rifas
    }, 2000)
  } catch (error) {
    errorMessage.value = 'Falha ao criar a rifa. Verifique os campos e tente novamente.'
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Estilos para o formulário */
.create-raffle-container {
  max-width: 800px;
  margin: auto;
  padding: 2rem;
}
.raffle-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.form-group,
fieldset {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
input[type='text'],
input[type='number'] {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.dynamic-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.dynamic-item input[type='text'] {
  flex-grow: 1;
}
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.add-btn,
.remove-btn,
.submit-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.add-btn {
  background-color: #e0e0e0;
}
.remove-btn {
  background-color: #fdd8d8;
  color: #c53030;
}
.submit-btn {
  background-color: #2c5282;
  color: white;
  padding: 0.75rem;
  font-size: 1rem;
}
.submit-btn:disabled {
  background-color: #a0aec0;
}
.error-message {
  color: #c53030;
}
.success-message {
  color: #2f855a;
}
/* Estilo para o container do Quill Editor */
:deep(.ql-editor) {
  min-height: 150px;
}
</style>
