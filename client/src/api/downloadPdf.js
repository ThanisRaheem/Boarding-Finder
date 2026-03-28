import api from "./axios.js";

export async function downloadBookingPdf(bookingId) {
  const res = await api.get(`/bookings/${bookingId}/pdf`, {
    responseType: "blob",
  });
  const blob = new Blob([res.data], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `booking-${bookingId}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
