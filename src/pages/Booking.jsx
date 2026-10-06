import React from "react";
import BookingDetail from "../features/bookings/BookingDetail";

//? Page components are strictly for presentation and contain no side effects. They are created once, while all subsequent content fetching is handled by the individual feature pages.

export default function Booking() {
  return <BookingDetail />;
}
