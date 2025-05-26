import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger
} from '@/components/ui/dialog';

export function MessageDialog() {
  return (
    <Dialog>
      <DialogTrigger className="hidden" id="template-modal-mensagem-trigger" />
      <DialogContent>
        <DialogHeader id="template-modal-mensagem-titulo"></DialogHeader>
        <div
          className="max-h-96 overflow-auto"
          id="template-modal-mensagem-corpo"
        ></div>
      </DialogContent>
    </Dialog>
  );
}
