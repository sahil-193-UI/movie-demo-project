<script setup>
  import companyLogo from '@/assets/default-logo.png';
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
          <div class="header__main--right__button">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>  
    </div>
  </header>
</template>

<style lang="scss" scoped src="./Header.scss" />