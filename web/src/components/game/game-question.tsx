import { type Question, type QuestionChoice } from '@/types/game'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { useState } from 'react'

export function GameQuestion({ question }: { question: Question }) {
  const [selected, setSelected] = useState<QuestionChoice>()
  return (
    <div className="flex flex-col gap-6">
      <Progress value={80} />
      <span className="text-4xl font-bold text-center">{question.prompt}</span>
      {question.type === 'MULTIPLE_CHOICE' && (
        <div className="grid grid-cols-4 gap-2 px-16">
          {question.choices.map((choice) => (
            <Button
              key={choice.id}
              variant={
                !selected
                  ? 'secondary'
                  : selected?.id === choice.id
                    ? 'default'
                    : 'secondary'
              }
              disabled={!!selected}
              className="flex items-center justify-center gap-2 px-4 py-2 text-lg font-bold rounded-md"
              onClick={() => setSelected(choice)}
            >
              {choice.text}
            </Button>
          ))}
        </div>
      )}
      {!!selected && (
        <div>
          <Button variant="outline" onClick={() => setSelected(undefined)}>
            Reset
          </Button>
        </div>
      )}
    </div>
  )
}
