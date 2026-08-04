import { apiErrorResponseSchema } from "@rey-one/shared";
import { FetchError } from "ofetch";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    //   if (error instanceof ValidateInputError) {
    //     const message = error.message;

    //     nuxtApp.runWithContext(() => {
    //       const toast = useToast();
    //       toast.add({
    //         title: "Invalid input",
    //         description: message,
    //         color: "error",
    //         icon: "ic:baseline-error-outline",
    //       });
    //     });
    //   } else if (error instanceof ApiError) {
    //     console.log("loi");
    //     if (error.response.status === 401) {
    //       nuxtApp.runWithContext(async () => {
    //         const router = useRouter();
    //         await router.push("/auth/login");
    //       });
    //     }

    //     const parseError = apiErrorResponseSchema.safeParse(error.response._data);
    //     let message: string;

    //     if (parseError.success) {
    //       message = parseError.data.error.message;
    //     } else {
    //       message = "Unknown";
    //     }

    //     nuxtApp.runWithContext(() => {
    //       const toast = useToast();

    //       toast.add({
    //         title: "Error",
    //         description: message,
    //         color: "error",
    //         icon: "ic:baseline-travel-explore",
    //       });
    //     });
    //   }
  };

  nuxtApp.hook("vue:error", (error, instance, info) => {

    console.log(error)
    if (error instanceof ValidateInputError) {
      const message = error.message;

      nuxtApp.runWithContext(() => {
        const toast = useToast();
        toast.add({
          title: "Invalid input",
          description: message,
          color: "error",
          icon: "ic:baseline-error-outline",
        });
      });
    } else if (error instanceof FetchError) {
      if (error.status === 401) {
        nuxtApp.runWithContext(async () => {
          const router = useRouter();
          await router.push("/auth/login");
        });
      }

      const parseError = apiErrorResponseSchema.safeParse(error.data);
      let message: string;

      console.log(parseError)

      if (parseError.success) {
        message = parseError.data.error.message;
      } else {
        message = "Unknown";
      }

      nuxtApp.runWithContext(() => {
        const toast = useToast();

        toast.add({
          title: "Error",
          description: message,
          color: "error",
          icon: "ic:baseline-warning-amber",
        });
      });
    }
  });
});
