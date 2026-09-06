<template>
  <div class="glass-panel p-4 mb-4">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <SettingsIcon class="w-5 h-5 text-cyan-400" />
        <h3 class="text-lg font-bold text-white">Configuración & SEO</h3>
      </div>
    </div>

    <div class="space-y-4">
      <!-- Subdominio / URL pública -->
      <div>
        <label class="block text-xs font-semibold text-gray-400 mb-1">Tu Enlace Personalizado (Slug)</label>
        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-400 font-mono">bioar.me/</span>
          <input 
            v-model="slug" 
            @input="emitProfileChange"
            type="text" 
            placeholder="tu-nombre"
            class="glass-input flex-1 font-mono text-blue-300"
          />
        </div>
        <p class="text-xs text-slate-500 mt-1">También accesible vía {username}.bioar.me</p>
      </div>

      <!-- SEO Meta Title -->
      <div>
        <label class="block text-xs font-semibold text-gray-400 mb-1">Título SEO (Buscadores)</label>
        <input 
          v-model="seoTitle" 
          @input="emitProfileChange"
          type="text" 
          placeholder="Ej: Alex Rivera | Enlaces & Proyectos Oficiales"
          class="glass-input"
        />
      </div>

      <!-- SEO Meta Description -->
      <div>
        <label class="block text-xs font-semibold text-gray-400 mb-1">Descripción SEO</label>
        <textarea 
          v-model="seoDescription" 
          @input="emitProfileChange"
          rows="2"
          placeholder="Ej: Todos los enlaces oficiales, proyectos, novedaes y redes de Alex Rivera."
          class="glass-input resize-none"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Settings as SettingsIcon } from 'lucide-vue-next';

const props = defineProps({
  initialSlug: { type: String, default: '' },
  initialSeoTitle: { type: String, default: '' },
  initialSeoDesc: { type: String, default: '' }
});

const emit = defineEmits(['update']);

const slug = ref(props.initialSlug);
const seoTitle = ref(props.initialSeoTitle);
const seoDescription = ref(props.initialSeoDesc);

watch(() => props.initialSlug, (val) => slug.value = val);
watch(() => props.initialSeoTitle, (val) => seoTitle.value = val);
watch(() => props.initialSeoDesc, (val) => seoDescription.value = val);

let timeout = null;
function emitProfileChange() {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    emit('update', {
      custom_slug: slug.value,
      seo_title: seoTitle.value,
      seo_description: seoDescription.value
    });
  }, 300);
}
</script>
