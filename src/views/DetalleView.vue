<template>
  <main class="container mt-3 pb-5">

    <nav aria-label="breadcrumb">
      <ol class="breadcrumb" style="background:transparent;">
        <li class="breadcrumb-item">
          <router-link to="/" class="text-info">Inicio</router-link>
        </li>
        <li class="breadcrumb-item active text-white">
          {{ lugar ? lugar.nombre : 'Detalle' }}
        </li>
      </ol>
    </nav>

    <div v-if="cargando" class="text-center py-5">
      <div class="spinner-border text-info" role="status"></div>
      <p class="text-white mt-3">Cargando datos del planeta…</p>
    </div>

    <div v-else-if="!lugar" class="text-center py-5">
      <p class="text-warning">🪐 Planeta no encontrado.</p>
      <router-link to="/" class="btn btn-outline-info mt-2">⬅ Volver al inicio</router-link>
    </div>

    <div v-else class="row justify-content-center">
      <div class="col-lg-8">

        <div class="card text-center mb-4">
          <div class="card-body">

            <h1 class="titulo-planeta mb-3">{{ lugar.nombre }}</h1>

            <img
              :src="lugar.img"
              :alt="`Imagen de ${lugar.nombre}`"
              class="img-fluid my-3"
              style="max-height:280px;object-fit:contain;display:block;margin:0 auto;"
            />

            <p class="text-white">{{ lugar.desc }}</p>

            <div class="d-flex justify-content-center gap-2 mt-3">
              <button
                @click="setUnidad('C')"
                :class="['btn btn-sm', unidadActiva === 'C' ? 'btn-info' : 'btn-outline-info']"
                :disabled="isAuthenticated"
              >°C</button>
              <button
                @click="setUnidad('F')"
                :class="['btn btn-sm', unidadActiva === 'F' ? 'btn-info' : 'btn-outline-info']"
                :disabled="isAuthenticated"
              >°F</button>
              <button
                @click="setUnidad('K')"
                :class="['btn btn-sm', unidadActiva === 'K' ? 'btn-info' : 'btn-outline-info']"
                :disabled="isAuthenticated"
              >K</button>
            </div>
            <small v-if="isAuthenticated" class="text-secondary d-block mt-1">
              Unidad tomada de <router-link to="/preferencias" class="text-info">tus preferencias</router-link>
            </small>

            <button
              v-if="!tempVisible"
              @click="tempVisible = true"
              class="btn btn-primary mt-3"
            >
              🌡 Conocer su temperatura actual
            </button>

            <div
              v-show="tempVisible"
              class="temp-box visible mt-3 mx-auto"
              :style="estiloTemp"
            >
              {{ tempActualFormateada }}
            </div>

          </div>
        </div>

        <PronosticoSemanal
          :dias="lugar.pronosticoSemanal"
          :color-planeta="colorPlaneta"
          :usa-api-real="lugar.usaApiReal"
          :unidad="unidadActiva"
        />

        <EstadisticasSemana
          :stats="stats"
          :alertas="alertas"
          :modifier="lugar.modifier"
          :unidad="unidadActiva"
        />

        <div class="text-center mt-4">
          <router-link to="/" class="btn btn-outline-info">⬅ Volver al inicio</router-link>
        </div>

      </div>
    </div>
  </main>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { COLOR_MAP, formatTemp, formatTempF, formatTempK, calcularEstadisticas, generarAlertas } from '../clima.js'
import PronosticoSemanal  from '../components/PronosticoSemanal.vue'
import EstadisticasSemana from '../components/EstadisticasSemana.vue'

export default {
  name: 'DetalleView',
  components: { PronosticoSemanal, EstadisticasSemana },

  setup() {
    const store = useStore()
    const isAuthenticated = computed(() => store.state.isAuthenticated)
    const unidadStore     = computed(() => store.getters.unidadActiva)
    const cargando        = computed(() => store.state.cargando)
    return { isAuthenticated, unidadStore, cargando, store }
  },

  data() {
    return {
      tempVisible: false,
      unidadLocal: 'C',
      stats:       null,
      alertas:     [],
    }
  },

  computed: {
    lugar() {
      return this.$store.getters.lugarPorId(this.$route.params.id)
    },

    unidadActiva() {
      return this.isAuthenticated ? this.unidadStore : this.unidadLocal
    },

    colorPlaneta() {
      return (COLOR_MAP[this.lugar?.modifier] ?? COLOR_MAP.mild).color
    },

    estiloTemp() {
      const c = COLOR_MAP[this.lugar?.modifier] ?? COLOR_MAP.mild
      return { background: c.bg, color: c.color, border: `1px solid ${c.border}`, maxWidth: '300px' }
    },

    tempActualFormateada() {
      if (!this.lugar) return ''
      const t = this.lugar.tempActual
      const u = this.unidadActiva
      if (u === 'F') return formatTempF(t)
      if (u === 'K') return formatTempK(t)
      return formatTemp(t)
    },
  },

  watch: {
    // Recalcula stats cuando cambia el pronóstico (ej: Tierra carga después)
    'lugar.pronosticoSemanal': {
      handler(val) {
        if (val?.length) {
          this.stats   = calcularEstadisticas(val)
          this.alertas = generarAlertas(this.stats)
        }
      },
      immediate: true,
    },
  },

  created() {
    if (this.lugar) {
      document.title = `${this.lugar.nombre} — Exploración Espacial`
      this.$store.commit('SET_LUGAR_SELECCIONADO', this.lugar)
    }
  },

  methods: {
    setUnidad(u) {
      if (!this.isAuthenticated) this.unidadLocal = u
    },
  },
}
</script>
