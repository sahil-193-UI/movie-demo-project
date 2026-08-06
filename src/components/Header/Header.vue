<script setup>
  import companyLogo from '@/assets/default-logo.png';
  
  const props = defineProps({
    isOpen: Boolean
  });

  const emit = defineEmits(['update:isOpen'])
</script>

<template>
  <header class="header__main">
    <div class="container">
      <div class="header__main--wrap">
        <div class="header__main--left">
          <RouterLink to="/" class="header__main--logo">    
            <img :src="companyLogo" alt="Company Logo" />
          </RouterLink>
        </div>
        <div class="header__main--right">
          <button class="header__main--right__button" @click="emit('update:isOpen', !isOpen)">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>  
    </div>
  </header>
</template>

<style lang="scss" scoped src="./Header.scss" />