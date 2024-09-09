import { minimalSetup } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript'
import type { Extension } from '@codemirror/state'

const extensions: Extension[] = [minimalSetup, javascript()]

export default extensions
