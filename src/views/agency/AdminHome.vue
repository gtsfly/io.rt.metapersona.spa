<template>
  <AdminLayout>
    <div class="admin-home">
      <h1>Meta Persona Admin Panel</h1>

      <div class="stats-container">
        <div class="stat">
          <div class="stat-content">
            <img
              src="../../assets/logos/black-user.svg"
              alt="Logo"
              class="logo"
            />
            <h3>Users</h3>
          </div>
          <p>{{ stats.users }}</p>
        </div>

        <div class="stat">
          <div class="stat-content">
            <img
              src="../../assets/logos/black-reservation.svg"
              alt="Logo"
              class="logo"
            />
            <h3>Reservations</h3>
          </div>
          <p>{{ stats.reservations }}</p>
        </div>

        <div class="stat">
          <div class="stat-content">
            <img
              src="../../assets/logos/black-hotel.svg"
              alt="Logo"
              class="logo"
            />
            <h3>Hotels</h3>
          </div>
          <p>{{ stats.hotels }}</p>
        </div>

        <div class="stat">
          <div class="stat-content">
            <img
              src="../../assets/logos/black-experience.svg"
              alt="Logo"
              class="logo"
            />
            <h3>Experiences</h3>
          </div>
          <p>{{ stats.experiences }}</p>
        </div>
      </div>

      <div class="content-wrapper">
        <div class="admin-chart">
          <AdminChart
            :chartData="[
              stats.users,
              stats.reservations,
              stats.hotels,
              stats.experiences,
            ]"
          />
        </div>

        <div class="recent-activities">
          <h3>Recent Reservation Requests</h3>
          <div class="table-responsive">
            <table class="reservations-table">
              <thead>
                <tr>
                  <th>Request id</th>
                  <th>Name</th>
                  <th>Budget</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="reservation_request in recentReservations"
                  :key="reservation_request.reservation_request_id"
                >
                  <td>#{{ reservation_request.reservation_request_id }}</td>
                  <td>{{ reservation_request.user_name }}</td>
                  <td>₺{{ reservation_request.budget }}</td>
                  <td
                    :class="
                      getStatusClass(reservation_request.reservation_request_id)
                    "
                  >
                    <div class="status-indicator"></div>
                    <span>{{
                      getReservationStatus(
                        reservation_request.reservation_request_id
                      )
                    }}</span>
                  </td>
                  <td>{{ formatDate(reservation_request.created_at) }}</td>
                  <td>
                    <div class="button_td_back">
                      <router-link
                        :to="{
                          name: 'UserRecommendationComponent',
                          query: {
                            identifier:
                              reservation_request.reservation_request_id,
                          },
                        }"
                      >
                        <button class="button_td">Details</button>
                      </router-link>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script>
import AdminLayout from "./AdminLayout.vue";
import { getStats, getRecentReservations } from "../../services/statsService";
import { checkIfReservationConfirmed } from "../../services/ReservationConfirmedService";
import AdminChart from "../../views/agency/AdminChart.vue";

export default {
  name: "AdminHome",
  components: {
    AdminLayout,
    AdminChart,
  },
  data() {
    return {
      stats: {
        users: 0,
        reservations: 0,
        hotels: 0,
        experiences: 0,
      },
      recentReservations: [],
      confirmedStatuses: {},
    };
  },
  async mounted() {
    this.stats = await getStats();
    this.recentReservations = await getRecentReservations();

    // Check reservation status
    await this.checkAllReservationsConfirmed();
  },
  methods: {
    async checkAllReservationsConfirmed() {
      for (const reservation of this.recentReservations) {
        const isConfirmed = await checkIfReservationConfirmed(
          reservation.reservation_request_id
        );
        this.confirmedStatuses[reservation.reservation_request_id] =
          isConfirmed;
      }
    },
    formatDate(dateString) {
      const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };
      return new Date(dateString).toLocaleDateString("tr-TR", options);
    },
    getReservationStatus(reservation_request_id) {
      return this.confirmedStatuses[reservation_request_id]
        ? "Confirmed"
        : "Active";
    },
    getStatusClass(reservation_request_id) {
      return this.confirmedStatuses[reservation_request_id]
        ? "status_confirmed"
        : "status_active";
    },
  },
};
</script>

<style scoped>
.admin-home {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.stats-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 30px;
}

.stat {
  flex: 1 1 200px;
  background: #ffffff;
  box-shadow: 0 4px 9px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
}

.content-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}

.admin-chart,
.recent-activities {
  flex: 1 1 400px;
  background: #ffffff;
  box-shadow: 0 4px 9px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  padding: 20px;
}

.table-responsive {
  overflow-x: auto;
}

.reservations-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
}

.reservations-table th,
.reservations-table td {
  padding: 15px;
  text-align: left;
  font-size: 14px;
}

.reservations-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.reservations-table tr {
  background-color: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.button_td {
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  padding: 8px 15px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button_td:hover {
  background-color: #0056b3;
}

@media (max-width: 768px) {
  .stats-container {
    flex-direction: column;
  }

  .stat {
    flex-basis: 100%;
  }

  .content-wrapper {
    flex-direction: column;
  }

  .admin-chart,
  .recent-activities {
    flex-basis: 100%;
  }

  .reservations-table th,
  .reservations-table td {
    padding: 10px;
    font-size: 12px;
  }
}

.status_active,
.status_confirmed {
  display: flex;
  align-items: center;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
}

.status_active .status-indicator {
  background-color: #28a745; /* Yeşil */
}

.status_confirmed .status-indicator {
  background-color: #dc3545; /* Kırmızı */
}
</style>
