import { isFilled, LinkType, type FilledLinkToMediaField, type LinkToMediaField } from '@prismicio/client'

// Low-level readers of Prismic field values, shared by image.ts, video.ts and embed.ts

export function isObject(field: unknown): field is Record<string, unknown> {
    return !!field && typeof field === 'object'
}

/** Positive number from a number or numeric string (link to media dimensions are strings), else undefined. */
export function toNumber(value: unknown) {
    const number = Number(value)
    return number > 0 ? number : undefined
}

/** Non-empty string, else undefined (oEmbed keys depend on the provider). */
export function toText(value: unknown) {
    return typeof value === 'string' && value ? value : undefined
}

/** A filled link to media field (any file kind), undefined otherwise. */
export function getFilledLinkToMedia(field: unknown) {
    if (!isObject(field) || field.link_type !== LinkType.Media) return undefined

    return isFilled.linkToMedia(field as LinkToMediaField) ? field as FilledLinkToMediaField : undefined
}

/** URL of a filled link to media field (any file kind), undefined otherwise. */
export function getPrismicMediaUrl(field: unknown) {
    return getFilledLinkToMedia(field)?.url
}
