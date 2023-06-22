export const getPayUrl = (requestId: string) =>
  window.location.hostname === "localhost"
    ? `http://localhost:3001/${requestId}`
    : window.location.hostname.startsWith("baguette")
    ? `https://baguette-pay.request.network/${requestId}`
    : `https://pay.request.network/${requestId}`;
