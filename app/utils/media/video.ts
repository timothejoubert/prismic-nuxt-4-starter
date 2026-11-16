const VIDEO_MIME_TYPES: Record<string, string> = {
    mp4: 'video/mp4',
    m4v: 'video/mp4',
    webm: 'video/webm',
    ogv: 'video/ogg',
    mov: 'video/quicktime',
}

/** MIME type of a video file from its name or URL extension, undefined when it isn't a known video format. */
export function getVideoMimeType(fileNameOrUrl: string) {
    const extension = fileNameOrUrl.split(/[?#]/)[0]?.split('.').pop()?.toLowerCase()

    return extension ? VIDEO_MIME_TYPES[extension] : undefined
}
