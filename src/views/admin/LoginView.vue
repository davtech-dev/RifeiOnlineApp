<template>
  <form @submit.prevent="handleLogin" novalidate class="space-y-6">
    <div class="space-y-1">
      <label for="email" class="inline-block text-sm font-medium">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        v-model="email"
        required
        placeholder="Enter your email"
        class="block w-full rounded-lg border border-gray-200 px-5 py-3 leading-6 placeholder-gray-500 focus:border-gray-500 focus:ring-3 focus:ring-gray-500/50 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-gray-500"
      />
    </div>
    <div class="space-y-1">
      <label for="password" class="inline-block text-sm font-medium">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        v-model="password"
        required
        placeholder="Enter your password"
        class="block w-full rounded-lg border border-gray-200 px-5 py-3 leading-6 placeholder-gray-500 focus:border-gray-500 focus:ring-3 focus:ring-gray-500/50 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-gray-500"
      />
    </div>
    <div>
      <button
        type="submit"
        class="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-green-700 bg-green-700 px-6 py-3 leading-6 font-semibold text-white hover:border-green-600 hover:bg-green-600 hover:text-white focus:ring-3 focus:ring-green-400/50 active:border-green-700 active:bg-green-700 dark:focus:ring-green-400/90"
      >
        <svg
          class="hi-mini hi-arrow-uturn-right inline-block size-5 opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M12.207 2.232a.75.75 0 00.025 1.06l4.146 3.958H6.375a5.375 5.375 0 000 10.75H9.25a.75.75 0 000-1.5H6.375a3.875 3.875 0 010-7.75h10.003l-4.146 3.957a.75.75 0 001.036 1.085l5.5-5.25a.75.75 0 000-1.085l-5.5-5.25a.75.75 0 00-1.06.025z"
            clip-rule="evenodd"
          />
        </svg>
        <span>
          {{ isSubmitting ? 'Verificando...' : 'Entrar' }}
        </span>
      </button>
      <div
        v-if="errorMessage"
        class="mt-3 rounded-sm bg-red-100 p-4 text-red-700 md:p-5 dark:bg-red-900/75 dark:text-red-100"
      >
        <p>{{ errorMessage }}</p>
      </div>
    </div>
  </form>
</template>

<script setup>
import api from '@/services/api.js' // Importa nossa instância pré-configurada
import { useAuthStore } from '@/stores/auth.store'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')

const router = useRouter()
const authStore = useAuthStore()

async function handleLogin() {
  if (!email.value || !password.value) {
    errorMessage.value = 'Por favor, preencha todos os campos.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    // Chama o backend que já está funcionando
    const response = await api.post('/login', {
      email: email.value,
      password: password.value,
    })

    // Pega o usuário e o token da resposta da API
    const { user, token } = response.data

    // **A MÁGICA ACONTECE AQUI**
    // Usa a ação da nossa store para salvar os dados e o token
    authStore.login(user, token)

    // Redireciona para o dashboard, o guardião de rotas vai permitir
    router.push({ name: 'admin-dashboard' })
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      errorMessage.value = 'Email, senha ou permissões inválidas.'
    } else {
      errorMessage.value = 'Não foi possível conectar ao servidor. Tente novamente.'
      console.error(error)
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
