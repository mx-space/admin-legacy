declare module 'markdown-it-prism' {
  import MarkdownIt from 'markdown-it'
  export interface MarkdownItPrismOptions {
    plugins?: string[]
    init?: any
    defaultLanguageForUnknown?: string
    defaultLanguageForUnspecified?: string
    defaultLanguage?: string
  }
  export default function markdownItPrism(
    markdownit: MarkdownIt,
    useroptions?: MarkdownItPrismOptions,
  ): void
}
