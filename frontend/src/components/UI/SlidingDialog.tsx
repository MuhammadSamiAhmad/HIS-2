import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode } from "react";

interface DialogProps {
  trigger: ReactNode; // Custom trigger element (e.g., button)
  title?: string; // Optional title for the dialog
  description?: string; // Optional description
  children: ReactNode; // Content of the dialog
}

const SlidingDialog = ({
  trigger,
  title,
  description,
  children,
}: DialogProps) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40" />
        <Dialog.Content className="fixed z-10 left-[86%] top-1/2 h-[100%] w-[570px] -translate-x-1/2 -translate-y-1/2 rounded-l-3xl bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] font-manrope">
          {title && (
            <Dialog.Title className="m-0 text-textColor font-bold lg:text-xl border-b border-Silver-2 pb-3 mt-10 mb-10">
              {title}
            </Dialog.Title>
          )}
          {description && (
            <Dialog.Description className="mb-5 mt-2.5">
              {description}
            </Dialog.Description>
          )}
          <div>{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SlidingDialog;
