<script setup>
  defineProps({
    pageTitle: {
      type: String,
      default: 'Page Title Here',
    },

    backgroundImage: {
      type: String,
      default: ''
    }
  })
</script>

<template>
  <section class="title__main">
    <div
      class="title__inner"
      :style="{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none'
      }"
    >
      <h2 class="text__uppercase font__white font__weight--700">{{ pageTitle }}</h2>
    </div>
  </section>  
</template>

<style lang="scss" src="./SectionTitle.scss" />
