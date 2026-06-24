<template>
  <main class="container mt-3 pb-5">

    <!-- Breadcrumb -->
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

    <!-- Spinner (v-if) -->
    <div v-if="cargando" class="text-center py-5">
      <div class="spinner-border text-info" role="status"></div>
      <p class="text-white mt-3">Cargando datos del planeta…</p>
    </div>

    <!-- No encontrado (v-else-if) -->
    <div v-else-if="!lugar" class="text-center py-5">
      <p class="text-warning">🪐 Planeta no encontrado.</p>
      <router-link to="/" class="btn btn-outline-info mt-2">⬅ Volver al inicio</router-link>
    </div>

    <!-- Contenido (v-else) -->
    <div v-else class="row justify-content-center">
      <div class="col-lg-8">

        <!-- Card principal del planeta -->
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

            <!-- Selector de unidad en el detalle -->
            <div class="d-flex justify-content-center gap-2 mt-3">
              <button
                @click="unidad = 'C'"
                :class="['btn btn-sm', unidad === 'C' ? 'btn-info' : 'btn-outline-info']"
              >°C</button>
              <button
                @click="unidad = 'F'"
                :class="['btn btn-sm', unidad === 'F' ? 'btn-info' : 'btn-outline-info']"
              >°F</button>
            </div>

            <!-- Botón temperatura (v-if / v-show) -->
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

        <!-- Pronóstico semanal (componente) -->
        <PronosticoSemanal
          :dias="lugar.pronosticoSemanal"
          :color-planeta="colorPlaneta"
          :usa-api-real="lugar.usaApiReal"
          :unidad="unidad"
        />

        <!-- Estadísticas y alertas (componente) -->
        <EstadisticasSemana
          :stats="stats"
          :alertas="alertas"
          :modifier="lugar.modifier"
          :unidad="unidad"
        />

        <!-- Volver -->
        <div class="text-center mt-4">
          <router-link to="/" class="btn btn-outline-info">⬅ Volver al inicio</router-link>
        </div>

      </div>
    </div>
  </main>
</template>

<script>
import { ApiClient, LUGARES_DATA, COLOR_MAP, formatTemp, formatTempF, calcularEstadisticas, generarAlertas } from '../clima.js'
import PronosticoSemanal  from '../components/PronosticoSemanal.vue'
import EstadisticasSemana from '../components/EstadisticasSemana.vue'

export default {
  name: 'DetalleView',
  components: { PronosticoSemanal, EstadisticasSemana },

  data() {
    return {
      lugar:      null,
      cargando:   true,
      tempVisible: false,
      unidad:     'C',
      stats:      null,
      alertas:    [],
    }
  },

  computed: {
    colorPlaneta() {
      return (COLOR_MAP[this.lugar?.modifier] ?? COLOR_MAP.mild).color
    },

    estiloTemp() {
      const c = COLOR_MAP[this.lugar?.modifier] ?? COLOR_MAP.mild
      return {
        background: c.bg,
        color:      c.color,
        border:     `1px solid ${c.border}`,
        maxWidth:   '300px',
      }
    },

    tempActualFormateada() {
      if (!this.lugar) return ''
      return this.unidad === 'F'
        ? formatTempF(this.lugar.tempActual)
        : formatTemp(this.lugar.tempActual)
    },
  },

  async created() {
    const id = this.$route.params.id
    const lugares = LUGARES_DATA.map(d => ({ ...d, pronosticoSemanal: [...d.pronosticoSemanal] }))
    let lugar = lugares.find(l => l.id === id) ?? null

    // Cargar API real si es la Tierra y no tiene pronóstico
    if (lugar?.usaApiReal && !lugar.pronosticoSemanal.length) {
      try {
        const pronostico = await new ApiClient().obtenerPronosticoTierra()
        lugar.pronosticoSemanal = pronostico
        if (pronostico.length) {
          lugar.tempActual   = Math.round((pronostico[0].min + pronostico[0].max) / 2)
          lugar.estadoActual = pronostico[0].estado
        }
      } catch {
        lugar.pronosticoSemanal = [
          { dia: 'Lunes',     min: 10, max: 22, estado: 'Soleado'  },
          { dia: 'Martes',    min: 12, max: 24, estado: 'Soleado'  },
          { dia: 'Miércoles', min:  8, max: 18, estado: 'Lluvioso' },
          { dia: 'Jueves',    min:  9, max: 17, estado: 'Nublado'  },
          { dia: 'Viernes',   min: 11, max: 20, estado: 'Soleado'  },
          { dia: 'Sábado',    min: 13, max: 23, estado: 'Soleado'  },
          { dia: 'Domingo',   min:  7, max: 16, estado: 'Lluvioso' },
        ]
        lugar.tempActual   = 15
        lugar.estadoActual = 'Nublado'
      }
    }

    this.lugar = lugar
    if (lugar) {
      document.title  = `${lugar.nombre} — Exploración Espacial`
      this.stats   = calcularEstadisticas(lugar.pronosticoSemanal)
      this.alertas = generarAlertas(this.stats)
    }
    this.cargando = false
  },
}
</script>
