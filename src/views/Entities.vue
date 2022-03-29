<template>
  <div class="entities px-5 py-1">
    <div
      class="pb-2"
      v-bind:key="entityName"
      v-for="(entityData, entityName) in entities"
    >
      <div class="text-start fs-4 fw-bold text-capitalize pb-1">
        {{ entityName }}
      </div>
      <table class="table table-bordered">
        <thead class="bg-orange">
          <tr>
            <th
              scope="col"
              class="text-capitalize"
              v-bind:key="i"
              v-for="(prop, i) in Object.keys(entityData[0])"
            >
              {{ prop }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-bind:key="i" v-for="(data, i) in entityData">
            <td v-bind:key="i" v-for="(prop, i) in Object.values(data)">
              {{ prop }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Entities",
  components: {},
  data() {
    return {
      entities: {
        events: [
          {
            date: "March 20, 2022 12:00 am",
            type: "Virtual",
            title: "New Thinkers and Creatives Forum 2022",
          },
          {
            date: "March 12, 2022 12:00 am",
            type: "Virtual",
            title: "Annual Sales and Marketing Summit 2022",
          },
        ],

        speakers: [
          {
            name: "Jonathan Smith",
            ocuppation: "Director, Smith Inc.",
            description:
              "Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.",
          },
          {},
        ],
      },
    };
  },
});
</script>
<style>
.bg-orange {
  background-color: #f58d4e !important;
  color: white;
}
</style>
