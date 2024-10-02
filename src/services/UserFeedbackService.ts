import axios from "axios";
import { UserFeedbackDto } from "@/models/UserFeedbackDto";

export class UserFeedbackService {
  private apiUrl =
    "https://tubitak-proje.dev.reisetech.io/api/metapersona/api/UserHotelExperience";

  async getFeedbackById(id: number): Promise<UserFeedbackDto> {
    try {
      const response = await axios.get(`${this.apiUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error while fetching feedback:", error);
      throw error;
    }
  }

  async submitFeedback(feedback: UserFeedbackDto): Promise<void> {
    try {
      await axios.post(this.apiUrl, feedback);
    } catch (error) {
      console.error("Error while submitting feedback:", error);
      throw error;
    }
  }

  async getFeedbackByReservationId(
    reservationId: number
  ): Promise<UserFeedbackDto> {
    try {
      const response = await axios.get(`${this.apiUrl}/${reservationId}`);
      return response.data;
    } catch (error) {
      console.error("Error while fetching feedback by reservation ID:", error);
      throw error;
    }
  }
}
