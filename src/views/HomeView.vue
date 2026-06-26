<template>
  <main>

    <!-- Intro -->
    <section class="container mt-4 text-center">
      <p>Conoce la temperatura de los planetas y nuestra estrella principal 🌞</p>
      <p v-if="isAuthenticated" class="text-info mb-0">
        Bienvenido, <strong>{{ usuario.nombre }}</strong> —
        unidad activa: <strong>{{ unidadLabel }}</strong>
      </p>
    </section>

    <!-- Carrusel -->
    <CarruselPlanetas />

    <!-- Botón ir al final -->
    <div class="container mt-3 text-center">
      <button @click="irAlFinal" class="btn btn-primary scroll-btn">Ir al final</button>
    </div>

    <section class="container mt-4">

      <!-- Buscador + selector de unidad -->
      <BuscadorPlanetas
        v-model:busqueda="busqueda"
        v-model:unidad="unidadLocal"
        :bloquear-unidad="isAuthenticated"
      />

      <!-- Sin resultados -->
      <p v-if="!cargando && lugaresFiltrados.length === 0" class="text-warning text-center mt-3">
        🪐 No se encontró ningún planeta con ese nombre.
      </p>

      <!-- Spinner -->
      <div v-if="cargando" class="text-center py-5">
        <div class="spinner-border text-info" role="status"></div>
        <p class="text-white mt-3">Cargando datos del universo…</p>
      </div>

      <!-- Error -->
      <div v-else-if="errorCarga" class="text-center py-4">
        <p class="text-danger">⚠️ Error al cargar los datos: {{ errorCarga }}</p>
      </div>

      <!-- Grilla de tarjetas -->
      <div v-else id="planetas-grid" class="row g-4">
        <div
          v-for="lugar in lugaresFiltrados"
          :key="lugar.id"
          class="col-md-4"
        >
          <TarjetaPlaneta :lugar="lugar" :unidad="unidadActiva" />
        </div>
      </div>

    </section>

    <!-- Botón volver arriba -->
    <div id="seccion-final" class="text-center mt-4 mb-4">
      <button @click="irArriba" class="btn btn-primary scroll-btn">Volver al inicio</button>
    </div>

  </main>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { ApiClient, LUGARES_DATA } from '../clima.js'
import CarruselPlanetas from '../components/CarruselPlanetas.vue'
import BuscadorPlanetas from '../components/BuscadorPlanetas.vue'
import TarjetaPlaneta   from '../components/TarjetaPlaneta.vue'

export default {
  name: 'HomeView',
  components: { CarruselPlanetas, BuscadorPlanetas, TarjetaPlaneta },

  setup() {
    const store = useStore()
    const isAuthenticated = computed(() => store.state.isAuthenticated)
    const usuario         = computed(() => store.state.usuario)
    return { isAuthenticated, usuario, store }
  },

  data() {
    return {
      lugares:     [],
      cargando:    true,
      errorCarga:  null,
      busqueda:    '',
      unidadLocal: 'C',
    }
  },

  computed: {
    // Si el usuario está autenticado, prevalece su preferencia del store
    unidadActiva() {
      return this.isAuthenticated ? this.store.state.usuario.unidad : this.unidadLocal
    },

    unidadLabel() {
      const u = this.unidadActiva
      return u === 'C' ? 'Celsius (°C)' : u === 'F' ? 'Fahrenheit (°F)' : 'Kelvin (K)'
    },

    lugaresFiltrados() {
      const q = this.busqueda.trim().toLowerCase()
      if (!q) return this.lugares
      return this.lugares.filter(l => l.nombre.toLowerCase().includes(q))
    },
  },

  async created() {
    try {
      const api = new ApiClient()
      this.lugares = LUGARES_DATA.map(d => ({ ...d, pronosticoSemanal: [...d.pronosticoSemanal] }))

      const tierra = this.lugares.find(l => l.id === 'tierra')
      if (tierra) {
        try {
          const pronostico = await api.obtenerPronosticoTierra()
          tierra.pronosticoSemanal = pronostico
          if (pronostico.length) {
            tierra.tempActual   = Math.round((pronostico[0].min + pronostico[0].max) / 2)
            tierra.estadoActual = pronostico[0].estado
          }
        } catch {
          tierra.pronosticoSemanal = [
            { dia: 'Lunes',     min: 10, max: 22, estado: 'Soleado'  },
            { dia: 'Martes',    min: 12, max: 24, estado: 'Soleado'  },
            { dia: 'Miércoles', min:  8, max: 18, estado: 'Lluvioso' },
            { dia: 'Jueves',    min:  9, max: 17, estado: 'Nublado'  },
            { dia: 'Viernes',   min: 11, max: 20, estado: 'Soleado'  },
            { dia: 'Sábado',    min: 13, max: 23, estado: 'Soleado'  },
            { dia: 'Domingo',   min:  7, max: 16, estado: 'Lluvioso' },
          ]
          tierra.tempActual   = 15
          tierra.estadoActual = 'Nublado'
        }
      }
    } catch (err) {
      this.errorCarga = err.message
    } finally {
      this.cargando = false
    }
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
