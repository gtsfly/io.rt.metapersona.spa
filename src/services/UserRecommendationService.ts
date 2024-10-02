import axios from "axios";
import { HotelDto } from "../models/HotelDto";
import { ReservationRequestDto } from "@/models/ReservationRequestDto";

const API_BASE_URL =
  "https://tubitak-proje.dev.reisetech.io/api/metapersona/api/UserRecommendation";

export const getRecommendedHotels = async (
  userId: number
): Promise<HotelDto[]> => {
  const response = await axios.post(`${API_BASE_URL}/recommend/${userId}`);
  return response.data
    .slice(0, 5)
    .map(
      (hotel: any) =>
        new HotelDto(hotel.hotel_id, hotel.name, hotel.location, hotel.rating)
    );
};

export const getReservationRequest = async (userId: number) => {
  const response = await axios.get(
    `https://tubitak-proje.dev.reisetech.io/api/metapersona/api/reservationRequest/${userId}`
  );
  return response.data;
};
