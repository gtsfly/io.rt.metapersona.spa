import axios from "axios";
import { ReservationRequestDto } from "../models/ReservationRequestDto";

const API_BASE_URL =
  "https://tubitak-proje.dev.reisetech.io/api/metapersona/api/ReservationRequest";

export const getAllReservations = async (): Promise<
  ReservationRequestDto[]
> => {
  const response = await axios.get(`${API_BASE_URL}`);
  return response.data.map(
    (res: any) =>
      new ReservationRequestDto(
        res.reservation_request_id,
        res.user_id,
        res.user_name,
        new Date(res.check_in_range_start),
        new Date(res.check_in_range_end),
        res.budget,
        res.location,
        res.stay_duration,
        res.exp_1,
        res.exp_1_rating,
        res.exp_2,
        res.exp_2_rating,
        res.exp_3,
        res.exp_3_rating,
        res.adult_num,
        res.child_num,
        res.children_ages
      )
  );
};

export const getReservationById = async (
  id: number
): Promise<ReservationRequestDto> => {
  const response = await axios.get(`${API_BASE_URL}/${id}`);
  const res = response.data;
  return new ReservationRequestDto(
    res.reservation_request_id,
    res.user_id,
    res.user_name,
    new Date(res.check_in_range_start),
    new Date(res.check_in_range_end),
    res.budget,
    res.location,
    res.stay_duration,
    res.exp_1,
    res.exp_1_rating,
    res.exp_2,
    res.exp_2_rating,
    res.exp_3,
    res.exp_3_rating,
    res.adult_num,
    res.child_num,
    res.children_ages
  );
};

export const createReservation = async (
  dto: ReservationRequestDto
): Promise<ReservationRequestDto> => {
  const response = await axios.post(`${API_BASE_URL}`, dto);
  const res = response.data;
  return new ReservationRequestDto(
    res.reservation_request_id,
    res.user_id,
    res.user_name,
    new Date(res.check_in_range_start),
    new Date(res.check_in_range_end),
    res.budget,
    res.location,
    res.stay_duration,
    res.exp_1,
    res.exp_1_rating,
    res.exp_2,
    res.exp_2_rating,
    res.exp_3,
    res.exp_3_rating,
    res.adult_num,
    res.child_num,
    res.children_ages
  );
};

export const updateReservation = async (
  id: number,
  dto: ReservationRequestDto
): Promise<void> => {
  await axios.put(`${API_BASE_URL}/${id}`, dto);
};

export const deleteReservation = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};

export const getReservationRequestById = async (
  reservation_request_id: number
): Promise<ReservationRequestDto> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/${reservation_request_id}`
    );
    return response.data as ReservationRequestDto;
  } catch (error) {
    console.error(
      `Error fetching reservation request with ID ${reservation_request_id}:`,
      error
    );
    throw error;
  }
};
