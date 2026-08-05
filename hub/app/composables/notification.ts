export function useNotification() {
  function pushToast(object: Partial<{ title: string; description: string }>) {
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
