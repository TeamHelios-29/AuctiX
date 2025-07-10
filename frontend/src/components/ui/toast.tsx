import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import * as ToastPrimitive from '@radix-ui/react-toast';

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[100%] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[swipe=start]:translate-x-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50',
  {
    variants: {
      variant: {
        default: 'bg-white text-slate-950',
        destructive:
          'destructive group border-red-500 bg-red-500 text-white dark:border-red-900 dark:bg-red-900 dark:text-red-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const ToastProvider = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Provider>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Provider>
>(({ ...props }, ref) => <ToastPrimitive.Provider ref={ref} {...props} />);
ToastProvider.displayName = ToastPrimitive.Provider.displayName;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-50 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => (
  <ToastPrimitive.Root
    ref={ref}
    className={cn(toastVariants({ variant }), className)}
    {...props}
  />
));
Toast.displayName = ToastPrimitive.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-red-500/30 group-[.destructive]:hover:bg-red-500 group-[.destructive]:hover:text-white group-[.destructive]:focus:ring-red-500 dark:border-slate-800 dark:hover:bg-slate-800 dark:focus:ring-slate-300 dark:group-[.destructive]:border-slate-800/40 dark:group-[.destructive]:hover:border-red-900/30 dark:group-[.destructive]:hover:bg-red-900 dark:group-[.destructive]:hover:text-slate-50 dark:group-[.destructive]:focus:ring-red-900',
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitive.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-md p-1 text-slate-950/50 opacity-0 transition-opacity hover:text-slate-950 focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-white/50 group-[.destructive]:hover:text-white dark:text-slate-50/50 dark:hover:text-slate-50',
      className,
    )}
    toast-close=""
    {...props}
  />
));
ToastClose.displayName = ToastPrimitive.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn('text-sm font-semibold [&+div]:text-xs', className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitive.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn('text-sm opacity-90', className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitive.Description.displayName;

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
