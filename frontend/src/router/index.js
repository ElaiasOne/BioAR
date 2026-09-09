// Configuración de Rutas de Vue Router para BioAR
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import DashboardView from '../views/DashboardView.vue';
import PublicBioView from '../views/PublicBioView.vue';
import AdminView from '../views/AdminView.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView, meta: { guest: true } },
  { path: '/register', component: RegisterView, meta: { guest: true } },
  { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/admin', component: AdminView, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/bio/:slug', component: PublicBioView },
  { path: '/:slug', component: PublicBioView } // Alias directo
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresAdmin && authStore.userSlug.toLowerCase() !== 'eliasfigueroa') {
    next('/dashboard');
  } else if (to.meta.guest && authStore.isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});


export default router;
