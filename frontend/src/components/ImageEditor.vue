<template>
  <div class="glass-panel p-4 mb-4">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <ImageIcon class="w-5 h-5 text-amber-400" />
        <h3 class="text-lg font-bold text-white">Bloque: Imagen / Banner</h3>
      </div>
      <button v-if="blockId" @click="$emit('delete', blockId)" class="btn-danger text-xs">
        Eliminar
      </button>
    </div>

    <div class="space-y-3">
      <div>
        <label class="block text-xs font-semibold text-gray-400 mb-1">Imagen / Banner</label>
        <div class="flex items-center gap-2">
          <input 
            v-model="imageContent.imageUrl" 
            @input="emitChange"
            type="text" 
            placeholder="URL de la imagen o sube un archivo"
            class="glass-input flex-1"
          />
          <label class="file-upload-label">
            <UploadIcon class="w-3.5 h-3.5" />
            <span>{{ uploading ? 'Subiendo...' : 'Adjuntar Imagen' }}</span>
            <input type="file" accept="image/*" class="hidden-file-input" @change="handleFileUpload" :disabled="uploading" />
          </label>
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-400 mb-1">Leyenda / Pie de Imagen (Opcional)</label>
        <input 
          v-model="imageContent.caption" 
          @input="emitChange"
          type="text" 
          placeholder="Ej: Foto promocional o descripción corta"
          class="glass-input"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref } from 'vue';
import { Image as ImageIcon, Upload as UploadIcon } from 'lucide-vue-next';
import { api } from '../services/api';

const props = defineProps({
  blockId: [Number, String],
  initialContent: {
    type: Object,
    default: () => ({ imageUrl: '', caption: '' })
  }
});

const emit = defineEmits(['update', 'delete']);

const uploading = ref(false);
const imageContent = reactive({ ...props.initialContent });

watch(() => props.initialContent, (newVal) => {
  Object.assign(imageContent, newVal);
}, { deep: true });

async function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  uploading.value = true;
  try {
    const res = await api.uploadImage(file);
    imageContent.imageUrl = res.url;
    emitChange();
  } catch (err) {
    alert(err.message || 'Error al subir la imagen.');
  } finally {
    uploading.value = false;
  }
}

let timeout = null;
function emitChange() {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    emit('update', { id: props.blockId, content: { ...imageContent } });
  }, 300);
}
</script>
