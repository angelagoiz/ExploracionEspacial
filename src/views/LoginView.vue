<template>
  <main class="container mt-5" style="max-width: 420px;">
    <h2 class="text-info text-center mb-4">🔐 Iniciar sesión</h2>

    <p class="text-secondary text-center small">
      Credenciales de prueba:<br>
      ana@espacio.com / 1234 &nbsp;·&nbsp; pedro@espacio.com / 1234
    </p>

    <form @submit.prevent="handleLogin" class="mt-3">
      <div class="mb-3">
        <label class="form-label text-light">Email</label>
        <input v-model="email" type="email" class="form-control bg-dark text-light border-secondary" required />
      </div>
      <div class="mb-3">
        <label class="form-label text-light">Contraseña</label>
        <input v-model="password" type="password" class="form-control bg-dark text-light border-secondary" required />
      </div>
      <p v-if="error" class="text-danger">{{ error }}</p>
      <button type="submit" class="btn btn-info w-100">Entrar</button>
    </form>
  </main>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'LoginView',
  setup() {
    const store = useStore()
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const error = ref('')

    async function handleLogin() {
      error.value = ''
      try {
        await store.dispatch('login', { email: email.value, password: password.value })
        router.push('/')
      } catch (e) {
        error.value = e.message
      }
    }

    return { email, password, error, handleLogin }
  },
}
</script>

