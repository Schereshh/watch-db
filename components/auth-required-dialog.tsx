"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AuthRequiredDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  actionLabel?: string;
};

export default function AuthRequiredDialog({
  open,
  onOpenChange,
  title = "Authentication required",
  description,
  actionLabel,
}: AuthRequiredDialogProps) {
  const resolvedDescription =
    description ??
    (actionLabel
      ? `Log in or create an account to ${actionLabel}.`
      : "Log in or create an account to continue.");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{resolvedDescription}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button asChild variant="outline">
            <Link href="/sign-up">Sign up</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Log in</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}