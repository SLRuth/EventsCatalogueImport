<template>
  <div class="mb-3" v-bind:key="index" v-for="(type, index) in host.entities">
    <label
      for="formFile"
      class="form-label text-start fw-bold fs-5 w-100"
    >Please select the {{ type }}s file...</label>
    <input class="form-control" accept=".csv" type="file" @change="processFile" id="formFile" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RemoteHost } from "@/entities/RemoteHost";
import { PropType } from "vue";

export default defineComponent({
  name: "ImportCSVFile",
  props: {
    host: Object as PropType<RemoteHost>,
  },
  methods: {
    processFile(event: Event) {
      const fileInput = event.target as HTMLInputElement;
      console.log(fileInput.files);
    },
  },
  mounted() {
    console.log(this.host);
  },
});
</script>

<style>
.wp-admin input[type="file"] {
  padding: 0.375rem 0.75rem !important;
}
</style>
