<template>
  <div class="container mx-auto p-4 lg:p-8 xl:max-w-7xl">
    <div
      class="space-y-2 py-2 text-center sm:flex sm:items-center sm:justify-between sm:space-y-0 sm:text-left lg:py-0"
    >
      <div class="grow">
        <h1 class="mb-1 text-xl font-bold">Dashboard</h1>
        <h2 class="text-sm font-medium text-gray-500 dark:text-gray-400">
          Welcome
          <a
            href="#"
            class="text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-300"
            >{{ authStore.user?.name }}</a
          >, aqui as coisas acontecem!
        </h2>
      </div>
      <div
        class="flex flex-none items-center justify-center gap-2 rounded-sm px-2 py-3 sm:justify-end sm:bg-transparent sm:px-0"
      >
        <RouterLink
          class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-700 px-3 py-2 text-sm leading-5 font-semibold text-white hover:border-gray-600 hover:bg-gray-600 hover:text-white focus:ring-3 focus:ring-gray-400/50 active:border-gray-700 active:bg-gray-700 dark:focus:ring-gray-400/90"
          :to="{ name: 'admin-rifas-criar' }"
        >
          Nova Rifa
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()
</script>
