<template>
  <div v-bind:key="index" v-for="(host, index) in hosts">
    <div class="text-start">
      <div class="fs-5 fw-bold">For the host: {{ host }}</div>
      <div class="py-2">Please select entity type:</div>
      <select class="form-select" v-model="selected">
        <option v-bind:key="index" v-for="(type, index) in types" :value="type">
          {{ type }}
        </option>
      </select>
      <div class="pt-3 pb-4">
        <input type="checkbox" id="forceImport" :value="host" v-model="force" />
        <label for="forceImport" class="px-2">Force import</label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ImportModalContent",
  props: {
    msg: String,
    hosts: [String],
  },
  data() {
    return {
      types: ["TypeEntity1", "TypeEntity2", "TypeEntity3"],
      selected: "",
      force: [],
    };
  },
});
</script>
