export const useAPI =  $fetch.create({
  baseURL: "/rmk-api",
  credentials: "include",
});

export const useAsyncAPI = createUseFetch({
  baseURL: "/rmk-api",
  credentials: "include",
});

export const useGuestAPI = $fetch.create({
  baseURL: "/rmk-api",
});
