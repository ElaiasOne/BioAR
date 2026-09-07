<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-slate-950">
    <div class="glass-panel p-8 max-w-md w-full border border-slate-800 shadow-2xl">
      <div class="text-center mb-6">
        <h1 class="text-3xl font-extrabold text-white mb-2 tracking-tight">
          <span class="brand-logo-text text-3xl">Bio<span class="brand-logo-accent">AR</span></span>
        </h1>
        <p class="text-xs text-slate-400">Inicia sesión en tu panel de control</p>
      </div>

      <div v-if="error" class="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300 text-xs">
        {{ error }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico</label>
          <input 
            v-model="email" 
            type="email" 
            required 
            placeholder="tu@email.com" 
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
          {{ loading ? 'Iniciando Sesión...' : 'Ingresar a mi BioAR' }}
        </button>
      </form>

      <div class="mt-6 pt-4 border-t border-slate-800 text-center">
        <p class="text-xs text-slate-400">
          ¿No tienes una cuenta aún? 
          <router-link to="/register" class="text-blue-400 hover:underline font-bold">Regístrate Gratis</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const router = useRouter();
const authStore = useAuthStore();

async function handleLogin() {
  error.value = '';
  loading.value = true;
  try {
    await authStore.login(email.value, password.value);
    router.push('/dashboard');
  } catch (err) {
    error.value = err.message || 'Credenciales inválidas.';
  } finally {
    loading.value = false;
  }
}
</script>
