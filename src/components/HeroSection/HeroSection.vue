<script setup>
  import placeholderImage from '@/assets/images/placeholder.png'
</script>

<template>
  <section class="hero__main">
    <div class="container height__100">
      <div class="hero__main--content">
        <div class="hero__main--content__image">
          <img :src="placeholderImage" alt="placeholder" />
        </div>
        <div class="hero__main--content__heading">
          <h1 class="font__weight--600 font__white">Movies for everyone</h1>
        </div>
        <div class="hero__main--content__description">
          <p class="font__white">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy</p>
        </div>
        <div class="hero__main--content__buttons">
          <button class="bg__white font__blue text__uppercase font__weight--700">Download Now</button>
          <button class="bg__blue font__white text__uppercase font__weight--700">Download Now</button>
        </div>
      </div>
    </div>
  </section>  
</template>

<style lang="scss" src="./HeroSection.scss" scoped />
