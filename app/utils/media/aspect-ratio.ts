/** CSS `aspect-ratio` value from media dimensions, so the space is reserved before the media loads. */
export function getAspectRatio(width?: number | string | null, height?: number | string | null) {
    const w = Number(width)
    const h = Number(height)

    return w > 0 && h > 0 ? `${w} / ${h}` : undefined
}
