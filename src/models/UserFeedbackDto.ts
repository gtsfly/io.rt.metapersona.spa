export interface UserFeedbackDto {
  user_id: number;
  user_name: string;
  hotel_id: number;
  reservation_request_id: number;
  overall_rating: number | null;
  experience_1: string;
  experience_1_rating: number | null;
  experience_2: string;
  experience_2_rating: number | null;
  experience_3: string;
  experience_3_rating: number | null;
  most_liked_experience: string;
  least_liked_experience: string;
  would_visit_again: boolean;
  additional_comments: string;
}
