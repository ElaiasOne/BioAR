<template>
  <div v-if="loading" class="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
    Cargando perfil de BioAR...
  </div>
  <div v-else-if="error" class="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
    <h2 class="text-2xl font-bold text-white mb-2">Perfil no encontrado</h2>
    <p class="text-sm text-slate-400 mb-4">{{ error }}</p>
    <router-link to="/login" class="btn-primary text-xs">Crear mi propio BioAR</router-link>
  </div>
  <div v-else class="public-bio-wrapper min-h-screen flex justify-center py-6 px-4" :style="{ backgroundColor: design.background_color || '#0f172a' }">
    <div class="max-w-md w-full glass-panel shadow-2xl overflow-hidden border border-white/10 rounded-3xl">
      <LivePreview 
        :profile="profile"
        :design="design"
        :blocks="blocks"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { api } from '../services/api';
import LivePreview from '../components/LivePreview.vue';

const route = useRoute();
const loading = ref(true);
const error = ref('');

const profile = ref({});
const design = ref({});
const blocks = ref([]);

async function loadProfile() {
  loading.value = true;
  error.value = '';
  const slug = route.params.slug || 'demo';
  try {
    const res = await api.getPublicProfile(slug);
    profile.value = res.user;
    design.value = res.settings;
    blocks.value = res.blocks;

    if (res.user.seo_title) {
      document.title = res.user.seo_title;
    }
  } catch (err) {
    error.value = err.message || 'El perfil solicitado no existe.';
  } finally {
    loading.value = false;
  }
}

onMounted(loadProfile);
watch(() => route.params.slug, loadProfile);
</script>
