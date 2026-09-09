<template>
  <div class="glass-panel p-4 mb-4">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <PaletteIcon class="w-5 h-5 text-amber-400" />
        <h3 class="text-lg font-bold text-white">Diseño & Estilo</h3>
      </div>
      <span class="plan-badge" :class="userPlan">
        Plan {{ userPlan.toUpperCase() }}
      </span>
    </div>

    <div class="space-y-4">
      <!-- Fondo -->
      <div>
        <label class="block text-xs font-semibold text-gray-400 mb-1">Color de Fondo</label>
        <div class="flex gap-2">
          <input 
            v-model="design.background_color" 
            @input="emitChange"
            type="color" 
            class="h-10 w-12 rounded bg-slate-900 border border-slate-700 cursor-pointer"
          />
          <input 
            v-model="design.background_color" 
            @input="emitChange"
            type="text" 
            class="glass-input flex-1"
          />
        </div>
      </div>

      <!-- Tipografía -->
      <div>
        <label class="block text-xs font-semibold text-gray-400 mb-1">Tipografía / Fuente</label>
        <select v-model="design.font_family" @change="emitChange" class="glass-input">
          <option value="Inter">Inter (Limpia y Moderna)</option>
          <option value="Outfit">Outfit (Moderna & Artística)</option>
          <option value="Space Grotesk">Space Grotesk (Futurista)</option>
        </select>
      </div>

      <!-- Estilo de Botón (Opciones Plus desbloqueadas) -->
      <div>
        <div class="flex items-center justify-between mb-1">
          <label class="text-xs font-semibold text-gray-400">Estilo de Botones</label>
          <span v-if="userPlan === 'free'" class="text-xs text-amber-400 font-semibold flex items-center gap-1">
            <LockIcon class="w-3 h-3" /> Plus
          </span>
        </div>
        <select 
          v-model="design.button_style" 
          @change="onButtonStyleChange" 
          class="glass-input"
        >
          <option value="rounded">Bordes Redondeados (Estándar)</option>
          <option value="pill" :disabled="userPlan === 'free'">Píldora / Curvado Completo (Plus)</option>
          <option value="shadow" :disabled="userPlan === 'free'">Sombra Neón / Glow (Plus)</option>
          <option value="glass" :disabled="userPlan === 'free'">Glassmorphism Transparente (Plus)</option>
        </select>
      </div>

      <!-- Color de Botones -->
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="block text-xs font-semibold text-gray-400 mb-1">Color del Botón</label>
          <input 
            v-model="design.button_color" 
            @input="emitChange"
            type="color" 
            class="h-9 w-full rounded bg-slate-900 border border-slate-700 cursor-pointer"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-400 mb-1">Texto del Botón</label>
          <input 
            v-model="design.button_text_color" 
            @input="emitChange"
            type="color" 
            class="h-9 w-full rounded bg-slate-900 border border-slate-700 cursor-pointer"
          />
        </div>
      </div>

      <!-- Quitar Marca de Agua BioAR (Solo Plus) -->
      <div class="pt-2 border-t border-slate-800 flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-white block">Mostrar marca "BioAR"</span>
          <span class="text-xs text-slate-400 block">En plan Free se mantiene visible</span>
        </div>
        <input 
          type="checkbox" 
          v-model="design.show_branding" 
          :disabled="userPlan === 'free'"
          @change="onBrandingToggle"
          class="w-4 h-4 accent-blue-500"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';
import { Palette as PaletteIcon, Lock as LockIcon } from 'lucide-vue-next';

const props = defineProps({
  userPlan: { type: String, default: 'free' },
  initialDesign: {
    type: Object,
    default: () => ({
      background_color: '#09090b',
      font_family: 'Inter',
      button_style: 'rounded',
      button_color: '#18181b',
      button_text_color: '#ffffff',
      show_branding: true
    })
  }
});

const emit = defineEmits(['update', 'requestUpgrade']);

const design = reactive({ ...props.initialDesign });

watch(() => props.initialDesign, (newVal) => {
  Object.assign(design, newVal);
}, { deep: true });

function onButtonStyleChange() {
  if (props.userPlan === 'free' && design.button_style !== 'rounded') {
    design.button_style = 'rounded';
    emit('requestUpgrade', 'Los estilos de botones avanzados requieren el Plan PLUS.');
    return;
  }
  emitChange();
}

function onBrandingToggle() {
  if (props.userPlan === 'free') {
    design.show_branding = true;
    emit('requestUpgrade', 'Eliminar la marca BioAR requiere el Plan PLUS.');
    return;
  }
  emitChange();
}


let timeout = null;
function emitChange() {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    emit('update', { ...design });
  }, 300);
}
</script>
