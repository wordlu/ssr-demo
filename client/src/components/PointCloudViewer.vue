<template>
  <div class="viewer">
    <img :src="imageSrc" alt="Point Cloud" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';

const imageSrc = ref<string | null>(null);

onMounted(() => {
  const eventSource = new EventSource('http://localhost:3000/events');

  eventSource.onmessage = (event) => {
    imageSrc.value = `data:image/png;base64,${event.data}`;
  };

  eventSource.onerror = () => {
    console.error('SSE connection error');
    eventSource.close();
  };

  onUnmounted(() => {
    eventSource.close();
  });
});
</script>

<style>
.viewer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #1e1e1e;
}
img {
  max-width: 100%;
  height: auto;
  border: 2px solid #fff;
}
</style>
