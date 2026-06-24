import { createRouter, createWebHashHistory } from 'vue-router'
import store from './store/index.js'
import HomeView      from './views/HomeView.vue'
import DetalleView   from './views/DetalleView.vue'
import LoginView     from './views/LoginView.vue'
import FavoritosView from './views/FavoritosView.vue'
import PreferenciasView from './views/PreferenciasView.vue'

const routes = [
  { path: '/',             name: 'home',         component: HomeView },
  { path: '/planeta/:id',  name: 'detalle',      component: DetalleView },
  { path: '/login',        name: 'login',        component: LoginView },
  { path: '/favoritos',    name: 'favoritos',    component: FavoritosView,    meta: { requiereAuth: true } },
  { path: '/preferencias', name: 'preferencias', component: PreferenciasView, meta: { requiereAuth: true } },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiereAuth && !store.state.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
