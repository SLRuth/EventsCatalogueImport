import { BASE_PATH } from "./Constants"

export function fetchHosts() {
    return fetch(BASE_PATH + "/remote_hosts")
}

export function fetchEntities() {
    return fetch(BASE_PATH + "/process/entities")
}
