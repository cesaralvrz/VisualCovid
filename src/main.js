import Vue from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import VueRouter from 'vue-router'
import Routes from './routes'

Vue.use(VueRouter);


const router = new VueRouter({
  routes: Routes,
  mode: 'history',

  // Volver a la parte superior al cambiar de ruta
  scrollBehavior () {
    return { x: 0, y: 0 }
  }
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router: router
}).$mount('#app')
