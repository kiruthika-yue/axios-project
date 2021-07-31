import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async(to, from, next) => {
  if (!store.state.initialized) {
    await store.dispatch("initialize");
  }
  if (to.path !== '/login') {
    if (store.state.user.login_name) {
      next();
    }
  }
  next();
});

export default router;
