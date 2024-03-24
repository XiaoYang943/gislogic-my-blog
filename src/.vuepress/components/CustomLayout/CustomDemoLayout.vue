<template>
  <div>
    <Navbar></Navbar>
    <div class="main">test</div>
  </div>
</template>

<script setup>
import Navbar from "vuepress-theme-hope/modules/navbar/components/Navbar.js"
</script>

<style scoped>
.main {
  margin-top: var(--navbar-height);
}
</style>