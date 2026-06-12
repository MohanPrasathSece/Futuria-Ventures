export const openAuthModal = (mode: string) =>
  window.dispatchEvent(new CustomEvent("openAuthModal", { detail: mode }));
