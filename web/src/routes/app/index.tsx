import { Editor } from '@/components/editor/editor'
import type { InitialEditorStateType } from '@lexical/react/LexicalComposer'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/app/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [value, setValue] = useState<InitialEditorStateType>(
    `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Hello World!","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`,
  )
  return (
    <div className="@container/main flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[calc(100svh-16px)] overflow-hidden">
      <Editor
        className="p-4 lg:p-6"
        value={value}
        onChange={(es) => {
          setValue(es)
        }}
      />
      <pre className="max-h-full overflow-auto p-4 lg:p-6">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  )
}
