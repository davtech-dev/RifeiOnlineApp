<template>
  <header id="page-header" class="z-1 flex flex-none items-center bg-gray-800 shadow-xs">
    <div class="container mx-auto px-4 lg:px-8 xl:max-w-7xl">
      <div class="flex justify-between py-4">
        <div class="flex items-center gap-2 lg:gap-6">
          <a
            href="#"
            class="group inline-flex items-center gap-2 text-lg font-bold tracking-wide text-gray-100 hover:text-gray-300"
          >
            <svg
              class="hi-mini hi-cube-transparent inline-block size-5 text-gray-400 transition group-hover:scale-110"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M9.638 1.093a.75.75 0 01.724 0l2 1.104a.75.75 0 11-.724 1.313L10 2.607l-1.638.903a.75.75 0 11-.724-1.313l2-1.104zM5.403 4.287a.75.75 0 01-.295 1.019l-.805.444.805.444a.75.75 0 01-.724 1.314L3.5 7.02v.73a.75.75 0 01-1.5 0v-2a.75.75 0 01.388-.657l1.996-1.1a.75.75 0 011.019.294zm9.194 0a.75.75 0 011.02-.295l1.995 1.101A.75.75 0 0118 5.75v2a.75.75 0 01-1.5 0v-.73l-.884.488a.75.75 0 11-.724-1.314l.806-.444-.806-.444a.75.75 0 01-.295-1.02zM7.343 8.284a.75.75 0 011.02-.294L10 8.893l1.638-.903a.75.75 0 11.724 1.313l-1.612.89v1.557a.75.75 0 01-1.5 0v-1.557l-1.612-.89a.75.75 0 01-.295-1.019zM2.75 11.5a.75.75 0 01.75.75v1.557l1.608.887a.75.75 0 01-.724 1.314l-1.996-1.101A.75.75 0 012 14.25v-2a.75.75 0 01.75-.75zm14.5 0a.75.75 0 01.75.75v2a.75.75 0 01-.388.657l-1.996 1.1a.75.75 0 11-.724-1.313l1.608-.887V12.25a.75.75 0 01.75-.75zm-7.25 4a.75.75 0 01.75.75v.73l.888-.49a.75.75 0 01.724 1.313l-2 1.104a.75.75 0 01-.724 0l-2-1.104a.75.75 0 11.724-1.313l.888.49v-.73a.75.75 0 01.75-.75z"
                clip-rule="evenodd"
              />
            </svg>
            <span>Company</span>
          </a>

          <nav class="hidden items-center gap-2 lg:flex">
            <RouterLink
              class="group flex items-center gap-2 rounded-lg border border-transparent bg-gray-700 px-3 py-2 text-sm font-medium text-white"
              :to="{ name: 'admin-dashboard' }"
            >
              Home
            </RouterLink>
            <RouterLink
              class="group flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-gray-200 hover:bg-gray-700 hover:text-white active:border-gray-600"
              :to="{ name: 'admin-rifas-listar' }"
            >
              <span>Rifas</span>
            </RouterLink>
          </nav>
        </div>

        <div class="flex items-center gap-2">
          <a
            href="#"
            class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm leading-5 font-semibold text-gray-300 hover:border-gray-600 hover:text-gray-200 hover:shadow-xs focus:ring-3 focus:ring-gray-600/40 active:border-gray-700 active:shadow-none"
          >
            <svg
              class="hi-outline hi-bell-alert inline-block size-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
              />
            </svg>
          </a>
          <Menu as="div" class="relative inline-block">
            <!-- Dropdown Toggle Button -->
            <MenuButton
              class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm leading-5 font-semibold text-gray-300 hover:border-gray-600 hover:text-gray-200 hover:shadow-xs focus:ring-3 focus:ring-gray-600/40 active:border-gray-700 active:shadow-none"
            >
              <svg
                class="hi-mini hi-user-circle inline-block size-5 sm:hidden"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="hidden sm:inline">{{ authStore.user?.name }}</span>
              <svg
                class="hi-mini hi-chevron-down hidden size-5 opacity-40 sm:inline-block"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clip-rule="evenodd"
                />
              </svg>
            </MenuButton>
            <Transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="opacity-0 scale-90"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-90"
            >
              <MenuItems
                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg shadow-xl focus:outline-hidden dark:shadow-gray-900"
              >
                <div
                  class="divide-y divide-gray-100 rounded-lg bg-white ring-1 ring-black/5 dark:divide-gray-700 dark:bg-gray-800 dark:ring-gray-700"
                >
                  <div class="space-y-1 p-2.5">
                    <MenuItem v-slot="{ active }">
                      <RouterLink
                        :to="{ name: 'admin-profile' }"
                        class="group flex items-center justify-between gap-2 rounded-lg border border-transparent px-2.5 py-2 text-sm font-medium"
                        :class="{
                          'bg-gray-50 text-gray-800 dark:border-transparent dark:bg-gray-700/75 dark:text-white':
                            active,
                          'text-gray-700 hover:bg-gray-50 hover:text-gray-800 active:border-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/75 dark:hover:text-white dark:active:border-gray-600':
                            !active,
                        }"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          class="hi-mini hi-lock-closed inline-block size-5 flex-none opacity-25 group-hover:opacity-50"
                        >
                          <path
                            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"
                          />
                        </svg>
                        <span class="grow">Perfil</span>
                      </RouterLink>
                    </MenuItem>

                    <MenuItem v-slot="{ active }">
                      <a
                        href="#"
                        @click="handleLogout"
                        class="group flex items-center justify-between gap-2 rounded-lg border border-transparent px-2.5 py-2 text-sm font-medium"
                        :class="{
                          'bg-gray-50 text-gray-800 dark:border-transparent dark:bg-gray-700/75 dark:text-white':
                            active,
                          'text-gray-700 hover:bg-gray-50 hover:text-gray-800 active:border-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/75 dark:hover:text-white dark:active:border-gray-600':
                            !active,
                        }"
                      >
                        <svg
                          class="hi-mini hi-lock-closed inline-block size-5 flex-none opacity-25 group-hover:opacity-50"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <span class="grow">Sair</span>
                      </a>
                    </MenuItem>
                  </div>
                </div>
              </MenuItems>
            </Transition>
          </Menu>
          <div class="lg:hidden">
            <button
              @click="mobileNavOpen = !mobileNavOpen"
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-transparent px-3 py-2 text-sm leading-5 font-semibold text-gray-100 hover:border-gray-500/75 hover:text-gray-50 hover:shadow-xs focus:ring-3 focus:ring-gray-600/60 active:border-gray-500/50 active:shadow-none"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                class="hi-solid hi-menu inline-block size-5"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <!-- END Toggle Mobile Navigation -->
        </div>
      </div>
      <div
        class="lg:hidden"
        :class="{
          hidden: !mobileNavOpen,
        }"
      >
        <nav class="flex flex-col gap-2 border-t border-white/10 py-4">
          <a
            href="#"
            class="group flex items-center gap-2 rounded-lg border border-transparent bg-white/10 px-3 py-2 text-sm font-semibold text-white"
          >
            <span>Dashboard</span>
          </a>
          <RouterLink
            class="group flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-gray-200 hover:bg-white/10 hover:text-white active:border-white/20"
            :to="{ name: 'admin-rifas-listar' }"
          >
            <span>Rifas</span>
          </RouterLink>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const mobileNavOpen = ref(false)

const router = useRouter()
const authStore = useAuthStore()
function handleLogout() {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>
