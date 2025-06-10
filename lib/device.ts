export function deviceId() {
  if (typeof window !== "undefined") {
    const deviceId = localStorage.getItem("deviceId");
    if (deviceId) {
      return deviceId;
    } else {
      const newDeviceId = (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function")
        ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
      localStorage.setItem("deviceId", newDeviceId);
      return newDeviceId;
    }
  } else {
    return null;
  }
}
