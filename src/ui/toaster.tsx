import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          error:
            'group-[.toaster]:bg-destructive/10 group-[.toaster]:text-destructive group-[.toaster]:border-destructive/20',
          success:
            'group-[.toaster]:bg-green-900/10 group-[.toaster]:text-green-400 group-[.toaster]:border-green-500/20',
          warning:
            'group-[.toaster]:bg-yellow-900/10 group-[.toaster]:text-yellow-400 group-[.toaster]:border-yellow-500/20',
          info:
            'group-[.toaster]:bg-blue-900/10 group-[.toaster]:text-blue-400 group-[.toaster]:border-blue-500/20',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
