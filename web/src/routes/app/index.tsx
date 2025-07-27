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
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Editor
              value={value}
              onChange={(es) => {
                setValue(es)
              }}
            />
            <pre className="">{JSON.stringify(value, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}
