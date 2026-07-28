<script setup>
  defineProps({
    itemNumber: {
      type: Number,
      default: 1,
    }
  })
</script>

<template>
  <div class="timeline-wrapper">
    <div 
      class="timeline-item"
      v-for="item in itemNumber" 
      :key="item"
    >
      <div class="animated-background">
        <div class="background-masker content-top"></div>
        <div class="background-masker content-first-end"></div>
        <div class="background-masker content-second-line"></div>
        <div class="background-masker content-second-end"></div>
        <div class="background-masker content-third-line"></div>
        <div class="background-masker content-third-end"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./CardPlaceholder.scss" scoped></style>