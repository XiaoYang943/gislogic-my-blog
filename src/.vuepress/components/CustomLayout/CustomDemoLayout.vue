<template>
  <div class="theme-container no-sidebar">
    <div >
      <Navbar/>
    </div>
    <div id="main-content" class="vp-project-home">
      <DemoLayout />
    </div>
  </div>
</template>

<script setup>
import Navbar from 'vuepress-theme-hope/modules/navbar/components/Navbar.js';
import DemoLayout from './DemoLayout.vue';
</script>

<style scoped>

</style>