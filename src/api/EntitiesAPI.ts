const BASE_PATH = process.env.VUE_APP_API_PATH

export function fetchHosts() {
    return fetch(BASE_PATH + "/remote_hosts")
}

export function importEventSource(remoteHostId: number, entityType: string) {
    return new EventSource(BASE_PATH + `/process/${remoteHostId}?type=import&entity=${entityType}`)
}

export function fetchEntities() {
    return fetch(BASE_PATH + "/process/entities")
}
