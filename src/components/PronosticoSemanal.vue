<template>
  <div class="detalle-seccion">

    <h3 class="titulo-seccion">
      📅 Pronóstico Semanal
      <span v-if="usaApiReal" class="badge bg-success ms-2" style="font-size:0.6rem;vertical-align:middle;">
        🌐 API real
      </span>
    </h3>

    <p v-if="!dias.length" class="text-white text-center">
      Sin datos de pronóstico disponibles.
    </p>

    <div v-else class="row g-2">
      <div
        v-for="dia in dias"
        :key="dia.dia"
        class="col-6 col-md-3"
      >
        <div class="dia-card text-center p-2">
          <div class="dia-nombre">{{ dia.dia }}</div>
          <div class="dia-estado" :style="{ color: colorPlaneta }">{{ dia.estado }}</div>
          <div style="font-size:0.75rem;">
            <span style="color:#fca5a5;">▲ {{ formatearTemp(dia.max) }}</span>
            &nbsp;
            <span style="color:#7dd3fc;">▼ {{ formatearTemp(dia.min) }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { formatTemp, formatTempF } from '../clima.js'

export default {
  name: 'PronosticoSemanal',

  props: {
    dias:        { type: Array,   required: true },
    colorPlaneta:{ type: String,  default: '#7dd3fc' },
    usaApiReal:  { type: Boolean, default: false },
    unidad:      { type: String,  default: 'C' },
  },

  methods: {
    formatearTemp(t) {
      return this.unidad === 'F' ? formatTempF(t) : formatTemp(t)
    },
  },
}
</script>

<style scoped>
.detalle-seccion {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 24px;
  margin-top: 24px;
}
.titulo-seccion {
  font-size: 1rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #38bdf8;
  margin-bottom: 1rem;
}
.dia-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
}
.dia-nombre {
  font-size: 0.7rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.dia-estado {
  font-size: 0.85rem;
  margin: 4px 0;
}
</style>
