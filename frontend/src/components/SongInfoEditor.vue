<template>
  <div class="glass-panel p-4 mb-4">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <SparklesIcon class="w-5 h-5 text-purple-400" />
        <h3 class="text-lg font-bold text-white">Bloque: Enlace Destacado / Novedad</h3>
      </div>
      <button v-if="blockId" @click="$emit('delete', blockId)" class="btn-danger text-xs">
        Eliminar
      </button>
    </div>

    <div class="space-y-3">
      <div>
        <label class="block text-xs font-semibold text-gray-400 mb-1">Título del Contenido / Novedad</label>
        <input 
          v-model="song.title" 
          @input="emitChange"
          type="text" 
          placeholder="Ej: Proyecto Destacado / Mi Nuevo Lanzamiento"
          class="glass-input"
        />
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-400 mb-1">Subtítulo / Categoria / Año</label>
        <input 
          v-model="song.subtitle" 
          @input="emitChange"
          type="text" 
          placeholder="Ej: Novedades 2026 / Edición Especial"
          class="glass-input"
        />
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-400 mb-1">Imagen de Portada / Banner</label>
        <div class="flex items-center gap-2">
          <input 
            v-model="song.coverUrl" 
            @input="emitChange"
            type="text" 
            placeholder="URL de la imagen o sube un archivo"
            class="glass-input flex-1"
          />
          <label class="file-upload-label">
            <UploadIcon class="w-3.5 h-3.5" />
            <span>{{ uploading ? 'Subiendo...' : 'Adjuntar Portada' }}</span>
            <input type="file" accept="image/*" class="hidden-file-input" @change="handleFileUpload" :disabled="uploading" />
          </label>
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-400 mb-1">Audio de Adelanto (MP3 / Audio Preview 15s)</label>
        <div class="flex items-center gap-2">
          <input 
            v-model="song.audioUrl" 
            @input="emitChange"
            type="text" 
            placeholder="URL de audio o sube un archivo (MP3, WAV, M4A)"
            class="glass-input flex-1"
          />
          <label class="file-upload-label audio-upload">
            <MusicIcon class="w-3.5 h-3.5" />
            <span>{{ uploadingAudio ? 'Subiendo...' : 'Adjuntar Audio' }}</span>
            <input type="file" accept="audio/*" class="hidden-file-input" @change="handleAudioUpload" :disabled="uploadingAudio" />
          </label>
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-400 mb-1">Descripción Breve</label>
        <input 
          v-model="song.description" 
          @input="emitChange"
          type="text" 
          placeholder="Ej: Accede a toda la información de mi contenido principal."
          class="glass-input"
        />
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="block text-xs font-semibold text-gray-400 mb-1">Texto del Botón</label>
          <input 
            v-model="song.actionText" 
            @input="emitChange"
            type="text" 
            placeholder="Ej: Ver Más Información / Ir al Sitio"
            class="glass-input"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-400 mb-1">Enlace Principal (URL)</label>
          <input 
            v-model="song.actionUrl" 
            @input="emitChange"
            type="text" 
            placeholder="https://..."
            class="glass-input"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref } from 'vue';
import { Sparkles as SparklesIcon, Upload as UploadIcon, Music as MusicIcon } from 'lucide-vue-next';
import { api } from '../services/api';

const props = defineProps({
  blockId: [Number, String],
  initialContent: {
    type: Object,
    default: () => ({
      title: 'Proyecto Destacado',
      subtitle: 'Novedades 2026',
      coverUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
      audioUrl: '',
      description: 'Haz clic para acceder al contenido principal.',
      actionUrl: 'https://bioar.me',
      actionText: 'Ver Más Información'
    })
  }
});

const emit = defineEmits(['update', 'delete']);

const uploading = ref(false);
const uploadingAudio = ref(false);
const song = reactive({ ...props.initialContent });

watch(() => props.initialContent, (newVal) => {
  Object.assign(song, newVal);
}, { deep: true });

async function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  uploading.value = true;
  try {
    const res = await api.uploadImage(file);
    song.coverUrl = res.url;
    emitChange();
  } catch (err) {
    alert(err.message || 'Error al subir la imagen.');
  } finally {
    uploading.value = false;
  }
}

async function handleAudioUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  uploadingAudio.value = true;
  try {
    const res = await api.uploadImage(file);
    song.audioUrl = res.url;
    emitChange();
  } catch (err) {
    alert(err.message || 'Error al subir el archivo de audio.');
  } finally {
    uploadingAudio.value = false;
  }
}

let timeout = null;
function emitChange() {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    emit('update', { id: props.blockId, content: { ...song } });
  }, 300);
}
</script>
