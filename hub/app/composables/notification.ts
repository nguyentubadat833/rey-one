import { type ToastProps } from "@nuxt/ui";

export function useNotification() {
  function pushToast(object: Partial<ToastProps>) {
    const nuxtApp = useNuxtApp();

    nuxtApp.runWithContext(() => {
      const toast = useToast();
      toast.add(object);
    });
  }

  return {
    pushToast,
  };
}
