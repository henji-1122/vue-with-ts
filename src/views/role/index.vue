<template>
  <div>
    <role-list></role-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import roleList from './components/List.vue'

export default Vue.extend({
  name: 'roleIndex',

  components: {
    roleList
  }
})
</script>

<style lang="scss" scoped></style>
