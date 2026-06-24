<template>
  <main class="container mt-4">
    <h2 class="text-info mb-4">⭐ Mis lugares favoritos</h2>

    <p v-if="favoritos.length === 0" class="text-secondary">
      No tienes favoritos aún. Agrégalos desde la página de inicio.
    </p>

    <div class="row g-3">
      <div v-for="lugar in lugaresFavoritos" :key="lugar.id" class="col-12 col-sm-6 col-md-4">
        <div class="card bg-dark border-secondary text-light h-100">
          <div class="card-body d-flex justify-content-between align-items-center">
            <div>
              <h5 class="card-title mb-0">{{ lugar.nombre }}</h5>
              <small class="text-secondary">{{ convertir(lugar.tempActual) }}</small>
            </div>
            <button class="btn btn-sm btn-outline-danger" @click="eliminar(lugar.id)">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { LUGARES_DATA } from '../clima.js'

export default {
  name: 'FavoritosView',
  setup() {
    const store = useStore()

    const favoritos = computed(() => store.state.usuario?.favoritos || [])
    const unidad = computed(() => store.state.usuario?.unidad || 'C')

    const lugaresFavoritos = computed(() =>
      LUGARES_DATA.filter(l => favoritos.value.includes(l.id))
    )

    function convertir(tempC) {
      const u = unidad.value
      if (u === 'F') return Math.round(tempC * 9 / 5 + 32) + ' °F'
      if (u === 'K') return Math.round(tempC + 273.15) + ' K'
      return tempC + ' °C'
    }

    function eliminar(id) {
      store.commit('ELIMINAR_FAVORITO', id)
    }

    return { favoritos, lugaresFavoritos, convertir, eliminar }
  },
}
</script>
