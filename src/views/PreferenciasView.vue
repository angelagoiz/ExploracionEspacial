<template>
  <main class="container mt-4" style="max-width: 480px;">
    <h2 class="text-info mb-4">⚙️ Mis preferencias</h2>

    <p class="text-light">Usuario: <strong>{{ usuario.nombre }}</strong></p>
    <p class="text-light">Email: {{ usuario.email }}</p>

    <div class="mb-3 mt-4">
      <label class="form-label text-light">Unidad de temperatura</label>
      <select v-model="unidad" @change="guardar" class="form-select bg-dark text-light border-secondary">
        <option value="C">Celsius (°C)</option>
        <option value="F">Fahrenheit (°F)</option>
        <option value="K">Kelvin (K)</option>
      </select>
    </div>

    <p v-if="guardado" class="text-success">✔ Preferencias guardadas.</p>
  </main>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'PreferenciasView',
  setup() {
    const store = useStore()
    const usuario = computed(() => store.state.usuario)
    const unidad = ref(store.state.usuario?.unidad || 'C')
    const guardado = ref(false)

    function guardar() {
      store.commit('ACTUALIZAR_UNIDAD', unidad.value)
      guardado.value = true
      setTimeout(() => { guardado.value = false }, 2000)
    }

    return { usuario, unidad, guardado, guardar }
  },
}
</script>
