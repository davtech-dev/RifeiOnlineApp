<template>
  <div>
    <header>
      <h1>Meu Site de Rifas</h1>
      <nav>
        <router-link to="/">Home</router-link>
      </nav>
    </header>

    <main>
      <router-view />
    </main>

    <footer>
      <p>&copy; 2025 Rifas Inc.</p>
    </footer>
  </div>
</template>

<script setup>
// Nenhuma lógica necessária por enquanto
</script>

<style scoped>
/* Estilos para o seu layout */
main {
  padding: 20px;
}
</style>
