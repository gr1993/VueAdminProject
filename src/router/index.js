import Vue from 'vue';
import VueRouter from 'vue-router';
import MainView from '../views/Main.vue';

Vue.use(VueRouter);

const requireAuth = (returnPath) => (from, to, next) => {
  const { accessToken } = localStorage;

  let isAuthenticated = true;
  if (!accessToken || accessToken === 'undefined') {
    isAuthenticated = false;
  }

  if (isAuthenticated) return next();
  next(`/admin/view?returnPath=${returnPath}`);
};

const routes = [
  {
    path: '/',
    name: 'main',
    component: MainView,
    beforeEnter: requireAuth('/'),
    children: [
      {
        path: '/admin/code',
        name: 'code',
        component: () =>
          import(/* webpackChunkName: "about" */ '../views/Code.vue'),
        beforeEnter: requireAuth('/admin/code'),
      },
      {
        path: '/admin/user',
        name: 'user',
        component: () =>
          import(/* webpackChunkName: "about" */ '../views/User.vue'),
        beforeEnter: requireAuth('/admin/user'),
      },
      {
        path: '/admin/holeinone/reward',
        name: 'holeInOneReward',
        component: () =>
          import(
            /* webpackChunkName: "about" */ '../views/HoleInOneReward.vue'
          ),
        beforeEnter: requireAuth('/admin/holeinone/reward'),
      },
      {
        path: '/admin/news',
        name: 'news',
        component: () =>
          import(/* webpackChunkName: "about" */ '../views/News.vue'),
        beforeEnter: requireAuth('/admin/news'),
      },
    ],
  },
  {
    path: '/admin/view',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/Login.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
