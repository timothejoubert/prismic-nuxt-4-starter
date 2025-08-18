import type { PrismicDocumentWithoutUID, PrismicDocument, PrismicDocumentWithUID } from '@prismicio/types'
import type { AllDocumentTypes, ProjectDocument, SettingsDocument } from '~~/prismicio-types'

// Document data
export type DocumentWithUid = IntersectDocument<AllDocumentTypes, PrismicDocumentWithUID>
export type DocumentWithoutUid = IntersectDocument<AllDocumentTypes, PrismicDocumentWithoutUID>
export type ReachableDocument = ExcludeDocument<AllDocumentTypes, (SettingsDocument )>
export type RepeatableDocument = ProjectDocument

// Document type
export type PrismicDocumentType = ExtractDocumentType<AllDocumentTypes>
export type PrismicRepeatableDocumentType = ExtractDocumentType<RepeatableDocument>
export type PrismicReachableDocumentType = ExtractDocumentType<ReachableDocument>
export type DocumentWithUidType = ExtractDocumentType<DocumentWithUid>
export type DocumentWithoutUidType = ExtractDocumentType<IntersectDocument<AllDocumentTypes, PrismicDocumentWithoutUID>>

//  UTILS
type PickPrismicDocument<Type extends PrismicDocumentType> = Extract<ReachableDocument, { type: Type }>

export type ExtractDocumentType<T extends PrismicDocument> = Pick<T, 'type'>['type']
type IntersectDocument<T extends PrismicDocument, FilterType extends PrismicDocument> = T extends FilterType ? T : never
type ExcludeDocument<T extends PrismicDocument, FilterType extends PrismicDocument> = T extends FilterType ? never : T

// type T = prismic.PrismicDocumentWithoutUID
