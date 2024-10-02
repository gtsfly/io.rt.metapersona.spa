<template>
  <AdminLayout>
    <div class="container mt-5">
      <h1 class="mb-4">User Hotel Experience Feedback</h1>

      <!-- Search bar -->
      <div class="mb-4">
        <input
          v-model="searchReservationId"
          type="number"
          class="form-control"
          placeholder="Enter Reservation ID"
          @keyup.enter="searchReservation"
        />
        <button @click="searchReservation" class="btn btn-primary mt-2">
          Search
        </button>
      </div>

      <!-- Search Results -->
      <div
        v-if="searchPerformed && reservationDetails"
        class="reservation-details mb-4"
      >
        <h4 class="details-title">Reservation Details</h4>
        <div class="details-grid">
          <div class="detail-item">
            <span class="detail-label">Reservation ID:</span>
            <span class="detail-value">{{
              reservationDetails.confirmed_reservation_id
            }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">User Name:</span>
            <span class="detail-value">{{ reservationDetails.user_name }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">User ID:</span>
            <span class="detail-value">{{ reservationDetails.user_id }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Hotel ID:</span>
            <span class="detail-value">{{ reservationDetails.hotel_id }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Check-in Date:</span>
            <span class="detail-value">
              {{
                new Date(reservationDetails.check_in_date).toLocaleDateString(
                  "en-US"
                )
              }}
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Check-out Date:</span>
            <span class="detail-value">
              {{
                new Date(reservationDetails.check_out_date).toLocaleDateString(
                  "en-US"
                )
              }}
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Price:</span>
            <span class="detail-value">{{ reservationDetails.price }} TL</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Room Type:</span>
            <span class="detail-value">{{ reservationDetails.room_type }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Board Type:</span>
            <span class="detail-value">{{
              reservationDetails.board_type
            }}</span>
          </div>
        </div>
      </div>

      <!-- Feedback form -->
      <form v-if="searchPerformed" @submit.prevent="submitFeedback">
        <div class="mb-3">
          <label for="overall_rating" class="form-label">Overall Rating:</label>
          <input
            v-model="feedback.overall_rating"
            type="number"
            class="form-control"
            id="overall_rating"
            min="1"
            max="10"
            placeholder="Enter rating"
            required
          />
        </div>

        <div
          class="mb-3"
          v-for="(experience, index) in [
            feedback.experience_1,
            feedback.experience_2,
            feedback.experience_3,
          ]"
          :key="index"
        >
          <label :for="`experience_${index + 1}_rating`" class="form-label">
            '{{ experience }}' Rating:
          </label>
          <input
            v-model="feedback[`experience_${index + 1}_rating`]"
            type="number"
            class="form-control"
            :id="`experience_${index + 1}_rating`"
            min="1"
            max="10"
            placeholder="Enter rating"
            required
          />
        </div>

        <div class="mb-3">
          <label for="would_visit_again" class="form-label"
            >Would You Visit Again?</label
          >
          <select
            v-model="feedback.would_visit_again"
            class="form-control"
            id="would_visit_again"
            required
          >
            <option :value="true">Yes</option>
            <option :value="false">No</option>
          </select>
        </div>

        <div class="mb-3">
          <label for="additional_comments" class="form-label"
            >Additional Comments:</label
          >
          <textarea
            v-model="feedback.additional_comments"
            class="form-control"
            id="additional_comments"
            rows="3"
            placeholder="Enter additional comments"
          ></textarea>
        </div>

        <button type="submit" class="btn btn-primary">Submit Feedback</button>
      </form>
    </div>
  </AdminLayout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive } from "vue";
import AdminLayout from "./AdminLayout.vue";
import { useToast } from "vue-toastification";
import { UserFeedbackService } from "@/services/UserFeedbackService";
import { UserFeedbackDto } from "@/models/UserFeedbackDto";
import { getReservationDetails } from "@/services/ReservationConfirmedService";
import { getHotelName } from "@/services/HotelService";
import { getReservationRequestById } from "@/services/ReservationRequestService";
import { ReservationConfirmedDto } from "@/models/ReservationConfirmedDto";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "UserFeedbackComponent",
  components: {
    AdminLayout,
  },
  setup() {
    const toast = useToast();
    const router = useRouter();
    const userFeedbackService = new UserFeedbackService();
    const searchReservationId = ref("");
    const hotel_name = ref("");
    const searchPerformed = ref(false);
    const reservationDetails = ref<ReservationConfirmedDto | null>(null);

    const feedback = reactive<UserFeedbackDto>({
      user_id: 0,
      user_name: "",
      hotel_id: 0,
      reservation_request_id: 0,
      overall_rating: null,
      experience_1: "",
      experience_1_rating: null,
      experience_2: "",
      experience_2_rating: null,
      experience_3: "",
      experience_3_rating: null,
      most_liked_experience: "",
      least_liked_experience: "",
      would_visit_again: false,
      additional_comments: "",
    });

    const searchReservation = async () => {
      try {
        reservationDetails.value = await getReservationDetails(
          searchReservationId.value
        );

        feedback.reservation_request_id =
          reservationDetails.value.confirmed_reservation_id || 0;
        feedback.user_id = reservationDetails.value.user_id;
        feedback.hotel_id = reservationDetails.value.hotel_id;
        feedback.user_name = reservationDetails.value.user_name;
        hotel_name.value = await getHotelName(feedback.hotel_id);

        const reservationRequest = await getReservationRequestById(
          reservationDetails.value.reservation_request_id
        );
        feedback.experience_1 = reservationRequest.exp_1;
        feedback.experience_2 = reservationRequest.exp_2;
        feedback.experience_3 = reservationRequest.exp_3;
        feedback.most_liked_experience = reservationRequest.exp_1;
        feedback.least_liked_experience = reservationRequest.exp_3;
        console.log(`Experience 1: ${feedback.experience_1}`);
        console.log(`Experience 2: ${feedback.experience_2}`);
        console.log(`Experience 3: ${feedback.experience_3}`);

        searchPerformed.value = true;
        toast.success("Reservation details loaded successfully.");
      } catch (error) {
        toast.error(
          "No reservation found with this ID or the reservation has not been confirmed yet."
        );
        console.error("Reservation search error:", error);
        searchPerformed.value = false;
        reservationDetails.value = null;
      }
    };

    onMounted(() => {
      const storedReservationId = localStorage.getItem("selectedReservationId");
      if (storedReservationId) {
        searchReservationId.value = storedReservationId;
        searchReservation();
        localStorage.removeItem("selectedReservationId");
      }
    });

    return {
      toast,
      router,
      userFeedbackService,
      searchReservationId,
      searchReservation,
      feedback,
      hotel_name,
      searchPerformed,
      reservationDetails,
    };
  },
  methods: {
    async submitFeedback() {
      try {
        await this.userFeedbackService.submitFeedback(
          this.feedback as UserFeedbackDto
        );
        this.toast.success("Feedback submitted successfully!");
        this.router.push("/admin");
      } catch (error) {
        this.toast.error("An error occurred while submitting feedback.");
        console.error("Feedback submission error:", error);
      }
    },
  },
});
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #444;
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
}

.form-label {
  font-weight: 600;
  color: #555;
  margin-bottom: 0.5rem;
}

.form-control {
  border: 2px solid #ced4da;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.2);
}

.disabled-input {
  background-color: #e9ecef;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #007bff;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 8px;
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;
  width: 100%;
}

.btn-primary:hover {
  background-color: #0056b3;
  box-shadow: 0 4px 8px rgba(0, 91, 187, 0.2);
}

.alert {
  font-size: 1.1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  color: #495057;
}

.reservation-details {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.details-title {
  color: #007bff;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.detail-item {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 0.8rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.detail-label {
  display: block;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
}

.detail-value {
  display: block;
  color: #212529;
  font-size: 1rem;
}
</style>
