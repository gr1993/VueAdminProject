import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';
import axios from 'axios';

import './assets/css/main.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.config.productionTip = false;

Vue.prototype.$axios = axios;

//const hostname = 'https://admin.localhost/admin';
const hostname = 'https://admin.longestgolf.com/admin';

Vue.prototype.hostname = hostname;
localStorage.hostname = hostname;

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
