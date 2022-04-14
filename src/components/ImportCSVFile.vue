<template>
  <div class="mb-3" v-bind:key="index" v-for="(type, index) in host.entities">
    <label for="formFile" class="form-label text-start fw-bold fs-5 w-100"
      >Please select the {{ type }}s file...</label
    >
    <input
      class="form-control"
      accept=".csv"
      type="file"
      :disabled="uploading"
      @change="processFile($event, type)"
      id="formFile"
    />
    <small v-if="uploading">Uploding File...</small>
    <small class="success pt-2" v-if="result == 'success'"
      >The upload was a success</small
    >
    <small class="failure pt-2" v-else-if="result == 'failure'"
      >The upload failed, please try again</small
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RemoteHost } from "@/entities/RemoteHost";
import { PropType } from "vue";
import { uploadFile } from "@/api/ProcessAPI";

type Result = "success" | "failure" | "none";

export default defineComponent({
  name: "ImportCSVFile",
  props: {
    host: Object as PropType<RemoteHost>,
  },
  data() {
    return {
      uploading: false,
      result: "none" as Result,
    };
  },
  methods: {
    processFile(event: Event, type: string) {
      const fileInput = event.target as HTMLInputElement,
        selectedFile = fileInput?.files?.[0];
      if (this.host && selectedFile) {
        this.result = "none";
        this.uploading = true;
        uploadFile(this.host, type, selectedFile)
          .then((response) => response.json())
          .then(({ count }) => {
            this.uploading = false;
            this.result = "success";
            this.$emit(
              "finalized",
              new URLSearchParams({ file_length: count.toString() })
            );
          })
          .catch(() => {
            this.uploading = false;
            this.result = "failure";
          });
      }
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
small {
  text-align: start;
  width: 100%;
}
.success {
  color: darkgreen;
}
.failure {
  color: red;
}
</style>
