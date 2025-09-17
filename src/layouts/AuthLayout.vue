<template>
  <div
    id="page-container"
    class="mx-auto flex min-h-dvh w-full min-w-80 flex-col bg-gray-100 dark:bg-gray-900 dark:text-gray-100"
  >
    <main id="page-content" class="flex max-w-full flex-auto flex-col">
      <div
        class="relative mx-auto flex min-h-dvh w-full max-w-10xl items-center justify-center overflow-hidden p-4 lg:p-8"
      >
        <section class="w-full max-w-xl py-6">
          <header class="mb-10 text-center">
            <span class="mb-2 inline-flex items-center gap-2 text-2xl font-bold">
              <img src="/logo.png" class="h-20 w-auto" alt="Rifei Online" />
            </span>
            <h2 class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Welcome, please sign in to your dashboard
            </h2>
          </header>
          <div
            class="flex flex-col overflow-hidden rounded-lg bg-white shadow-xs dark:bg-gray-800 dark:text-gray-100"
          >
            <div class="grow p-5 md:px-16 md:py-12">
              <router-view />
            </div>
          </div>
          <div class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <div class="inline-flex items-center justify-center pt-1 pb-4 md:pt-4">
              <span>Developed with</span>
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                class="hi-solid hi-heart mx-1 inline-block size-4 text-red-600"
              >
                <path
                  fill-rule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span>
                by
                <a
                  href="https://davtech.com.br"
                  class="font-medium text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-300"
                  target="_blank"
                  >davtech</a
                ></span
              >
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Nenhuma lógica necessária por enquanto
</script>
