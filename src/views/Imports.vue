<template>
  <div class="imports px-5 py-1">
    <div class="text-start fs-4 fw-bold text-capitalize pb-2">Remote Hosts for Import</div>
    <table class="table table-bordered">
      <thead class="bg-orange">
        <tr class="py-5">
          <th scope="col">
            <input type="checkbox" v-model="checkedAll" @change="checkAll($event)" />
          </th>
          <th scope="col">Host</th>
          <th scope="col">Type</th>
          <th scope="col">Import</th>
        </tr>
      </thead>
      <tbody>
        <tr v-bind:key="index" v-for="(host, index) in hosts">
          <th scope="row">
            <input type="checkbox" :value="host" v-model="checked" />
          </th>
          <td>{{ host.name }}</td>
          <td v-if="host.type == 'shocklogic'">Shocklogic</td>
          <td v-else-if="host.type == 'csv'">CSV File</td>
          <td v-else>Unknown</td>
          <td>
            <button
              type="button"
              class="btn"
              data-bs-toggle="modal"
              data-bs-target="#importModal"
              @click="modalHosts = [host]"
            >Import</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="import-all position-fixed bottom-0 end-0 m-auto p-5">
      <button
        type="button"
        class="btn btn-default"
        data-bs-toggle="modal"
        data-bs-target="#importModal"
        @click="modalHosts = checked"
      >Import all selected</button>
    </div>
  </div>

  <!-- Modal -->
  <div
    class="modal fade p-3"
    id="importModal"
    tabindex="-1"
    aria-labelledby="importModalLabel"
    aria-hidden="true"
    @click="disposeModal"
  >
    <div
      class="modal-dialog modal-dialog-scrollable modal-dialog-centered"
      :class="modalHosts.length == 1 ? 'normal-modal-width' : 'w-50'"
      @click.stop
    >
      <ImportModalContent :allHosts="modalHosts" ref="modal" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ImportModalContent from "@/components/ImportModalContent.vue"; // @ is an alias to /src
import { RemoteHost } from "@/entities/RemoteHost";
import { fetchHosts } from "@/api/EntitiesAPI";

export default defineComponent({
  name: "Imports",
  components: { ImportModalContent },
  data() {
    const hosts: RemoteHost[] = [];
    let checked: RemoteHost[] = [];
    let modalHosts: string[] = [];
    return {
      checkedAll: false,
      checked,
      hosts,
      modalHosts,
      showModal: false,
    };
  },
  methods: {
    checkAll() {
      this.checked = [];
      if (this.checkedAll) {
        this.hosts.forEach((host) => this.checked.push(host));
      }
    },
    disposeModal() {
      const modal: any | undefined = this.$refs.modal;
      console.log(modal);
      modal?.dispose();
    },
  },
  created() {
    fetchHosts()
      .then((response) => response.json())
      .then((hosts) => {
        this.hosts = hosts;
      });
  },
});
</script>

<style>
.btn,
.btn:hover {
  background-color: #ff6e0b !important;
  color: white !important;
}
.import-all {
  left: 160px;
}
.bg-orange {
  background-color: #f58d4e !important;
  color: white;
}
.modal-dialog {
  max-width: unset !important;
}
.normal-modal-width {
  width: 500px !important;
}
</style>
