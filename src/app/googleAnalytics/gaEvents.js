export const logGAEvent = (eventName, eventParams = {}) => {
  if (typeof window !== "undefined" && window.trackEvent) {
    window.trackEvent(eventName, eventParams);
  }
};
