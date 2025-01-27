"use client";

import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
  employeeName: string;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirmDelete,
  employeeName,
}: DeleteConfirmationModalProps) {
  return (
    <Dialog open={isOpen} handler={onClose} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
      <DialogHeader className="text-lg font-semibold" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Delete Confirmation</DialogHeader>
      <DialogBody className="p-6" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <p>Are you sure you want to delete the employee <strong>{employeeName}</strong>?</p>
      </DialogBody>
      <DialogFooter placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <Button variant="text" color="red" onClick={onClose} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Cancel</Button>
        <Button variant="gradient" color="green" onClick={onConfirmDelete} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Confirm</Button>
      </DialogFooter>
    </Dialog>
  );
}
