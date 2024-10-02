import axios from "axios";

interface OfferDetails {
  offer_key: string;
  check_in_date: string;
  check_out_date: string;
  price: number;
  room_type: string;
  reservation_request_id: number;
  hotel_id: number;
}

export async function saveReservationOffer(
  offer_key: string,
  offerDetails: OfferDetails
) {
  const API_BASE_URL =
    "https://tubitak-proje.dev.reisetech.io/api/metapersona/api/ReservationOffer";
  try {
    const existingOffer = await getReservationOffer(offer_key);
    if (existingOffer) {
      const response = await axios.put(
        `${API_BASE_URL}/${offer_key}`,
        offerDetails
      );
      return response.data;
    } else {
      const response = await axios.post(API_BASE_URL, offerDetails);
      return response.data;
    }
  } catch (error) {
    console.error("Failed to save reservation offer:", error);
    throw error;
  }
}

export async function getReservationOffer(
  offer_key: string
): Promise<OfferDetails | null> {
  const API_BASE_URL =
    "https://tubitak-proje.dev.reisetech.io/api/metapersona/api/ReservationOffer";
  try {
    const response = await axios.get(`${API_BASE_URL}/${offer_key}`);
    return response.data as OfferDetails;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 404) {
        return null;
      }
    } else {
      console.error("Failed to fetch reservation offer:", error);
    }
    throw error;
  }
}
