<script lang="ts">
import { h, type PropType } from 'vue'
import type { NuxtLinkProps } from '#app/components/nuxt-link'
import { NuxtLink } from '#components'
import { type PossibleRouteReference, useLinkResolver } from '~/composables/use-link-resolver'

export const vPrismicLinkProps = {
    to: [Object, String] as PropType<PossibleRouteReference>,
    nuxtLinkProps: Object as PropType<NuxtLinkProps>,
    custom: Boolean, // use scoped slot
    label: [String, null],
}

export default defineComponent({
    inheritAttrs: false,
    props: vPrismicLinkProps,
    setup(props, { attrs, slots }) {
        const { isRelative, isExternal, url } = useLinkResolver(props.to)
        const { t } = useI18n()

        const attributes = computed(() => {
            const result: Record<string, unknown> = { ...attrs, ...props.nuxtLinkProps }

            if (isRelative.value) {
                Object.assign(result, { to: url.value })
            }
            else if (isExternal.value) {
                Object.assign(result, {
                    target: attrs?.target || '_blank',
                    rel: attrs?.rel || 'noopener noreferrer',
                    href: url.value,
                })
            }

            return result
        })

        // RGAA: a link opening a new window must say so, here as text read by assistive technologies
        const opensNewWindow = computed(() => attributes.value.target === '_blank')

        return () => {
            if (props.custom) {
                // Render-less: pass every attribute to the default slot
                return slots.default?.({ ...attributes.value, url: attributes.value.href || attributes.value.to, opensNewWindow: opensNewWindow.value }) || ''
            }

            return h(NuxtLink, attributes.value, () => [
                slots.default ? slots.default() : (typeof props.label === 'string' && props.label) || '',
                opensNewWindow.value && h('span', { class: 'visually-hidden' }, ` (${t('link.new_window')})`),
            ])
        }
    },
})
</script>
