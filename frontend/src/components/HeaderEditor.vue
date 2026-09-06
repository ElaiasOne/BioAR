<template>
  <div class="glass-panel p-4 mb-4">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-lg font-bold text-white flex items-center gap-2">
        <UserIcon class="w-5 h-5 text-blue-400" />
        Perfil de Usuario / Cabecera
      </h3>
    </div>
    
    <div class="space-y-3">
      <div>
        <label class="block text-xs font-semibold text-gray-400 mb-1">Nombre o Marca / Nombre Visible</label>
        <input 
          v-model="profile.display_name" 
          @input="emitChange"
          type="text" 
          placeholder="Ej: Alex Rivera / Tu Marca"
          class="glass-input"
        />
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-400 mb-1">Imagen de Perfil / Avatar</label>
        <div class="flex items-center gap-2">
          <input 
            v-model="profile.avatar_url" 
            @input="emitChange"
            type="text" 
            placeholder="URL de la foto o sube un archivo"
            class="glass-input flex-1"
          />
          <label class="file-upload-label">
            <UploadIcon class="w-3.5 h-3.5" />
            <span>{{ uploading ? 'Subiendo...' : 'Adjuntar Foto' }}</span>
            <input type="file" accept="image/*" class="hidden-file-input" @change="handleFileUpload" :disabled="uploading" />
          </label>
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-400 mb-1">Biografía Corta / Subtítulo</label>
        <textarea 
          v-model="profile.bio_text" 
          @input="emitChange"
          rows="2"
          placeholder="Ej: Creador de Contenido & Emprendedor | Conoce mis proyectos aquí"
          class="glass-input resize-none"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref } from 'vue';
import { User as UserIcon, Upload as UploadIcon } from 'lucide-vue-next';
import { api } from '../services/api';

const props = defineProps({
  initialProfile: {
    type: Object,
    default: () => ({ display_name: '', avatar_url: '', bio_text: '' })
  }
});

const emit = defineEmits(['update']);

const uploading = ref(false);
const profile = reactive({
  display_name: props.initialProfile.display_name || '',
  avatar_url: props.initialProfile.avatar_url || '',
  bio_text: props.initialProfile.bio_text || ''
});

watch(() => props.initialProfile, (newVal) => {
  profile.display_name = newVal.display_name || '';
  profile.avatar_url = newVal.avatar_url || '';
  profile.bio_text = newVal.bio_text || '';
}, { deep: true });

async function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  uploading.value = true;
  try {
    const res = await api.uploadImage(file);
    profile.avatar_url = res.url;
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
    emit('update', { ...profile });
  }, 300);
}
</script>
