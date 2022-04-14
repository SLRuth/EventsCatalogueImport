<template>
  <div class="entities px-5 py-1">
    <div
      class="pb-2"
      v-bind:key="entityName"
      v-for="(entityData, entityName) in entities"
    >
      <div
        class="text-start fs-4 fw-bold text-capitalize pb-1"
        v-if="entityData.length > 0"
      >
        {{ entityName }}
      </div>
      <table class="table table-bordered" v-if="entityData.length > 0">
        <thead class="bg-orange">
          <tr>
            <th
              scope="col"
              class="text-capitalize"
              v-bind:key="i"
              v-for="(prop, i) in Object.keys(entityData[0])"
            >
              {{ toTitle(prop) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-bind:key="i" v-for="(data, i) in entityData">
            <td
              v-bind:key="i"
              v-for="(prop, i) in data"
              v-html="
                i == 'id'
                  ? `<a href='${entityBaseUrl}wp-admin/post.php?post=${prop}&action=edit'>${prop}</a>`
                  : prop
              "
            ></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { fetchEntities } from "@/api/EntitiesAPI";

export default defineComponent({
  name: "Entities",
  components: {},
  data() {
    return {
      entities: {},
    };
  },
  created() {
    fetchEntities()
      .then((r) => r.json())
      .then((entities) => (this.entities = entities))
      .then(console.log);
  },
  computed: {
    entityBaseUrl() {
      return process.env.VUE_APP_ENTITY_BASE_URL;
    },
  },
  methods: {
    toKebab(str: string) {
      return str
        .replaceAll("_", "-")
        .split("")
        .map((letter) => {
          if (/[A-Z]/.test(letter)) {
            return ` ${letter.toLowerCase()}`;
          }
          return letter;
        })
        .join("");
    },
    toTitle(str: string) {
      return this.toKebab(str)
        .split("-")
        .map((word) => {
          return word.slice(0, 1).toUpperCase() + word.slice(1);
        })
        .join(" ");
    },
  },
});
</script>
<style>
.bg-orange {
  background-color: #f58d4e !important;
  color: white;
}
td {
  min-width: 200px;
  max-width: 400px;
}
</style>
