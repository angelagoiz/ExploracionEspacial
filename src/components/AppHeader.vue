<template>
  <header class="bg-black shadow-lg">
    <nav class="navbar navbar-expand-lg navbar-dark container">

      <router-link class="navbar-brand fw-bold text-info" to="/">
        🌌 Exploración Espacial
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#menuNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse justify-content-end" id="menuNav">
        <ul class="navbar-nav gap-3 text-center align-items-center">
          <li class="nav-item">
            <a class="nav-link nav-custom active"
               href="https://www.nationalgeographicla.com/espacio/2023/06/asi-fue-el-origen-del-sistema-solar"
               target="_blank">📖 Historia</a>
          </li>
          <li class="nav-item">
            <a class="nav-link nav-custom"
               href="https://science.nasa.gov/gallery/our-solar-system-images/"
               target="_blank">🖼 Imágenes</a>
          </li>
          <li class="nav-item">
            <a class="nav-link nav-custom"
               href="https://www.youtube.com/@nasa_es"
               target="_blank">🎥 Videos</a>
          </li>

          <!-- Sección autenticación -->
          <template v-if="isAuthenticated">
            <li class="nav-item">
              <router-link class="nav-link nav-custom" to="/favoritos">⭐ Favoritos</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link nav-custom" to="/preferencias">⚙️ Preferencias</router-link>
            </li>
            <li class="nav-item text-info small">
              👤 {{ usuario.nombre }}
            </li>
            <li class="nav-item">
              <button class="btn btn-sm btn-outline-danger" @click="cerrarSesion">
                Cerrar sesión
              </button>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <router-link class="nav-link nav-custom" to="/login">🔐 Login</router-link>
            </li>
          </template>
        </ul>
      </div>

    </nav>
  </header>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'AppHeader',
  setup() {
    const store = useStore()
    const router = useRouter()

    const isAuthenticated = computed(() => store.state.isAuthenticated)
    const usuario = computed(() => store.state.usuario)

    function cerrarSesion() {
      store.dispatch('logout')
      router.push('/login')
    }

    return { isAuthenticated, usuario, cerrarSesion }
  },
}
</script>
