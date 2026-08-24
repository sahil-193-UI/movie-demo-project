<script setup>
  import { useRoute } from 'vue-router'
  import Header from '@/components/Header/Header.vue'
  import SideBar from '@/components/SideBar/SideBar.vue'
  import { ref } from 'vue'

  const route = useRoute()
  const isSidebarOpen = ref(false)
</script>

<template>
  <template v-if="route.path !== '/login' && route.path !== '/sign-up' && route.path !== '/forgot-password'">
    <Header v-model:isOpen="isSidebarOpen" />
    <SideBar v-model:isOpen="isSidebarOpen" />
  </template>
  <router-view />
</template>
