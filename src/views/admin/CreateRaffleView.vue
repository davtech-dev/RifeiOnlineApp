<template>
  <div class="create-raffle-container">
    <h2>Cadastrar Nova Rifa</h2>
    <form @submit.prevent="handleSubmit" class="raffle-form">
      <div class="form-group">
        <label for="title">Título da Rifa</label>
        <input type="text" id="title" v-model="raffle.title" required />
      </div>

      <div class="form-group">
        <label>Descrição</label>
        <QuillEditor
          theme="snow"
          toolbar="essential"
          v-model:content="raffle.description"
          contentType="html"
          placeholder="Descreva os detalhes da sua rifa aqui..."
        />
      </div>

      <div class="form-group">
        <label>Regras</label>
        <QuillEditor
          theme="snow"
          toolbar="essential"
          v-model:content="raffle.rules"
          contentType="html"
          placeholder="Informe as regras do sorteio, termos e condições..."
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="draw_date">Data do Sorteio</label>
          <input type="date" id="draw_date" v-model="raffle.draw_date" required />
        </div>

        <div class="form-group">
          <label for="status">Status</label>
          <select id="status" v-model="raffle.status" required>
            <option value="ativa">Ativa</option>
            <option value="em_analise">Em Análise</option>
            <option value="pausada">Pausada</option>
            <option value="soteada">Cancelada</option>
            <option value="cancelada">Sorteada</option>
          </select>
        </div>
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
import api from '@/services/api'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ** ATUALIZADO: Estado do formulário com os novos campos **
const raffle = ref({
  title: '',
  description: '',
  rules: '', // Novo campo para regras
  draw_date: '', // Novo campo para data
  status: 'ativa', // Novo campo para status, com valor padrão
  total_numbers: 100,
  price_per_number: 5.0,
  images: [{ url: '', is_primary: true }],
  awards: [{ placement: 1, description: '' }],
})

const selectedFiles = ref([])
const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

function handleFileSelect(event) {
  selectedFiles.value = Array.from(event.target.files)
}
function getPreviewUrl(file) {
  return URL.createObjectURL(file)
}
const addAward = () => {
  raffle.value.awards.push({ placement: raffle.value.awards.length + 1, description: '' })
}
const removeAward = (index) => {
  raffle.value.awards.splice(index, 1)
}

async function handleSubmit() {
  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    const uploadedImageUrls = []
    if (selectedFiles.value.length > 0) {
      const uploadPromises = selectedFiles.value.map(async (file) => {
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
        for (const key in paramsToSign) {
          formData.append(key, paramsToSign[key])
        }
        formData.append('signature', signature)
        const uploadResult = await axios.post(uploadUrl, formData)
        return { url: uploadResult.data.secure_url, is_primary: false }
      })
      const results = await Promise.all(uploadPromises)
      uploadedImageUrls.push(...results)
    }
    if (uploadedImageUrls.length > 0) {
      uploadedImageUrls[0].is_primary = true
    }
    const finalPayload = { ...raffle.value, images: uploadedImageUrls }
    const response = await api.post('/api/raffles', finalPayload)
    successMessage.value = `Rifa criada com sucesso! ID: ${response.data.raffleId}`
    setTimeout(() => {
      router.push({ name: 'admin-rifas-listar' })
    }, 2000)
  } catch (error) {
    errorMessage.value = 'Falha ao criar a rifa. Verifique o console para detalhes.'
    console.error(error.response ? error.response.data : error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Adicione este estilo para o select e input de data */
input[type='date'],
select {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white; /* Garante fundo branco em todos os navegadores */
}

/* Seus outros estilos permanecem aqui... */
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
:deep(.ql-editor) {
  min-height: 150px;
}

/* NOVO: Estilos para preview de imagem */
.image-preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}
.image-preview {
  border: 1px solid #ddd;
  padding: 0.5rem;
  border-radius: 4px;
  text-align: center;
}
.image-preview img {
  max-width: 100%;
  height: 80px;
  object-fit: cover;
  display: block;
  margin-bottom: 0.5rem;
}
.image-preview span {
  font-size: 0.8rem;
  word-break: break-all;
}
</style>
