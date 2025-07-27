import { Editor } from '@/components/editor/editor'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
    <div className="@container/main max-h-full flex-1 flex flex-col lg:flex-row overflow-hidden">
      <Editor
        className="flex-1 max-h-full p-4"
        value={value}
        onChange={(es) => {
          setValue(es)
        }}
      />
      <Separator orientation="vertical" />
      <Tabs
        defaultValue="json"
        className="flex-1 pt-2 max-h-full overflow-auto gap-0"
      >
        <TabsList className="mx-4 mb-2">
          <TabsTrigger value="json">JSON</TabsTrigger>
          <TabsTrigger value="treeview">TreeView</TabsTrigger>
        </TabsList>
        <Separator />
        <TabsContent value="json" className="max-h-full overflow-auto">
          <pre className="h-[6000px] px-4">
            {JSON.stringify(value, null, 2)}
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  )
}
