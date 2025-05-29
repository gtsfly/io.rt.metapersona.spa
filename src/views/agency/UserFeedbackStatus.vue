<template>
  <AdminLayout>
    <div class="container mt-5">
      <h2>Confirmed Reservation List</h2>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Confirmed Reservation ID</th>
            <th>User Name</th>
            <th>Hotel Name</th>
            <th>Check-in Date</th>
            <th>Check-out Date</th>
            <th>Feedback Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="reservation in confirmedReservations"
            :key="reservation.reservationId"
          >
            <td>{{ reservation.reservationId }}</td>
            <td>{{ reservation.userName }}</td>
            <td>{{ reservation.hotelName }}</td>
            <td>{{ formatDate(reservation.checkInDate) }}</td>
            <td>{{ formatDate(reservation.checkOutDate) }}</td>
            <td>
              <button
                @click="goToUserFeedback(reservation.reservationId)"
                :class="[
                  'btn',
                  reservation.hasFeedback ? 'btn-success' : 'btn-warning',
                ]"
              >
                {{ reservation.hasFeedback ? "Feedback Available" : "Pending" }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </AdminLayout>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import AdminLayout from "./AdminLayout.vue";
import { getUserNameByUserId } from "@/services/UserService";
import { useRouter } from "vue-router";

export default {
  name: "UserFeedbackStatus",
  components: {
    AdminLayout,
  },
  setup() {
    const confirmedReservations = ref([]);
    const router = useRouter();

    const getHotelName = async (hotelId) => {
      try {
        const response = await axios.get(
          `https://localhost:7018/api/Hotel/${hotelId}`
        );
        return response.data.name;
      } catch (error) {
        console.error("Error occurred while fetching hotel name:", error);
        return "Unknown Hotel";
      }
    };

    const fetchConfirmedReservationsWithFeedbackStatus = async () => {
      try {
        const [reservationsResponse, feedbackStatusResponse] =
          await Promise.all([
            axios.get("https://localhost:7018/api/ReservationConfirmed"),
            axios.get(
              "https://localhost:7018/api/UserHotelExperience/feedback-status"
            ),
          ]);

        const reservations = reservationsResponse.data;
        const feedbackStatuses = feedbackStatusResponse.data;

        confirmedReservations.value = await Promise.all(
          reservations.map(async (reservation) => {
            const feedbackStatus = feedbackStatuses.find(
              (status) =>
                status.ReservationId === reservation.confirmed_reservation_id
            );
            const userId = reservation.user_id;
            const userName = await getUserNameByUserId(userId);
            const hotelName = await getHotelName(reservation.hotel_id);
            return {
              ...reservation,
              reservationId: reservation.confirmed_reservation_id,
              userName: userName,
              hotelName: hotelName,
              checkInDate: reservation.check_in_date,
              checkOutDate: reservation.check_out_date,
              hasFeedback: feedbackStatus ? feedbackStatus.HasFeedback : false,
            };
          })
        );
      } catch (error) {
        console.error(
          "Error occurred while fetching reservations and feedback statuses:",
          error
        );
      }
    };

    const goToUserFeedback = (reservationId) => {
      localStorage.setItem("selectedReservationId", reservationId);
      router.push(`/admin/user-feedback?reservationId=${reservationId}`);
    };

    const formatDate = (dateString) => {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString("en-US", options);
    };

    onMounted(fetchConfirmedReservationsWithFeedbackStatus);

    return {
      confirmedReservations,
      formatDate,
      goToUserFeedback,
    };
  },
  mounted() {
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (!isAdminLoggedIn) {
      this.$router.push("/admin");
    }
  },
};
</script>

<style scoped>
.table {
  margin-top: 20px;
}

.btn {
  width: 100%;
}
</style>
