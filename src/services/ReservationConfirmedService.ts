import axios from "axios";
import { ReservationConfirmedDto } from "../models/ReservationConfirmedDto";

export async function confirmHotel(
  reservation_request_id: number,
  hotel_id: number,
  check_in_date: string,
  check_out_date: string,
  price: number,
  room_type: string,
  board_type: string,
  user_id: number,
  user_name: string
): Promise<void> {
  const reservationConfirmedDto = new ReservationConfirmedDto(
    reservation_request_id,
    hotel_id,
    check_in_date,
    check_out_date,
    price,
    room_type,
    board_type,
    new Date().toISOString(),
    user_id,
    user_name
  );

  try {
    const response = await axios.post(
      "https://tubitak-proje.dev.reisetech.io/api/metapersona/api/ReservationConfirmed",
      reservationConfirmedDto
    );

    if (response.status === 201) {
      // Successfully confirmed the hotel
      return;
    } else {
      throw new Error("Failed to confirm hotel.");
    }
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error("Reservation request or hotel not found.");
    } else if (error.response && error.response.status === 500) {
      throw new Error("An error occurred while confirming the reservation.");
    } else {
      throw new Error("Unexpected error occurred.");
    }
  }
}

export async function checkIfReservationConfirmed(
  reservation_request_id: number
): Promise<boolean> {
  try {
    const response = await axios.get(
      `https://tubitak-proje.dev.reisetech.io/api/metapersona/api/ReservationConfirmed/${reservation_request_id}`
    );
    return response.data.isConfirmed;
  } catch (error) {
    return false;
  }
}

export async function getAllConfirmedReservations(): Promise<
  ReservationConfirmedDto[]
> {
  try {
    const response = await axios.get(
      "https://tubitak-proje.dev.reisetech.io/api/metapersona/api/ReservationConfirmed"
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error occurred while fetching confirmed reservations:",
      error
    );
    throw error;
  }
}

export const getReservationDetails = async (
  reservationId: string
): Promise<ReservationConfirmedDto> => {
  try {
    console.log(
      "Sending request:",
      `https://tubitak-proje.dev.reisetech.io/api/metapersona/api/ReservationConfirmed/check/${reservationId}`
    );
    const response = await axios.get(
      `https://tubitak-proje.dev.reisetech.io/api/metapersona/api/ReservationConfirmed/check/${reservationId}`
    );
    console.log("Received response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error occurred while fetching reservation details:", error);
    throw error;
  }
};
