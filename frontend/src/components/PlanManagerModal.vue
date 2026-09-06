<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content glass-panel p-6 max-w-xl w-full">
      <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <ZapIcon class="w-6 h-6 text-amber-400" />
            Planes y Suscripciones BioAR
          </h2>
          <p class="text-xs text-slate-400">Escala tu presencia artística con herramientas avanzadas</p>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-white font-bold text-lg">
          ✕
        </button>
      </div>

      <div v-if="reason" class="mb-4 p-3 bg-amber-500/20 border border-amber-500/40 rounded-lg text-amber-200 text-xs flex items-center gap-2">
        <AlertCircleIcon class="w-4 h-4 shrink-0" />
        <span>{{ reason }}</span>
      </div>

      <!-- Cuadrícula de Planes -->
      <div class="grid grid-cols-3 gap-3 mb-6">
        <!-- Plan Free -->
        <div 
          class="bg-slate-900/90 p-4 rounded-xl border transition-all relative flex flex-col justify-between"
          :class="currentPlan === 'free' ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-slate-800'"
        >
          <div>
            <span class="plan-badge free mb-2 inline-block">FREE</span>
            <h4 class="text-lg font-bold text-white mb-1">$0 <span class="text-xs font-normal text-slate-400">/ mes</span></h4>
            <ul class="text-xs text-slate-300 space-y-1.5 mb-4">
              <li>✓ Subdominio bioar.me</li>
              <li>✓ Máximo 3 Bloques</li>
              <li>✓ Diseño Predeterminado</li>
              <li>✗ Marca BioAR en Footer</li>
            </ul>
          </div>
          <button 
            @click="selectPlan('free')" 
            :disabled="currentPlan === 'free'"
            class="btn-secondary w-full justify-center text-xs"
          >
            {{ currentPlan === 'free' ? 'Plan Actual' : 'Cambiar a Free' }}
          </button>
        </div>

        <!-- Plan Pro (Recomendado) -->
        <div 
          class="bg-slate-900/90 p-4 rounded-xl border transition-all relative flex flex-col justify-between"
          :class="currentPlan === 'pro' ? 'border-purple-500 ring-2 ring-purple-500/30' : 'border-purple-500/60 shadow-lg shadow-purple-500/10'"
        >
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Popular
          </div>
          <div>
            <span class="plan-badge pro mb-2 inline-block">PRO</span>
            <h4 class="text-lg font-bold text-white mb-1">$4.99 <span class="text-xs font-normal text-slate-400">/ mes</span></h4>
            <ul class="text-xs text-slate-300 space-y-1.5 mb-4">
              <li>✓ Subdominio bioar.me</li>
              <li>✓ **Bloques Ilimitados**</li>
              <li>✓ **Estilos y Botones Pro**</li>
              <li>✓ **Sin Marca BioAR**</li>
            </ul>
          </div>
          <button 
            @click="selectPlan('pro')" 
            :disabled="currentPlan === 'pro'"
            class="btn-primary w-full justify-center text-xs"
          >
            {{ currentPlan === 'pro' ? 'Plan Actual' : 'Obtener Pro' }}
          </button>
        </div>

        <!-- Plan Plus -->
        <div 
          class="bg-slate-900/90 p-4 rounded-xl border transition-all relative flex flex-col justify-between"
          :class="currentPlan === 'plus' ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-slate-800'"
        >
          <div>
            <span class="plan-badge plus mb-2 inline-block">PLUS</span>
            <h4 class="text-lg font-bold text-white mb-1">$9.99 <span class="text-xs font-normal text-slate-400">/ mes</span></h4>
            <ul class="text-xs text-slate-300 space-y-1.5 mb-4">
              <li>✓ **Dominio CNAME Propio**</li>
              <li>✓ Bloques Ilimitados</li>
              <li>✓ **Analíticas Avanzadas**</li>
              <li>✓ Soporte Prioritario</li>
            </ul>
          </div>
          <button 
            @click="selectPlan('plus')" 
            :disabled="currentPlan === 'plus'"
            class="btn-secondary w-full justify-center text-xs"
          >
            {{ currentPlan === 'plus' ? 'Plan Actual' : 'Obtener Plus' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Zap as ZapIcon, AlertCircle as AlertCircleIcon } from 'lucide-vue-next';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  currentPlan: { type: String, default: 'free' },
  reason: { type: String, default: '' }
});

const emit = defineEmits(['close', 'upgrade']);

function selectPlan(plan) {
  emit('upgrade', plan);
  emit('close');
}
</script>
