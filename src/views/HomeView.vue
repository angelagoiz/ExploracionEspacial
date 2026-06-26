<template>
  <main>

    <section class="container mt-4 text-center">
      <p>Conoce la temperatura de los planetas y nuestra estrella principal 🌞</p>
      <p v-if="isAuthenticated" class="text-info mb-0">
        Bienvenido, <strong>{{ usuario.nombre }}</strong> —
        unidad activa: <strong>{{ unidadLabel }}</strong>
      </p>
    </section>

    <CarruselPlanetas />

    <div class="container mt-3 text-center">
      <button @click="irAlFinal" class="btn btn-primary scroll-btn">Ir al final</button>
    </div>

    <section class="container mt-4">

      <BuscadorPlanetas
        v-model:busqueda="busqueda"
        v-model:unidad="unidadLocal"
        :bloquear-unidad="isAuthenticated"
      />

      <p v-if="!cargando && lugaresFiltrados.length === 0" class="text-warning text-center mt-3">
        🪐 No se encontró ningún planeta con ese nombre.
      </p>

      <div v-if="cargando" class="text-center py-5">
        <div class="spinner-border text-info" role="status"></div>
        <p class="text-white mt-3">Cargando datos del universo…</p>
      </div>

      <div v-else-if="errorApi" class="text-center py-4">
        <p class="text-warning">
          ⚠️ No se pudo obtener datos en tiempo real de la Tierra. Usando datos de respaldo.
        </p>
      </div>

      <div v-if="!cargando" id="planetas-grid" class="row g-4">
        <div
          v-for="lugar in lugaresFiltrados"
          :key="lugar.id"
          class="col-md-4"
        >
          <TarjetaPlaneta :lugar="lugar" :unidad="unidadActiva" />
        </div>
      </div>

    </section>

    <div id="seccion-final" class="text-center mt-4 mb-4">
      <button @click="irArriba" class="btn btn-primary scroll-btn">Volver al inicio</button>
    </div>

  </main>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import CarruselPlanetas from '../components/CarruselPlanetas.vue'
import BuscadorPlanetas from '../components/BuscadorPlanetas.vue'
import TarjetaPlaneta   from '../components/TarjetaPlaneta.vue'

export default {
  name: 'HomeView',
  components: { CarruselPlanetas, BuscadorPlanetas, TarjetaPlaneta },

  setup() {
    const store = useStore()
    const busqueda    = ref('')
    const unidadLocal = ref('C')

    const isAuthenticated = computed(() => store.state.isAuthenticated)
    const usuario         = computed(() => store.state.usuario)
    const cargando        = computed(() => store.state.cargando)
    const errorApi        = computed(() => store.state.errorApi)
    const lugares         = computed(() => store.getters.lugaresList)
    const unidadActiva    = computed(() => store.getters.unidadActiva !== 'C' && isAuthenticated.value
      ? store.getters.unidadActiva
      : isAuthenticated.value ? store.getters.unidadActiva : unidadLocal.value)

    const unidadLabel = computed(() => {
      const u = unidadActiva.value
      return u === 'C' ? 'Celsius (°C)' : u === 'F' ? 'Fahrenheit (°F)' : 'Kelvin (K)'
    })

    const lugaresFiltrados = computed(() => {
      const q = busqueda.value.trim().toLowerCase()
      if (!q) return lugares.value
      return lugares.value.filter(l => l.nombre.toLowerCase().includes(q))
    })

    return {
      busqueda, unidadLocal,
      isAuthenticated, usuario,
      cargando, errorApi,
      unidadActiva, unidadLabel,
      lugaresFiltrados,
    }
  },

  async created() {
    await this.$store.dispatch('cargarDatosTierra')
  },

  methods: {
    irAlFinal() {
      document.getElementById('seccion-final')?.scrollIntoView({ behavior: 'smooth' })
    },
    irArriba() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
  },
}
</script>
