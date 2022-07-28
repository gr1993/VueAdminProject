import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import store from './store'
import axios from 'axios'

Vue.config.productionTip = false

Vue.prototype.$axios = axios;
localStorage.hostname = 'https://admin.localhost/admin';

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
