import { createStore } from 'vuex'

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

// Recuperar sesión guardada en sessionStorage (se borra al cerrar la pestaña)
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
  },
  mutations: {
    SET_USUARIO(state, usuario) {
      state.usuario        = usuario
      state.isAuthenticated = true
      sessionStorage.setItem('sesion', JSON.stringify(usuario))
    },
    CERRAR_SESION(state) {
      state.usuario        = null
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
  },
})
