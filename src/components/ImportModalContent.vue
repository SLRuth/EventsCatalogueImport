<template>
  <div class="modal-content">
    <div class="modal-header">
      <h5
        class="modal-title"
        v-if="isSelectionPhase"
        id="importModalLabel"
      >Select remote hosts to import from</h5>
      <h5
        class="modal-title"
        v-else-if="isPreImportPhase"
        id="importModalLabel"
      >Please fill out the form below</h5>
      <h5
        class="modal-title"
        v-else-if="finalized"
        id="importModalLabel"
      >Import finalized succesfully</h5>
      <h5 class="modal-title" v-else id="importModalLabel">Importing, please wait...</h5>
      <button
        type="button"
        @click="dispose"
        class="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close"
      ></button>
    </div>
    <div class="modal-body">
      <template v-if="isSelectionPhase">
        <div v-bind:key="index" v-for="(host, index) in availableHosts">
          <div class="text-start">
            <div class="fs-5 fw-bold">From the host: {{ host.name }}</div>
            <div class="py-2">Please select entity type:</div>
            <div
              class="pb-2"
              v-bind:key="index"
              v-for="(type, index) in host.entities"
              :value="type"
            >
              <label :for="type + host.name" class="fs-5 px-2">
                <input
                  type="checkbox"
                  :id="type + host.name"
                  :value="{ host: host.name, type }"
                  v-model="selected"
                />
                {{ type.charAt(0).toUpperCase() + type.slice(1) }}
              </label>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="isPreImportPhase">
        <div v-bind:key="index" v-for="(host, index) in preImportHosts">
          <component v-bind:is="componentOf(host)" :host="host"></component>
        </div>
      </template>
      <template v-else-if="isImportPhase">
        <div v-bind:key="index" v-for="(host, index) in selectedHosts">
          <div class="text-start">
            <div class="fs-5 fw-bold pb-4">Importing entities from the host: {{ host.name }}</div>
            <div
              class="pb-2"
              v-bind:key="index"
              v-for="(type, index) in host.entities"
              :value="type"
            >
              <label :for="type + host.name" class="fs-5 px-2">
                <input
                  type="checkbox"
                  disabled="true"
                  :id="type + host.name"
                  :value="{ host: host.name, type }"
                  v-model="selected"
                />
                {{ type.charAt(0).toUpperCase() + type.slice(1) }}
              </label>
              <div class="progress">
                <div
                  class="progress-bar"
                  role="progressbar"
                  :style="
                    'width: ' + progressTracker[host.id][type].progress + '%'
                  "
                  :aria-valuenow="progressTracker[host.id][type].progress"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >{{ progressTracker[host.id][type].progress }}%</div>
              </div>
              <div class="py-1">
                <div class="text-start fs-6 fw-light fst-italic p-2 w-100">
                  <div>{{ progressTracker[host.id][type].label }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="modal-footer justify-content-center">
      <div class="w-100">
        <button v-if="finalized" @click="dispose" type="button" class="btn">Go Back</button>
        <button
          v-else-if="isSelectionPhase"
          :disabled="selected.length == 0"
          @click="advance"
          type="button"
          class="btn"
        >Next</button>
        <button
          v-else-if="isPreImportPhase"
          @click="importFromSelectedHosts"
          type="button"
          class="btn"
        >Import</button>
        <button v-else @click="cancelImport" type="button" class="btn">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { RemoteHost } from "@/entities/RemoteHost";
import { RemoteHostSelection } from "@/entities/RemoteHostSelection";
import { importEventSource } from "@/api/EntitiesAPI";
import preStepsComponents from "@/config/PreImportSteps";
import { defineAsyncComponent, defineComponent, PropType } from "vue";
import preImportStepsTypeMapping from "@/config/PreImportSteps";

type ProgressRecord = {
  eventSource: EventSource;
  label: string;
  progress: number;
  finalized: boolean;
};
type ProgressTracker = Record<number, Record<string, ProgressRecord>>;
type ProcessPhase = "selection" | "pre-import" | "import";

const dynamicComponents = Object.fromEntries(
  Object.values(preImportStepsTypeMapping).map((name) => [
    name,
    defineAsyncComponent(() => import(`@/components/${name}`)),
  ])
);

export default defineComponent({
  name: "ImportModalContent",
  expose: ["dispose"],
  props: {
    msg: String,
    show: Boolean,
    allHosts: [Object] as PropType<RemoteHost[]>,
  },
  data() {
    return {
      phase: "selection" as ProcessPhase,
      progressTracker: {} as ProgressTracker,
      selected: [],
    };
  },
  components: dynamicComponents,
  computed: {
    finalized() {
      let trackers = Object.values(this.progressTracker).flatMap(
        (typeTracker) => Object.values(typeTracker)
      );

      return (
        trackers.length > 0 && trackers.every((tracker) => tracker.finalized)
      );
    },
    isSelectionFull() {
      return this.selected.length >= 8;
    },
    isPreImportPhase() {
      return this.phase == "pre-import";
    },
    isSelectionPhase() {
      return this.phase == "selection";
    },
    isImportPhase() {
      return this.phase == "import";
    },
    availableHosts(): RemoteHost[] {
      return this.allHosts ?? [];
    },
    preImportHosts(): RemoteHost[] {
      return (this.allHosts ?? []).filter((host) => !!this.componentOf(host));
    },
    selectedHosts(): RemoteHost[] {
      return (this.allHosts ?? []).flatMap((host: RemoteHost) => {
        const selectedEntities = this.selected
          .filter((sl: RemoteHostSelection) => sl.host == host.name)
          .map((sl: RemoteHostSelection) => sl.type);

        if (selectedEntities.length == 0) return [];
        else
          return [
            {
              ...host,
              entities: selectedEntities,
            },
          ];
      });
    },
  },
  methods: {
    createTracker(id: number, type: string) {
      this.progressTracker[id][type] = {
        eventSource: importEventSource(id, type),
        label: "Fetching information..",
        progress: 0,
        finalized: false,
      };
    },
    runSource(host: RemoteHost, type: string, cb?: () => void) {
      const source = this.progressTracker[host.id][type].eventSource;
      source.onmessage = (evt) => {
        const msg = JSON.parse(evt.data);
        const label = msg.data?.title || msg.data?.name || "";
        switch (msg.type) {
          case "process":
            this.progressTracker[host.id][type].label =
              "Processing entity with title: " + label;
            this.progressTracker[host.id][type].progress = msg.process * 100;

            if (msg.process == 1)
              this.progressTracker[host.id][type].label =
                "Import finalized successfully";
            break;
          case "error":
            this.progressTracker[host.id][type].label =
              "Error occured: " + msg.message;
            break;
          case "stop":
            this.progressTracker[host.id][type].finalized = true;
            this.progressTracker[host.id][type].progress = 100;
            this.progressTracker[host.id][type].label =
              "Import finalized successfully";
            source.close();
            if (cb) cb();
            break;
        }
      };
      source.onerror = () => {
        source.close();
        if (cb) cb();
      };
    },
    advance() {
      if (this.phase == "selection" && this.preImportHosts.length != 0) {
        this.phase = "pre-import";
      } else if (this.phase == "selection" && this.preImportHosts.length == 0) {
        this.phase = "import";
        this.importFromSelectedHosts();
      } else if (this.phase == "pre-import") {
        this.phase = "import";
      }
    },
    back() {
      if (this.phase == "import" && this.preImportHosts.length != 0) {
        this.phase = "pre-import";
      } else {
        this.phase = "selection";
      }
    },
    importFromSelectedHosts() {
      console.log(this.selectedHosts);
      this.selectedHosts.forEach((host: RemoteHost) => {
        this.progressTracker[host.id] = {};
        let promise: Promise<void> | undefined = undefined;
        const entities = host.entities.filter((ent) => ent != "event"),
          eventExists = host.entities.length > entities.length;

        if (eventExists) {
          this.createTracker(host.id, "event");
          promise = new Promise((res, _) =>
            this.runSource(host, "event", () => res(void 0))
          );
        }
        entities.forEach((type) => {
          this.createTracker(host.id, type);

          if (promise)
            promise.then(() => {
              this.runSource(host, type);
            });
          else this.runSource(host, type);
        });
      });
    },
    isSelected(host: RemoteHost, type: string) {
      return this.selected.find(
        ({ host: h, type: t }) => h == host.name && type == t
      );
    },
    componentOf(host: RemoteHost) {
      console.log(preStepsComponents[host.type]);
      return preStepsComponents[host.type];
    },
    cancelImport() {
      Object.values(this.progressTracker)
        .flatMap((t) => Object.values(t))
        .forEach((tracker) => {
          tracker.eventSource.close();
        });
      this.back();
    },
    dispose() {
      this.phase = "selection";
      this.selected = [];
      this.progressTracker = {};
    },
  },
});
</script>
