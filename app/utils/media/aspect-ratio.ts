/** CSS `aspect-ratio` value from media dimensions, so the space is reserved before the media loads. */
export function getAspectRatio(width?: number | string | null, height?: number | string | null) {
    const w = Number(width)
    const h = Number(height)

    return w > 0 && h > 0 ? `${w} / ${h}` : undefined
}

/** Height matching `width` at the `ratioWidth` / `ratioHeight` ratio, undefined when that ratio is unknown. */
export function getHeightForWidth(width: number, ratioWidth?: number | string | null, ratioHeight?: number | string | null) {
    const w = Number(ratioWidth)
    const h = Number(ratioHeight)

    return w > 0 && h > 0 ? Math.round(width * h / w) : undefined
}
