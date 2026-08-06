export function useNotification() {
  function pushToast(object: Partial<{ title: string; description: string, color: any }>) {
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
