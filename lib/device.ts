export function deviceId() {
  if (typeof window !== "undefined") {
    const deviceId = localStorage.getItem("deviceId");
    if (deviceId) {
      return deviceId;
    } else {
      const newDeviceId = crypto.randomUUID();
      localStorage.setItem("deviceId", newDeviceId);
      return newDeviceId;
    }
  } else {
    return null;
  }
}
