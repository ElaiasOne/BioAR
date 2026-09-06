// Pinia Store para Gestión de Estado de Autenticación y Plan
import { defineStore } from 'pinia';
import { api } from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('bioar_user') || 'null'),
    token: localStorage.getItem('bioar_token') || null,
    loading: false,
    error: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    userPlan: (state) => state.user?.plan || 'free',
    userSlug: (state) => state.user?.custom_slug || ''
  },
  actions: {
    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.login(email, password);
        this.token = res.token;
        this.user = res.user;
        localStorage.setItem('bioar_token', res.token);
        localStorage.setItem('bioar_user', JSON.stringify(res.user));
        return res;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async register(email, password, slug, displayName) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.register(email, password, slug, displayName);
        this.token = res.token;
        this.user = res.user;
        localStorage.setItem('bioar_token', res.token);
        localStorage.setItem('bioar_user', JSON.stringify(res.user));
        return res;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async fetchMe() {
      if (!this.token) return;
      try {
        const res = await api.getMe();
        this.user = res.user;
        localStorage.setItem('bioar_user', JSON.stringify(res.user));
      } catch (err) {
        this.logout();
      }
    },
    async upgradePlan(targetPlan) {
      const res = await api.upgradePlan(targetPlan);
      if (this.user) {
        this.user.plan = targetPlan;
        localStorage.setItem('bioar_user', JSON.stringify(this.user));
      }
      return res;
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('bioar_token');
      localStorage.removeItem('bioar_user');
    }
  }
});
