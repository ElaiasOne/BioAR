<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-slate-950">
    <div class="glass-panel p-8 max-w-md w-full border border-slate-800 shadow-2xl">
      <div class="text-center mb-6">
        <h1 class="text-3xl font-extrabold text-white mb-2 tracking-tight">
          <span class="brand-logo-text text-3xl">Bio<span class="brand-logo-accent">AR</span></span>
        </h1>
        <p class="text-xs text-slate-400">Crea tu página oficial de Link in Bio gratis</p>
      </div>

      <div v-if="error" class="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300 text-xs">
        {{ error }}
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Nombre o Marca / Título Visible</label>
          <input 
            v-model="displayName" 
            type="text" 
            required 
            placeholder="Ej: Alex Rivera / Tu Marca" 
            class="glass-input"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">URL Personalizada (Slug)</label>
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-400 font-mono">bioar.me/</span>
            <input 
              v-model="slug" 
              type="text" 
              required 
              placeholder="alexrivera" 
              class="glass-input flex-1 font-mono text-blue-300"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico</label>
          <input 
            v-model="email" 
            type="email" 
            required 
            placeholder="contacto@ejemplo.com" 
            class="glass-input"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Contraseña</label>
          <input 
            v-model="password" 
            type="password" 
            required 
            placeholder="••••••••" 
            class="glass-input"
          />
        </div>

        <button type="submit" :disabled="loading" class="btn-primary w-full justify-center py-2.5">
          {{ loading ? 'Creando Cuenta...' : 'Crear mi BioAR Gratis' }}
        </button>
      </form>

      <div class="mt-6 pt-4 border-t border-slate-800 text-center">
        <p class="text-xs text-slate-400">
          ¿Ya tienes una cuenta? 
          <router-link to="/login" class="text-blue-400 hover:underline font-bold">Inicia Sesión</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const displayName = ref('');
const slug = ref('');
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const router = useRouter();
const authStore = useAuthStore();

async function handleRegister() {
  error.value = '';
  loading.value = true;
  try {
    await authStore.register(email.value, password.value, slug.value, displayName.value);
    router.push('/dashboard');
  } catch (err) {
    error.value = err.message || 'Error al registrar la cuenta.';
  } finally {
    loading.value = false;
  }
}
</script>
