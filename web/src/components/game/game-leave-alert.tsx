import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { ComponentProps } from 'react'

export function GameLeaveAlert({
  reset,
  proceed,
  ...props
}: ComponentProps<typeof AlertDialog> & {
  reset?: () => void
  proceed?: () => void
}) {
  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to leave this game?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will disconnect you from the game and you will lose all
            previous chat messages.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={reset}>Go Back</AlertDialogCancel>
          <AlertDialogAction onClick={proceed}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
