import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

type useConfirmDialogReturnType = [() => JSX.Element, () => Promise<unknown>];

export const useConfirmDialog = ({
  title,
  description,
}: {
  title: string;
  description: string;
}): useConfirmDialogReturnType => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () =>
    new Promise((resolve, reject) => {
      // store resolve function to promise state so we can use it later
      setPromise({ resolve });
    });

  const handleClose = () => {
    // reset promise state
    setPromise(null);
  };

  const handleConfirm = () => {
    // resolve promise with true
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    // resolve promise with false
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmDialog = () => (
    <AlertDialog open={promise !== null}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pt-2">
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction className="gap-2" onClick={handleConfirm}>
            <span>Delete</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return [ConfirmDialog, confirm];
};
