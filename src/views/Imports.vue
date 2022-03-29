<template>
  <div class="imports px-5 py-1">
    <div class="text-start fs-4 fw-bold text-capitalize pb-2">
      Remote Hosts for Import
    </div>
    <table class="table table-bordered">
      <thead class="bg-orange">
        <tr class="py-5">
          <th scope="col">
            <input
              type="checkbox"
              v-model="checkedAll"
              @change="checkAll($event)"
            />
          </th>
          <th scope="col">Host</th>
          <th scope="col">Type</th>
          <th scope="col">Import</th>
        </tr>
      </thead>
      <tbody>
        <tr v-bind:key="index" v-for="(host, index) in hosts">
          <th scope="row">
            <input type="checkbox" :value="host.id" v-model="checked" />
          </th>
          <td>{{ host.name }}</td>
          <td>{{ host.type }}</td>
          <td>
            <button
              type="button"
              class="btn"
              data-bs-toggle="modal"
              data-bs-target="#importModal"
              @click="modalHosts = [host.id]"
            >
              Import
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="position-fixed bottom-0 start-0 end-0 m-auto p-5">
      <button
        type="button"
        class="btn"
        data-bs-toggle="modal"
        data-bs-target="#importModal"
        @click="modalHosts = checked"
      >
        Import all selected
      </button>
    </div>
  </div>

  <!-- Modal -->
  <div
    class="modal fade"
    id="importModal"
    tabindex="-1"
    aria-labelledby="importModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-scrollable">
      <ImportModalContent :hosts="modalHosts" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ImportModalContent from "@/components/ImportModalContent.vue"; // @ is an alias to /src

export default defineComponent({
  name: "Imports",
  components: { ImportModalContent },
  data() {
    const hosts = [
      {
        id: "1",
        name: "Hostname 1",
        type: "Type 1",
      },
      {
        id: "2",
        name: "Hostname 2",
        type: "Type 2",
      },
      {
        id: "3",
        name: "Hostname 3",
        type: "Type 3",
      },
    ];
    let checked: string[] = [];
    let modalHosts: string[] = [];
    return {
      checkedAll: false,
      checked,
      hosts,
      modalHosts,
    };
  },
  methods: {
    checkAll() {
      this.checked = [];
      if (this.checkedAll) {
        this.hosts.forEach((host) => this.checked.push(host.id));
      }
    },
  },
});
</script>

<style>
.btn,
.btn:hover {
  background-color: #ff6e0b;
  color: white;
}
.bg-orange {
  background-color: #f58d4e !important;
  color: white;
}
</style>
