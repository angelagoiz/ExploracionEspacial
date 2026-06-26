import { createStore } from 'vuex'
import { LUGARES_DATA } from '../clima.js'

const usuariosFake = [
  {
    id: 1,
    nombre: 'Ana García',
    email: 'ana@espacio.com',
    password: '1234',
    unidad: 'C',
    favoritos: ['tierra', 'marte'],
  },
  {
    id: 2,
    nombre: 'Pedro López',
    email: 'pedro@espacio.com',
    password: '1234',
    unidad: 'K',
    favoritos: ['jupiter', 'saturno'],
  },
]

function cargarSesion() {
  try {
    const raw = sessionStorage.getItem('sesion')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const sesionGuardada = cargarSesion()

export default createStore({
  state: {
    usuario:         sesionGuardada ?? null,
    isAuthenticated: sesionGuardada !== null,
    // ── NUEVO: lista de lugares y lugar seleccionado en Vuex ──
    lugares:         LUGARES_DATA.map(d => ({ ...d, pronosticoSemanal: [...d.pronosticoSemanal] })),
    lugarSeleccionado: null,
    cargando:        false,
    errorApi:        null,
  },
  mutations: {
    SET_USUARIO(state, usuario) {
      state.usuario         = usuario
      state.isAuthenticated = true
      sessionStorage.setItem('sesion', JSON.stringify(usuario))
    },
    CERRAR_SESION(state) {
      state.usuario         = null
      state.isAuthenticated = false
      sessionStorage.removeItem('sesion')
    },
    ACTUALIZAR_UNIDAD(state, unidad) {
      if (state.usuario) {
        state.usuario.unidad = unidad
        sessionStorage.setItem('sesion', JSON.stringify(state.usuario))
      }
    },
    AGREGAR_FAVORITO(state, id) {
      if (state.usuario && !state.usuario.favoritos.includes(id)) {
        state.usuario.favoritos.push(id)
        sessionStorage.setItem('sesion', JSON.stringify(state.usuario))
      }
    },
    ELIMINAR_FAVORITO(state, id) {
      if (state.usuario) {
        state.usuario.favoritos = state.usuario.favoritos.filter(f => f !== id)
        sessionStorage.setItem('sesion', JSON.stringify(state.usuario))
      }
    },
    SET_LUGAR_SELECCIONADO(state, lugar) {
      state.lugarSeleccionado = lugar
    },
    SET_PRONOSTICO_TIERRA(state, pronostico) {
      const tierra = state.lugares.find(l => l.id === 'tierra')
      if (tierra) {
        tierra.pronosticoSemanal = pronostico
        if (pronostico.length) {
          tierra.tempActual   = Math.round((pronostico[0].min + pronostico[0].max) / 2)
          tierra.estadoActual = pronostico[0].estado
        }
      }
    },
    SET_CARGANDO(state, val) { state.cargando = val },
    SET_ERROR_API(state, msg) { state.errorApi = msg },
  },
  actions: {
    login({ commit }, { email, password }) {
      return new Promise((resolve, reject) => {
        const u = usuariosFake.find(u => u.email === email && u.password === password)
        if (u) {
          commit('SET_USUARIO', { ...u, favoritos: [...u.favoritos] })
          resolve()
        } else {
          reject(new Error('Usuario o contraseña incorrectos'))
        }
      })
    },
    logout({ commit }) {
      commit('CERRAR_SESION')
    },
    async cargarDatosTierra({ commit }) {
      commit('SET_CARGANDO', true)
      commit('SET_ERROR_API', null)
      try {
        const { ApiClient } = await import('../clima.js')
        const pronostico = await new ApiClient().obtenerPronosticoTierra()
        commit('SET_PRONOSTICO_TIERRA', pronostico)
      } catch (e) {
        commit('SET_ERROR_API', e.message)
        // fallback
        commit('SET_PRONOSTICO_TIERRA', [
          { dia: 'Lunes',     min: 10, max: 22, estado: 'Soleado'  },
          { dia: 'Martes',    min: 12, max: 24, estado: 'Soleado'  },
          { dia: 'Miércoles', min:  8, max: 18, estado: 'Lluvioso' },
          { dia: 'Jueves',    min:  9, max: 17, estado: 'Nublado'  },
          { dia: 'Viernes',   min: 11, max: 20, estado: 'Soleado'  },
          { dia: 'Sábado',    min: 13, max: 23, estado: 'Soleado'  },
          { dia: 'Domingo',   min:  7, max: 16, estado: 'Lluvioso' },
        ])
      } finally {
        commit('SET_CARGANDO', false)
      }
    },
  },
  getters: {
    lugaresList: state => state.lugares,
    lugarPorId: state => id => state.lugares.find(l => l.id === id) ?? null,
    unidadActiva: state => state.usuario?.unidad ?? 'C',
  },
})
