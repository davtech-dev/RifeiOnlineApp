<template>
  <form @submit.prevent="onFormSubmit" class="raffle-form">
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
      />
    </div>

    <div class="form-group">
      <label>Regras</label>
      <QuillEditor theme="snow" toolbar="essential" v-model:content="raffle.rules" contentType="html" />
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
          <option value="sorteada">Sorteada</option>
          <option value="cancelada">Cancelada</option>
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
      <div v-if="raffle.images && raffle.images.length > 0" class="image-preview-container">
        <div v-for="(image, index) in raffle.images" :key="index" class="image-preview existing">
          <img :src="image.url" :alt="'Imagem ' + (index + 1)" />
          <button type="button" @click="requestImageDeletion(index)" class="delete-image-btn">
            Excluir
          </button>
        </div>
      </div>

      <div class="form-group">
        <label for="images-upload">Adicionar Novas Imagens</label>
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

    <button type="submit" :disabled="isSubmitting" class="submit-btn">
      {{ isSubmitting ? 'Salvando...' : buttonText }}
    </button>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
  buttonText: {
    type: String,
    default: 'Salvar Rifa',
  },
});

const emit = defineEmits(['update:modelValue', 'submit', 'delete-image']);

// Cópia local para edição, evitando mutação direta da prop
const raffle = ref(JSON.parse(JSON.stringify(props.modelValue)));
const selectedFiles = ref([]);

// Sincroniza a cópia local se a prop externa mudar
watch(
  () => props.modelValue,
  (newValue) => {
    raffle.value = JSON.parse(JSON.stringify(newValue));
  },
  { deep: true }
);

// Sincroniza a prop externa quando a cópia local mudar
watch(
  raffle,
  (newValue) => {
    emit('update:modelValue', newValue);
  },
  { deep: true }
);

// Funções de manipulação do formulário
const addAward = () => {
  if (!raffle.value.awards) raffle.value.awards = [];
  raffle.value.awards.push({ placement: raffle.value.awards.length + 1, description: '' });
};

const removeAward = (index) => {
  raffle.value.awards.splice(index, 1);
};

const handleFileSelect = (event) => {
  selectedFiles.value = Array.from(event.target.files);
};

const getPreviewUrl = (file) => {
  return URL.createObjectURL(file);
};

const requestImageDeletion = (index) => {
  const imageToDelete = raffle.value.images[index];
  if (confirm(`Tem certeza que deseja excluir a imagem? Esta ação não pode ser desfeita.`)) {
    emit('delete-image', imageToDelete);
  }
};

const onFormSubmit = () => {
  // Emite os dados atuais E os novos arquivos a serem enviados
  emit('submit', { formData: raffle.value, newFiles: selectedFiles.value });
};
</script>

<style scoped>
/* Copie todos os estilos do seu formulário anterior para cá */
.raffle-form { display: flex; flex-direction: column; gap: 1.5rem; }
.form-group, fieldset { display: flex; flex-direction: column; gap: 0.5rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
input, select { padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px; }
.dynamic-item { display: flex; gap: 0.5rem; align-items: center; }
.dynamic-item input[type='text'] { flex-grow: 1; }
.add-btn, .remove-btn, .submit-btn { padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; }
.add-btn { background-color: #e0e0e0; }
.remove-btn { background-color: #fdd8d8; color: #c53030; }
.submit-btn { background-color: #2c5282; color: white; padding: 0.75rem; font-size: 1rem; }
.submit-btn:disabled { background-color: #a0aec0; }
.image-preview-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1rem; margin-top: 1rem; }
.image-preview { border: 1px solid #ddd; padding: 0.5rem; border-radius: 4px; text-align: center; position: relative; }
.image-preview img { width: 100%; height: 80px; object-fit: cover; display: block; margin-bottom: 0.5rem; }
.image-preview.existing .delete-image-btn { position: absolute; top: -10px; right: -10px; background-color: #c53030; color: white; border-radius: 50%; border: none; width: 24px; height: 24px; cursor: pointer; font-weight: bold; }
:deep(.ql-editor) { min-height: 150px; }
</style>