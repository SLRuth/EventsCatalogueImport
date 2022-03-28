<template>
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title" id="importModalLabel">Import</h5>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close"
      ></button>
    </div>
    <div class="modal-body">
      <div v-bind:key="index" v-for="(host, index) in hosts">
        <div class="text-start">
          <div class="fs-5 fw-bold">For the host: {{ host }}</div>
          <div class="py-2">Please select entity type:</div>
          <div
            class="pb-3"
            v-bind:key="index"
            v-for="(type, index) in types"
            :value="type"
          >
            <input
              type="checkbox"
              :id="type + host"
              :value="{ host, type }"
              v-model="selected"
            />
            <label :for="type + host" class="px-2">{{ type }}</label>
            <div v-if="progress" class="progress">
              <div
                class="progress-bar"
                role="progressbar"
                :style="'width: ' + progressPercent + '%'"
                :aria-valuenow="progressPercent"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {{ progressPercent }}%
              </div>
            </div>
          </div>

          <div class="pt-3 pb-4">
            <input
              type="checkbox"
              id="forceImport"
              :value="host"
              v-model="force"
            />
            <label for="forceImport" class="px-2"><b>Force import</b></label>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer justify-content-center">
      <div class="w-100">
        <button
          v-if="progress == false"
          @click="doImport"
          type="button"
          class="btn"
        >
          DO IMPORT
        </button>
        <button v-else @click="cancelImport" type="button" class="btn">
          CANCEL
        </button>
        <div class="py-4">
          <div
            class="bg-secondary text-white text-start fs-6 fw-light p-2 w-100"
          >
            <div>Process</div>
            <div>Process</div>
            <div>Process</div>
            <div>Process</div>
            <div>Process</div>
          </div>
        </div>
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
      progress: true,
      progressPercent: 55,
      types: ["Events", "Speakers", "Programme"],
      selected: [],
      force: [],
    };
  },
  methods: {
    doImport() {
      console.log(this.selected);
      console.log(this.force);
    },
    cancelImport() {
      console.log("cancel");
    },
  },
});
</script>
