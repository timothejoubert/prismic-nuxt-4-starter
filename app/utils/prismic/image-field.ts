import type { ImageFieldImage } from '@prismicio/types'
import { hasAllKeys } from '~/utils/object/object-validation'

const fieldKeys = ['alt', 'copyright',  'dimensions', 'edit', 'id', 'url']

export function isImageField(field: unknown) {
	return hasAllKeys(field, fieldKeys) ? (field as ImageFieldImage) : undefined
}
