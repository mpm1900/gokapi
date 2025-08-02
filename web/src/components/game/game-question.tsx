import { type Question, type QuestionChoice } from '@/types/game'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

function evalQuestion(question: Question, choice: QuestionChoice) {
  if (question.type === 'MULTIPLE_CHOICE') {
    if (typeof question.eval === 'function') {
      return question.eval(choice)
    }
    return question.eval.includes(choice)
  }
  return question.eval ? question.eval(choice.text) : false
}

export function GameQuestion({ question }: { question: Question }) {
  const timer = useRef<NodeJS.Timeout>(null)
  const [selected, setSelected] = useState<QuestionChoice>()
  const [progress, setProgress] = useState(question.time)
  const done = progress <= 0
  const isCorrect = selected && evalQuestion(question, selected)

  function clearTimer() {
    if (timer.current) {
      clearInterval(timer.current)
      timer.current = null
    }
  }

  function startTimer() {
    setProgress(question.time)
    timer.current = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearTimer()
          return 0
        }
        return prev - 100
      })
    }, 100)
  }

  function reset() {
    clearTimer()
    startTimer()
    setSelected(undefined)
  }

  useEffect(() => {
    startTimer()
    return () => clearTimer()
  }, [question.id])

  return (
    <div className="flex flex-col gap-6">
      <Progress value={(progress * 100) / question.time} />
      <span
        className={cn('text-4xl font-bold text-center', {
          'text-green-500': done && isCorrect,
          'text-red-500': done && !isCorrect,
        })}
      >
        {question.prompt}
      </span>
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
              disabled={!!selected || done}
              className="flex items-center justify-center gap-2 px-4 py-2 text-lg font-bold rounded-md"
              onClick={() => setSelected(choice)}
            >
              {choice.text}
            </Button>
          ))}
        </div>
      )}
      {(!!selected || done) && (
        <div>
          <Button variant="outline" onClick={() => reset()}>
            Reset
          </Button>
        </div>
      )}
    </div>
  )
}
