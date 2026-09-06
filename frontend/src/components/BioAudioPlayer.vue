<template>
  <div v-if="resolvedSrc" class="bio-audio-player">
    <button 
      type="button" 
      @click.prevent.stop="togglePlay" 
      class="audio-play-btn"
      :title="isPlaying ? 'Pausar adelanto' : 'Reproducir adelanto'"
    >
      <PauseIcon v-if="isPlaying" class="w-4 h-4" />
      <PlayIcon v-else class="w-4 h-4" />
    </button>
    
    <div class="audio-info">
      <div class="flex items-center justify-between text-[10px] text-zinc-300 font-semibold mb-0.5">
        <span class="flex items-center gap-1">
          <MusicIcon class="w-3 h-3 text-zinc-400" />
          Adelanto (15s)
        </span>
        <span>{{ formatTime(currentTime) }} / {{ formatTime(maxLimit) }}</span>
      </div>
      <div class="audio-bar-wrapper" @click.prevent.stop="seek">
        <div class="audio-bar-progress" :style="{ width: progressPercent + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';
import { Play as PlayIcon, Pause as PauseIcon, Music as MusicIcon } from 'lucide-vue-next';
import { resolveImageUrl } from '../services/api';

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  maxSeconds: {
    type: Number,
    default: 15
  }
});

const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
let audio = null;

const resolvedSrc = computed(() => resolveImageUrl(props.src));

const maxLimit = computed(() => {
  if (duration.value > 0) {
    return Math.min(duration.value, props.maxSeconds);
  }
  return props.maxSeconds;
});

const progressPercent = computed(() => {
  if (maxLimit.value <= 0) return 0;
  return Math.min(100, (currentTime.value / maxLimit.value) * 100);
});

function initAudio() {
  if (audio) {
    audio.pause();
    audio = null;
  }
  if (!resolvedSrc.value) return;

  audio = new Audio(resolvedSrc.value);

  audio.addEventListener('loadedmetadata', () => {
    duration.value = audio.duration || 0;
  });

  audio.addEventListener('timeupdate', () => {
    currentTime.value = audio.currentTime;
    if (audio.currentTime >= maxLimit.value) {
      pauseAudio();
      audio.currentTime = 0;
      currentTime.value = 0;
    }
  });

  audio.addEventListener('ended', () => {
    pauseAudio();
    currentTime.value = 0;
  });

  audio.addEventListener('error', () => {
    pauseAudio();
  });
}

function togglePlay() {
  if (!audio) initAudio();
  if (!audio) return;

  if (isPlaying.value) {
    pauseAudio();
  } else {
    audio.play().then(() => {
      isPlaying.value = true;
    }).catch(err => {
      console.warn('Error reproducir audio:', err);
      isPlaying.value = false;
    });
  }
}

function pauseAudio() {
  if (audio) {
    audio.pause();
  }
  isPlaying.value = false;
}

function seek(e) {
  if (!audio) initAudio();
  if (!audio) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;
  const percentage = Math.max(0, Math.min(1, clickX / width));
  const newTime = percentage * maxLimit.value;
  audio.currentTime = newTime;
  currentTime.value = newTime;
}

function formatTime(secs) {
  const s = Math.floor(secs || 0);
  const m = Math.floor(s / 60);
  const remS = s % 60;
  return `${m}:${remS < 10 ? '0' : ''}${remS}`;
}

watch(() => props.src, () => {
  pauseAudio();
  initAudio();
});

onUnmounted(() => {
  pauseAudio();
});
</script>
