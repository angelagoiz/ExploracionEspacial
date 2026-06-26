<template>
  <div v-if="stats" class="detalle-seccion">

    <h3 class="titulo-seccion">📊 Estadísticas de la Semana</h3>

    <!-- Máxima / Mínima / Promedio -->
    <div class="row g-3 mb-3">
      <div class="col-4">
        <div class="text-center p-3 caja caja-max">
          <div class="caja-label">Máxima</div>
          <div class="caja-valor" style="color:#fca5a5;">{{ formatearTemp(stats.max) }}</div>
        </div>
      </div>
      <div class="col-4">
        <div class="text-center p-3 caja caja-min">
          <div class="caja-label">Mínima</div>
          <div class="caja-valor" style="color:#7dd3fc;">{{ formatearTemp(stats.min) }}</div>
        </div>
      </div>
      <div class="col-4">
        <div class="text-center p-3 caja caja-avg">
          <div class="caja-label">Promedio</div>
          <div class="caja-valor" style="color:#c4b5fd;">{{ formatearTemp(stats.promedio) }}</div>
        </div>
      </div>
    </div>

    <!-- Días por tipo de clima (v-for) -->
    <div class="mb-3 p-3 caja-estados">
      <div class="caja-label mb-2">Días por tipo de clima</div>
      <div
        v-for="(cantidad, estado) in stats.conteoEstados"
        :key="estado"
        class="d-flex justify-content-between align-items-center mb-1"
      >
        <span style="color:#94a3b8;font-size:0.85rem;">{{ estado }}</span>
        <span :style="{ color: colorPlaneta }" style="font-weight:700;">
          {{ cantidad }} {{ cantidad === 1 ? 'día' : 'días' }}
        </span>
      </div>
    </div>

    <!-- Resumen textual -->
    <div class="mb-3 p-3 caja-resumen" :style="estiloResumen">
      💬 {{ stats.resumen }}
    </div>

    <!-- Alertas (v-for) -->
    <h4 class="titulo-seccion" style="font-size:0.9rem;">⚠️ Alertas de Clima</h4>
    <div
      v-for="(alerta, i) in alertas"
      :key="i"
      class="d-flex align-items-start gap-2 mb-2 p-2 alerta-item"
      :style="{ borderLeft: `3px solid ${alerta.color}` }"
    >
      <span style="font-size:1.1rem;">{{ alerta.emoji }}</span>
      <span :style="{ color: alerta.color }" style="font-size:0.85rem;">{{ alerta.texto }}</span>
    </div>

  </div>
</template>

<script>
import { formatTemp, formatTempF, COLOR_MAP } from '../clima.js'

export default {
  name: 'EstadisticasSemana',

  props: {
    stats:    { type: Object, default: null },
    alertas:  { type: Array,  default: () => [] },
    modifier: { type: String, default: 'mild' },
    unidad:   { type: String, default: 'C' },
  },

  computed: {
    colorPlaneta() {
      return (COLOR_MAP[this.modifier] ?? COLOR_MAP.mild).color
    },
    estiloResumen() {
      const c = COLOR_MAP[this.modifier] ?? COLOR_MAP.mild
      return {
        background:   `linear-gradient(135deg, ${c.bg}, rgba(0,0,0,0.3))`,
        border:       `1px solid ${c.border}`,
        borderRadius: '12px',
        fontSize:     '0.9rem',
        color:        c.color,
        fontStyle:    'italic',
      }
    },
  },

  methods: {
    formatearTemp(t) {
      if (this.unidad === 'F') return formatTempF(t)
      if (this.unidad === 'K') return `${Math.round(t + 273.15)} K`
      return formatTemp(t)
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
.caja { border-radius: 12px; }
.caja-max { background: rgba(239,68,68,0.1);  border: 1px solid rgba(239,68,68,0.2);  }
.caja-min { background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.2); }
.caja-avg { background: rgba(129,140,248,0.1);border: 1px solid rgba(129,140,248,0.2);}
.caja-label { font-size:0.65rem; color:#94a3b8; letter-spacing:1px; text-transform:uppercase; }
.caja-valor { font-size:1.1rem; font-weight:700; }
.caja-estados {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
}
.alerta-item {
  background: rgba(255,255,255,0.04);
  border-radius: 8px;
}
</style>
