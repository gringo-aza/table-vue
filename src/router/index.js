import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/login',
    name: 'login',
    components: {
      Default: () => import('@/views/AuthPage.vue'),
    },
    meta: {
      auth: true,
      permission: true,
    },
  },
  {
    path: '/home',
    name: 'home',
    components: {
      Navbar: () => import('@/components/Navbar.vue'),
      Default: () => import('@/views/HomeView.vue'),
      Footer: () => import('@/components/Footer.vue'),
    },
    meta: {
      auth: true,
      permission: true,
    },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
