// Pinia Store para Gestión del Estado de BioAR (Bloques, Perfil y Diseño)
import { defineStore } from 'pinia';
import { api } from '../services/api';
import { useAuthStore } from './authStore';

export const useBioStore = defineStore('bio', {
  state: () => ({
    userProfile: {
      display_name: '',
      avatar_url: '',
      bio_text: '',
      custom_slug: '',
      seo_title: '',
      seo_description: ''
    },
    designSettings: {
      background_color: '#09090b',
      background_type: 'solid',
      text_color: '#ffffff',
      button_style: 'rounded',
      button_color: '#18181b',
      button_text_color: '#ffffff',
      font_family: 'Inter',
      show_branding: true
    },
    blocks: [],
    loading: false,
    error: null,
    showUpgradeModal: false,
    upgradeModalReason: ''
  }),
  actions: {
    async loadDashboardData() {
      this.loading = true;
      this.error = null;
      try {
        const authStore = useAuthStore();
        if (authStore.user) {
          this.userProfile = { ...authStore.user };
        }

        const [blocksRes, designRes] = await Promise.all([
          api.getBlocks(),
          api.getDesign()
        ]);

        this.blocks = blocksRes.blocks;
        this.designSettings = designRes.settings;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async createBlock(type, content) {
      try {
        const res = await api.createBlock(type, content);
        this.blocks.push(res.block);
        return res;
      } catch (err) {
        if (err.requiresUpgrade) {
          this.upgradeModalReason = err.message;
          this.showUpgradeModal = true;
        }
        throw err;
      }
    },
    async updateBlock(id, content) {
      await api.updateBlock(id, content);
      const idx = this.blocks.findIndex(b => b.id === id);
      if (idx !== -1) {
        this.blocks[idx].content = content;
      }
    },
    async deleteBlock(id) {
      await api.deleteBlock(id);
      this.blocks = this.blocks.filter(b => b.id !== id);
    },
    async reorderBlocks(orderedIds) {
      // Reordenar en frontend primero para responsiveness rápida
      const map = new Map(this.blocks.map(b => [b.id, b]));
      this.blocks = orderedIds.map(id => map.get(id)).filter(Boolean);
      await api.reorderBlocks(orderedIds);
    },
    async updateDesign(newDesign) {
      this.designSettings = { ...this.designSettings, ...newDesign };
      await api.updateDesign(this.designSettings);
    },
    async updateProfile(newProfile) {
      this.userProfile = { ...this.userProfile, ...newProfile };
      await api.updateProfile(this.userProfile);

      const authStore = useAuthStore();
      if (authStore.user) {
        authStore.user = { ...authStore.user, ...this.userProfile };
        localStorage.setItem('bioar_user', JSON.stringify(authStore.user));
      }
    }
  }
});
