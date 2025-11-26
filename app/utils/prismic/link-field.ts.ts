import type {
	LinkField,
	FilledLinkToWebField,
	LinkToMediaField,
} from '@prismicio/types'
import { LinkType } from '@prismicio/types'
import { hasAllKeys } from '~/utils/object/object-validation'
import { getFilledContentRelationshipField } from './content-relationship-field'

const defaultFieldKeys = ['link_type']
const fieldKeys = [...defaultFieldKeys, 'id', 'link_type', 'name', 'kind', 'url', 'size']

export function isLinkToMediaField(field: unknown) {
	if (!field || typeof field !== 'object' || !hasAllKeys(field, defaultFieldKeys)) return undefined

	return (field as LinkToMediaField).link_type === LinkType.Media ? (field as LinkToMediaField) : undefined
}

export function isLinkToMediaFieldFilled(field: unknown) {
	if (!isLinkToMediaField(field) || !hasAllKeys(field, fieldKeys)) return undefined

	return (field as LinkToMediaField).link_type === LinkType.Media ? (field as LinkToMediaField<'filled'>) : undefined
}

export function getLinkFieldFilled(field: unknown) {
	const fieldTyped = isLinkToMediaField(field)
		? (field as LinkField<'filled'>)
		: undefined

	if (fieldTyped && 'url' in fieldTyped && fieldTyped.url) return fieldTyped

	return undefined
}

export function getFilledLinkToWeb(field: unknown) {
	const fieldTyped = getLinkFieldFilled(field)

	if (fieldTyped?.link_type === LinkType.Web && fieldTyped.url)
		return fieldTyped as FilledLinkToWebField
	return undefined
}

export function getFilledLinkToDocument(field: unknown) {
	const fieldTyped = getLinkFieldFilled(field)

	return getFilledContentRelationshipField(fieldTyped)
}
