<script setup>
  import { computed } from 'vue'
  import { OhVueIcon, addIcons } from 'oh-vue-icons'
  import { PrAngleLeft, PrAngleRight } from 'oh-vue-icons/icons'

  addIcons(PrAngleLeft, PrAngleRight)

  const props = defineProps({
    currentPage: {
      type: Number,
      required: true
    },
    totalItems: {
      type: Number,
      required: true
    },
    pageSize: {
      type: Number,
      required: true
    },
    itemLabel: {
      type: String,
      default: 'items'
    }
  })

  const emit = defineEmits(['update:currentPage'])
  const pageCount = computed(() => Math.max(1, Math.ceil(props.totalItems / props.pageSize)))
  const pageNumbers = computed(() => {
    const firstPage = Math.max(1, props.currentPage - 1)
    const lastPage = Math.min(pageCount.value, props.currentPage + 1)

    return Array.from({ length: lastPage - firstPage + 1 }, (_, index) => firstPage + index)
  })

  const setPage = (page) => {
    if (page >= 1 && page <= pageCount.value) {
      emit('update:currentPage', page)
    }
  }
</script>

<template>
  <nav class="pagination" aria-label="Table pagination">
    <span class="pagination__summary">
      Showing {{ (currentPage - 1) * pageSize + 1 }}&hyphen;{{ Math.min(currentPage * pageSize, totalItems) }}
      of {{ totalItems }} {{ itemLabel }}
    </span>
    <div class="pagination__controls">
      <button
        type="button"
        :disabled="currentPage === 1"
        aria-label="Previous page"
        @click="setPage(currentPage - 1)"
      >
        <OhVueIcon name="pr-angle-left" />
      </button>

      <button
        v-for="page in pageNumbers"
        :key="page"
        type="button"
        :class="{ 'is-active': currentPage === page }"
        :aria-current="currentPage === page ? 'page' : undefined"
        :aria-label="`Page ${page}`"
        @click="setPage(page)"
      >
        {{ page }}
      </button>
      
      <button
        type="button"
        :disabled="currentPage === pageCount"
        aria-label="Next page"
        @click="setPage(currentPage + 1)"
      >
        <OhVueIcon name="pr-angle-right" />
      </button>
    </div>
  </nav>
</template>

<style lang="scss" src="./Pagination.scss" scoped />
