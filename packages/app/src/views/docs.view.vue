<template>
  <main :class="baseClass">
    <h2>{{ baseClass }}</h2>
    <router-view />
  </main>
</template>

<script setup lang="ts">
  const baseClass = 'docs';
</script>

<style lang="scss" scoped></style>
