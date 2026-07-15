'use client';

import { useRef } from 'react';
import { toast } from 'sonner';
import { File, FileText, Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatFileSize, isAllowedUploadFile } from '@/lib/gre/utils';
import { cn } from '@/lib/utils';
import type { GreArchivo } from '@/types/gre';

interface GreUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  greLabel: string;
  archivos: GreArchivo[];
  onUpload: (file: File) => Promise<void>;
  isPending: boolean;
}

export function GreUploadDialog({
  open,
  onOpenChange,
  greLabel,
  archivos,
  onUpload,
  isPending,
}: GreUploadDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isAllowedUploadFile(file)) {
      toast.error('Tipo de archivo no permitido', {
        description: 'Solo se admiten archivos XML o PDF.',
      });
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    await onUpload(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Subir archivo</DialogTitle>
          <DialogDescription>
            Carga un archivo XML o PDF para la GRE {greLabel}. Máximo 10 MB.
          </DialogDescription>
        </DialogHeader>

        <div
          className={cn(
            'flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/60 bg-muted/20 p-8 transition-colors',
            'hover:border-brand/40 hover:bg-brand/5',
          )}
        >
          <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="mb-1 text-sm font-medium">Arrastra o selecciona un archivo</p>
          <p className="mb-4 text-xs text-muted-foreground">XML o PDF — máx. 10 MB</p>
          <input
            ref={inputRef}
            type="file"
            accept=".xml,.pdf,application/xml,text/xml,application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => inputRef.current?.click()}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Subiendo...
              </>
            ) : (
              'Seleccionar archivo'
            )}
          </Button>
        </div>

        {archivos.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Archivos cargados</p>
            {archivos.map((archivo) => (
              <div
                key={archivo.id}
                className="flex items-center gap-3 rounded-lg border border-border/40 bg-muted/20 p-3"
              >
                {archivo.tipo === 'PDF' ? (
                  <FileText className="h-4 w-4 text-red-500" />
                ) : (
                  <File className="h-4 w-4 text-blue-500" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{archivo.nombreOriginal}</p>
                  <p className="text-xs text-muted-foreground">
                    {archivo.tipo} · {formatFileSize(archivo.tamanoBytes)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
