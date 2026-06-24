<template>
  <article class="card h-100">

    <img :src="lugar.img" class="card-img-top" :alt="`Imagen de ${lugar.nombre}`" />

    <div class="card-body text-center d-flex flex-column">

      <h5 class="titulo-planeta">{{ lugar.nombre.toUpperCase() }}</h5>

      <p class="flex-grow-1">{{ descripcionCorta }}</p>

      <div class="mb-2">
        <span class="badge-temp" :style="estiloColor">
          {{ tempFormateada }} · {{ lugar.estadoActual }}
        </span>
      </div>

      <span v-if="lugar.usaApiReal" class="badge bg-success mb-2" style="font-size:0.65rem;">
        🌐 Datos reales (Open-Meteo)
      </span>

      <div class="d-flex gap-2 mt-auto">
        <router-link
          :to="{ name: 'detalle', params: { id: lugar.id } }"
          class="btn btn-primary flex-grow-1"
        >
          Ver más
        </router-link>

        <!-- Botón favorito: solo visible si está autenticado -->
        <button
          v-if="isAuthenticated"
          class="btn btn-sm"
          :class="esFavorito ? 'btn-warning' : 'btn-outline-warning'"
          @click="toggleFavorito"
          :title="esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'"
        >
          {{ esFavorito ? '⭐' : '☆' }}
        </button>
      </div>

    </div>
  </article>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { COLOR_MAP, formatTemp, formatTempF } from '../clima.js'

export default {
  name: 'TarjetaPlaneta',

  props: {
    lugar: { type: Object, required: true },
    unidad: { type: String, default: 'C' },
  },

  setup(props) {
    const store = useStore()

    const isAuthenticated = computed(() => store.state.isAuthenticated)
    const esFavorito = computed(() =>
      store.state.usuario?.favoritos?.includes(props.lugar.id) ?? false
    )

    function toggleFavorito() {
      if (esFavorito.value) {
        store.commit('ELIMINAR_FAVORITO', props.lugar.id)
      } else {
        store.commit('AGREGAR_FAVORITO', props.lugar.id)
      }
    }

    return { isAuthenticated, esFavorito, toggleFavorito }
  },

  computed: {
    descripcionCorta() {
      return this.lugar.desc.length > 110
        ? this.lugar.desc.substring(0, 110) + '…'
        : this.lugar.desc
    },

    tempFormateada() {
      if (this.unidad === 'F') return formatTempF(this.lugar.tempActual)
      if (this.unidad === 'K') return Math.round(this.lugar.tempActual + 273.15) + ' K'
      return formatTemp(this.lugar.tempActual)
    },

    estiloColor() {
      const c = COLOR_MAP[this.lugar.modifier] ?? COLOR_MAP.mild
      return {
        background:   c.bg,
        color:        c.color,
        border:       `1px solid ${c.border}`,
        borderRadius: '20px',
        padding:      '4px 12px',
        fontSize:     '0.8rem',
        fontWeight:   '700',
        display:      'inline-block',
      }
    },
  },
}
</script>
