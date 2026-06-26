<template>
  <div class="row g-3 align-items-center justify-content-center mb-3">

    <div class="col-md-5">
      <input
        :value="busqueda"
        @input="$emit('update:busqueda', $event.target.value)"
        type="text"
        class="form-control bg-dark text-white border-secondary"
        placeholder="🔍 Buscar planeta o estrella…"
      />
    </div>

    <div class="col-md-3">
      <select
        :value="unidad"
        @change="$emit('update:unidad', $event.target.value)"
        class="form-select bg-dark text-white border-secondary"
        :disabled="bloquearUnidad"
        :title="bloquearUnidad ? 'Unidad controlada por tus preferencias' : ''"
      >
        <option value="C">°C — Celsius</option>
        <option value="F">°F — Fahrenheit</option>
        <option value="K">K — Kelvin</option>
      </select>
    </div>

    <div v-if="bloquearUnidad" class="col-12 text-center">
      <small class="text-secondary">
        🔒 Unidad tomada de tus <router-link to="/preferencias" class="text-info">preferencias</router-link>
      </small>
    </div>

  </div>
</template>

<script>
export default {
  name: 'BuscadorPlanetas',
  props: {
    busqueda:      { type: String,  default: '' },
    unidad:        { type: String,  default: 'C' },
    bloquearUnidad:{ type: Boolean, default: false },
  },
  emits: ['update:busqueda', 'update:unidad'],
}
</script>
