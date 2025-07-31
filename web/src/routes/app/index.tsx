// import { Editor } from '@/components/editor/editor'
// import { Separator } from '@/components/ui/separator'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  console.log(value, setValue)
  return (
    <div className="@container/main relative flex-1 flex flex-col overflow-hidden"></div>
  )
}
