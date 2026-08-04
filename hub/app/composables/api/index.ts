export const useAPI = createUseFetch({
  baseURL: "/rmk-api",
  credentials: "include",
});

export const useGuestAPI = $fetch.create({
  baseURL: "/rmk-api",
});
