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

export default createStore({
  state: {
    usuario: null,
    isAuthenticated: false,
  },
  mutations: {
    SET_USUARIO(state, usuario) {
      state.usuario = usuario
      state.isAuthenticated = true
    },
    CERRAR_SESION(state) {
      state.usuario = null
      state.isAuthenticated = false
    },
    ACTUALIZAR_UNIDAD(state, unidad) {
      if (state.usuario) state.usuario.unidad = unidad
    },
    AGREGAR_FAVORITO(state, id) {
      if (state.usuario && !state.usuario.favoritos.includes(id)) {
        state.usuario.favoritos.push(id)
      }
    },
    ELIMINAR_FAVORITO(state, id) {
      if (state.usuario) {
        state.usuario.favoritos = state.usuario.favoritos.filter(f => f !== id)
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
