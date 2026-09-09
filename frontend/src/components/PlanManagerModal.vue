<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content glass-panel p-6 max-w-lg w-full">
      <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <ZapIcon class="w-6 h-6 text-amber-400" />
            Planes BioAR
          </h2>
          <p class="text-xs text-slate-400">Paga de forma simple y segura en Pesos Argentinos (ARS)</p>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-white font-bold text-lg">
          ✕
        </button>
      </div>

      <div v-if="reason" class="mb-4 p-3 bg-amber-500/20 border border-amber-500/40 rounded-lg text-amber-200 text-xs flex items-center gap-2">
        <AlertCircleIcon class="w-4 h-4 shrink-0" />
        <span>{{ reason }}</span>
      </div>

      <div v-if="errorMessage" class="mb-4 p-3 bg-rose-500/20 border border-rose-500/40 rounded-lg text-rose-200 text-xs flex items-center gap-2">
        <AlertCircleIcon class="w-4 h-4 shrink-0" />
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Cuadrícula de 2 Planes (FREE y PLUS) -->
      <div class="grid grid-cols-2 gap-4 mb-5">
        <!-- Plan Free -->
        <div 
          class="bg-slate-900/90 p-5 rounded-xl border transition-all relative flex flex-col justify-between"
          :class="currentPlan === 'free' ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-slate-800'"
        >
          <div>
            <span class="plan-badge free mb-2 inline-block">FREE</span>
            <h4 class="text-xl font-bold text-white mb-2">$0 <span class="text-xs font-normal text-slate-400">ARS / mes</span></h4>
            <ul class="text-xs text-slate-300 space-y-2 mb-6">
              <li>✓ Enlace bioar.me/tu-nombre</li>
              <li>✓ Máximo 3 Bloques</li>
              <li>✓ Temas y Botones Básicos</li>
              <li class="text-slate-400">✗ Marca BioAR en Footer</li>
              <li class="text-slate-500 opacity-60">✗ Sin Analíticas de Visitas</li>
            </ul>
          </div>
          <button 
            @click="selectPlan('free')" 
            :disabled="currentPlan === 'free' || loadingPlan !== null"
            class="btn-secondary w-full justify-center text-xs py-2.5"
          >
            {{ currentPlan === 'free' ? 'Plan Actual' : 'Cambiar a Free' }}
          </button>
        </div>

        <!-- Plan Plus (Recomendado) -->
        <div 
          class="bg-slate-900/90 p-5 rounded-xl border transition-all relative flex flex-col justify-between"
          :class="currentPlan === 'plus' || currentPlan === 'pro' ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-rose-500/60 shadow-lg shadow-rose-500/10'"
        >
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
            Recomendado
          </div>
          <div>
            <span class="plan-badge plus mb-2 inline-block">PLUS</span>
            <h4 class="text-xl font-bold text-white mb-2">$4.999 <span class="text-xs font-normal text-slate-400">ARS / mes</span></h4>
            <ul class="text-xs text-slate-200 space-y-2 mb-6 font-medium">
              <li>✓ Enlace bioar.me/tu-nombre</li>
              <li>✓ <strong class="text-white">Bloques Ilimitados</strong></li>
              <li>✓ <strong class="text-white">Estilos y Colores Pro</strong></li>
              <li>✓ <strong class="text-white">Sin Marca BioAR</strong></li>
              <li>✓ <strong class="text-white">Analíticas de Visitas</strong></li>
              <li>✓ Soporte Prioritario</li>
            </ul>
          </div>
          <button 
            @click="selectPlan('plus')" 
            :disabled="currentPlan === 'plus' || currentPlan === 'pro' || loadingPlan !== null"
            class="btn-primary w-full justify-center text-xs py-2.5 gap-1.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500"
          >
            <span v-if="loadingPlan === 'plus'">Cargando...</span>
            <span v-else-if="currentPlan === 'plus' || currentPlan === 'pro'">Plan Actual</span>
            <span v-else class="flex items-center gap-1 font-semibold">
              <span>Pagar con</span>
              <span class="font-black text-sky-300 ml-1">Mercado Pago</span>
            </span>
          </button>

        </div>
      </div>

      <div class="text-center pt-3 border-t border-slate-800">
        <p class="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          🔒 Pagos 100% seguros procesados en Pesos Argentinos por Mercado Pago.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Zap as ZapIcon, AlertCircle as AlertCircleIcon } from 'lucide-vue-next';
import { api } from '../services/api';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  currentPlan: { type: String, default: 'free' },
  reason: { type: String, default: '' }
});

const emit = defineEmits(['close', 'upgrade']);

const loadingPlan = ref(null);
const errorMessage = ref('');

async function selectPlan(plan) {
  errorMessage.value = '';
  
  if (plan === 'free') {
    emit('upgrade', 'free');
    emit('close');
    return;
  }

  try {
    loadingPlan.value = plan;
    const res = await api.createPaymentPreference(plan);
    if (res && res.init_point) {
      window.location.href = res.init_point;
    } else {
      throw new Error('No se obtuvo el enlace de pago de Mercado Pago.');
    }
  } catch (err) {
    errorMessage.value = err.message || 'Error al iniciar la pasarela de pago.';
  } finally {
    loadingPlan.value = null;
  }
}
</script>

