import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import {
  LexicalComposer,
  type InitialConfigType,
  type InitialEditorStateType,
} from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'

import { theme } from './editor-theme'
import type { EditorState, LexicalEditor } from 'lexical'

function onError(error: any) {
  console.error(error)
}

function Editor({
  value,
  onChange,
}: {
  value?: InitialEditorStateType
  onChange?: (
    editorState: EditorState,
    editor: LexicalEditor,
    tags: Set<string>,
  ) => void
}) {
  const initialConfig: InitialConfigType = {
    editorState: value,
    namespace: 'gokapi',
    theme,
    onError,
  }
  const richText = false
  const TextPlugin = richText ? RichTextPlugin : PlainTextPlugin

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div>
        <TextPlugin
          contentEditable={
            <ContentEditable
              className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              aria-placeholder={'Enter some text...'}
              placeholder={
                <div className={theme.placeholder}>Enter some text...</div>
              }
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        {onChange && <OnChangePlugin onChange={onChange} />}
      </div>
    </LexicalComposer>
  )
}

export { Editor }
