import { RemoteHost } from "@/entities/RemoteHost"
import { BASE_PATH } from "./Constants"

export function uploadFile(host: RemoteHost, entityType: string, file: File) {
    const data = new FormData()
    data.append('EntityFile', file)

    return fetch(BASE_PATH + '/file/upload?' + new URLSearchParams({
        remote_host: host.id.toString(),
        entity_type: entityType
    }), {
        method: 'POST',
        body: data
    })
}

export function importEventSource(
    remoteHostId: number,
    entityType: string,
    preparer?: (arg: string) => string
) {
    const url = BASE_PATH + `/process/${remoteHostId}?type=import&entity=${entityType}`
    return new EventSource(preparer ? preparer(url) : url)
}
