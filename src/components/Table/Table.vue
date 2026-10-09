<script setup>
  defineProps({
    columns: {
      type: Array,
      required: true
    },

    data: {
      type: Array,
      required: true
    },

    loading: {
      type: Boolean,
      default: false
    }
  })
</script>

<template>
  <div class="table__container">
    <table class="table__wrapper">
      <thead class="table__head">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
          >
            {{ column.label }}
          </th>
          <th v-if="$slots.actions">
            Actions
          </th>
        </tr>
      </thead>

      <tbody class="table__body">

        <!-- Loading -->
        <tr v-if="loading">
          <td
            :colspan="columns.length"
            class="center"
          >
            Loading...
          </td>
        </tr>

        <!-- No data -->
        <tr v-else-if="data.length === 0">
          <td
            :colspan="columns.length"
            class="center"
          >
            No users found
          </td>
        </tr>

        <!-- Data -->
        <tr
          v-else
          v-for="(row, index) in data"
          :key="row._id || row.id || index"
        >
          <td
            v-for="column in columns"
            :key="column.key"
          >
            {{ row[column.key] }}
          </td>
          <td v-if="$slots.actions">
            <slot
              name="actions"
              :row="row"
            />
          </td>
        </tr>

      </tbody>

    </table>
  </div>
</template>

<style lang="scss" src="./Table.scss" scoped />
