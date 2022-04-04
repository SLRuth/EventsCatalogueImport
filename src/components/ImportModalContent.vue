<template>
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title" id="importModalLabel">Import</h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <div v-bind:key="index" v-for="(host, index) in hosts">
        <div class="text-start">
          <div class="fs-5 fw-bold" :class="progress ? 'pb-4' : ''">From the host: {{ host.name }}</div>
          <div class="py-2" v-if="!progress">Please select entity type:</div>
          <div class="pb-2" v-bind:key="index" v-for="(type, index) in host.entities" :value="type">
            <label :for="type + host.name" class="fs-5 px-2">
              <input
                type="checkbox"
                :disabled="
                  progress ||
                  (isSelectionFull &&
                    !selected.find(
                      ({ host: h, type: t }) => h == host.name && t == type
                    ))
                "
                :id="type + host.name"
                :value="{ host: host.name, type }"
                v-model="selected"
              />
              {{ type.charAt(0).toUpperCase() + type.slice(1) }}
            </label>
            <div v-if="progress">
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
      </div>
    </div>
    <div class="modal-footer justify-content-center">
      <div class="w-100">
        <button v-if="finalized" @click="dispose" type="button" class="btn">Go Back</button>
        <button v-else-if="!progress" @click="doImport" type="button" class="btn">Import</button>
        <button v-else @click="cancelImport" type="button" class="btn">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { RemoteHost } from "@/entities/RemoteHost";
import { RemoteHostSelection } from "@/entities/RemoteHostSelection";
import { importEventSource } from "@/api/EntitiesAPI";
import { defineComponent } from "vue";

type ProgressRecord = {
  eventSource: EventSource;
  label: string;
  progress: number;
  finalized: boolean;
};
type ProgressTracker = Record<number, Record<string, ProgressRecord>>;

export default defineComponent({
  name: "ImportModalContent",
  props: {
    msg: String,
    allHosts: [Object],
  },
  data() {
    return {
      progress: false,
      progressTracker: {} as ProgressTracker,
      selected: [],
    };
  },
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
    hosts(): RemoteHost[] {
      return this.progress
        ? (this.allHosts ?? []).map((host: RemoteHost) => ({
            ...host,
            entities: this.selected
              .filter((sl: RemoteHostSelection) => sl.host == host.name)
              .map((sl: RemoteHostSelection) => sl.type),
          }))
        : this.allHosts;
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
    doImport() {
      this.progress = true;
      this.hosts.forEach((host: RemoteHost) => {
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
    cancelImport() {
      Object.values(this.progressTracker)
        .flatMap((t) => Object.values(t))
        .forEach((tracker) => {
          tracker.eventSource.close();
        });
      this.progress = false;
    },
    dispose() {
      this.progress = false;
      this.progressTracker = {};
    },
  },
});
</script>
