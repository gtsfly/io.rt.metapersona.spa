<template>
  <AdminLayout>
    <div class="admin-home">
      <div class="dashboard-header">
        <h1>Meta Persona Dashboard</h1>
        <div class="header-actions">
          <div class="date-display">{{ getCurrentDate() }}</div>
        </div>
      </div>

      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-icon users">
            <img
              src="../../assets/logos/black-user.svg"
              alt="Users"
              class="icon"
            />
          </div>
          <div class="stat-details">
            <h3>Total Users</h3>
            <p class="stat-number">{{ stats.users }}</p>
            <p class="stat-label">Registered Users</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon reservations">
            <img
              src="../../assets/logos/black-reservation.svg"
              alt="Reservations"
              class="icon"
            />
          </div>
          <div class="stat-details">
            <h3>Reservations</h3>
            <p class="stat-number">{{ stats.reservations }}</p>
            <p class="stat-label">Total Bookings</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon hotels">
            <img
              src="../../assets/logos/black-hotel.svg"
              alt="Hotels"
              class="icon"
            />
          </div>
          <div class="stat-details">
            <h3>Hotels</h3>
            <p class="stat-number">{{ stats.hotels }}</p>
            <p class="stat-label">Partner Hotels</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon experiences">
            <img
              src="../../assets/logos/black-experience.svg"
              alt="Experiences"
              class="icon"
            />
          </div>
          <div class="stat-details">
            <h3>Experiences</h3>
            <p class="stat-number">{{ stats.experiences }}</p>
            <p class="stat-label">Unique Experiences</p>
          </div>
        </div>
      </div>

      <div class="content-wrapper">
        <div class="admin-summary">
          <div class="section-header">
            <h2>Dashboard Overview</h2>
            <div class="date-badge">
              {{ getCurrentDate() }}
            </div>
          </div>
          <div class="summary-grid">
            <div class="summary-card">
              <h3>Active Requests</h3>
              <div class="summary-content">
                <div class="summary-number">
                  {{ getActiveRequestCount() }}
                </div>
                <div
                  class="summary-trend positive"
                  v-if="getActiveRequestCount() > 0"
                >
                  <span>+{{ getActiveRequestCount() }}</span>
                  <span>Active</span>
                </div>
              </div>
            </div>

            <div class="summary-card">
              <h3>Confirmed Requests</h3>
              <div class="summary-content">
                <div class="summary-number">
                  {{ getConfirmedRequestCount() }}
                </div>
                <div
                  class="summary-trend positive"
                  v-if="getConfirmedRequestCount() > 0"
                >
                  <span>+{{ getConfirmedRequestCount() }}</span>
                  <span>Confirmed</span>
                </div>
              </div>
            </div>

            <div class="summary-card">
              <h3>Total Revenue</h3>
              <div class="summary-content">
                <div class="summary-number">₺{{ getTotalBudget() }}</div>
                <div class="summary-trend positive">
                  <span>Total Budget</span>
                </div>
              </div>
            </div>

            <div class="summary-card">
              <h3>Average Budget</h3>
              <div class="summary-content">
                <div class="summary-number">₺{{ getAverageBudget() }}</div>
                <div class="summary-trend">
                  <span>Per Request</span>
                </div>
              </div>
            </div>
          </div>

          <div class="dashboard-grid">
            <div class="dashboard-card locations-card">
              <h3>Popular Locations</h3>
              <div class="locations-list">
                <div
                  v-for="location in getTopLocations()"
                  :key="location.name"
                  class="location-item"
                >
                  <div class="location-info">
                    <span class="location-name">{{ location.name }}</span>
                    <span class="location-count"
                      >{{ location.count }} requests</span
                    >
                  </div>
                  <div class="location-bar">
                    <div
                      class="location-progress"
                      :style="{ width: location.percentage + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="dashboard-card activity-card">
              <h3>Recent Activity</h3>
              <div class="activity-list">
                <router-link
                  v-for="activity in getRecentActivity()"
                  :key="activity.id"
                  :to="{
                    name: 'UserRecommendationComponent',
                    query: { identifier: activity.id },
                  }"
                  class="activity-item"
                >
                  <div class="activity-icon" :class="activity.type">
                    <i :class="getActivityIcon(activity.type)"></i>
                  </div>
                  <div class="activity-details">
                    <div class="activity-title">{{ activity.title }}</div>
                    <div class="activity-time">
                      {{ formatActivityTime(activity.time) }}
                    </div>
                  </div>
                </router-link>
              </div>
            </div>

            <div class="dashboard-card stats-card">
              <h3>Request Statistics</h3>
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-icon-small">
                    <i class="fas fa-calendar-day"></i>
                  </div>
                  <div class="stat-info">
                    <div class="stat-label">Average Stay</div>
                    <div class="stat-value">
                      {{ getAverageStayDuration() }} days
                    </div>
                  </div>
                </div>
                <div class="stat-item">
                  <div class="stat-icon-small">
                    <i class="fas fa-users"></i>
                  </div>
                  <div class="stat-info">
                    <div class="stat-label">Common Group Size</div>
                    <div class="stat-value">
                      {{ getMostCommonGroupSize() }} people
                    </div>
                  </div>
                </div>
                <div class="stat-item">
                  <div class="stat-icon-small">
                    <i class="fas fa-child"></i>
                  </div>
                  <div class="stat-info">
                    <div class="stat-label">Average Children</div>
                    <div class="stat-value">
                      {{ getAverageChildrenCount() }}
                    </div>
                  </div>
                </div>
                <div class="stat-item">
                  <div class="stat-icon-small">
                    <i class="fas fa-map-marker-alt"></i>
                  </div>
                  <div class="stat-info">
                    <div class="stat-label">Top Location</div>
                    <div class="stat-value">{{ getTopLocation() }}</div>
                  </div>
                </div>
                <div class="stat-item">
                  <div class="stat-icon-small">
                    <i class="fas fa-star"></i>
                  </div>
                  <div class="stat-info">
                    <div class="stat-label">Top Experience</div>
                    <div class="stat-value">{{ getTopExperience() }}</div>
                  </div>
                </div>
                <div class="stat-item">
                  <div class="stat-icon-small">
                    <i class="fas fa-money-bill-wave"></i>
                  </div>
                  <div class="stat-info">
                    <div class="stat-label">Average Budget</div>
                    <div class="stat-value">
                      ₺{{ formatBudget(getAverageBudgetValue()) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="recent-activities">
          <div class="section-header">
            <h2>Recent Reservation Requests</h2>
            <div class="section-actions">
              <div class="filter-group">
                <select v-model="statusFilter" class="filter-select">
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="confirmed">Confirmed</option>
                </select>
                <select v-model="timeFilter" class="filter-select">
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
              <button class="refresh-btn" @click="refreshData">
                <i class="fas fa-sync"></i> Refresh
              </button>
            </div>
          </div>

          <div class="table-responsive">
            <table class="reservations-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Budget</th>
                  <th>Status</th>
                  <th>Request Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="reservation_request in filteredReservations"
                  :key="reservation_request.reservation_request_id"
                  class="table-row"
                >
                  <td class="id-column">
                    #{{ reservation_request.reservation_request_id }}
                  </td>
                  <td class="name-column">
                    {{ reservation_request.user_name }}
                  </td>
                  <td class="budget-column">
                    ₺{{ formatBudget(reservation_request.budget) }}
                  </td>
                  <td
                    :class="[
                      'status-column',
                      getStatusClass(
                        reservation_request.reservation_request_id
                      ),
                    ]"
                  >
                    <div class="status-wrapper">
                      <div class="status-indicator"></div>
                      <span>{{
                        getReservationStatus(
                          reservation_request.reservation_request_id
                        )
                      }}</span>
                    </div>
                  </td>
                  <td class="date-column">
                    {{ formatDate(reservation_request.created_at) }}
                  </td>
                  <td class="actions-column">
                    <router-link
                      :to="{
                        name: 'UserRecommendationComponent',
                        query: {
                          identifier:
                            reservation_request.reservation_request_id,
                        },
                      }"
                    >
                      <button class="action-btn view-btn">View Details</button>
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="table-footer">
            <div class="table-stats">
              <div class="stat-pill">
                <span class="stat-label">Total Requests:</span>
                <span class="stat-value">{{ recentReservations.length }}</span>
              </div>
              <div class="stat-pill">
                <span class="stat-label">Active:</span>
                <span class="stat-value">{{ getActiveRequestCount() }}</span>
              </div>
              <div class="stat-pill">
                <span class="stat-label">Confirmed:</span>
                <span class="stat-value">{{ getConfirmedRequestCount() }}</span>
              </div>
              <div class="stat-pill">
                <span class="stat-label">Average Budget:</span>
                <span class="stat-value">₺{{ getAverageBudget() }}</span>
              </div>
            </div>

            <div class="pagination">
              <button
                class="pagination-btn"
                :disabled="currentPage === 1"
                @click="currentPage--"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              <span class="page-info">
                Page {{ currentPage }} / {{ totalPages }}
              </span>
              <button
                class="pagination-btn"
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
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

export default {
  name: "AdminHome",
  components: {
    AdminLayout,
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
      statusFilter: "all",
      timeFilter: "all",
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    filteredReservations() {
      let filtered = [...this.recentReservations];

      // Status filter
      if (this.statusFilter !== "all") {
        filtered = filtered.filter((req) => {
          const isConfirmed =
            this.confirmedStatuses[req.reservation_request_id];
          return this.statusFilter === "confirmed" ? isConfirmed : !isConfirmed;
        });
      }

      // Time filter
      const now = new Date();
      if (this.timeFilter !== "all") {
        filtered = filtered.filter((req) => {
          const reqDate = new Date(req.created_at);
          switch (this.timeFilter) {
            case "today":
              return reqDate.toDateString() === now.toDateString();
            case "week": {
              const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              return reqDate >= weekAgo;
            }
            case "month":
              return (
                reqDate.getMonth() === now.getMonth() &&
                reqDate.getFullYear() === now.getFullYear()
              );
            default:
              return true;
          }
        });
      }

      // Pagination
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return filtered.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.recentReservations.length / this.itemsPerPage);
    },
  },
  async mounted() {
    await this.loadData();
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (!isAdminLoggedIn) {
      this.$router.push("/admin");
    }
  },
  methods: {
    async loadData() {
      this.stats = await getStats();
      this.recentReservations = await getRecentReservations();
      await this.checkAllReservationsConfirmed();
    },
    async refreshData() {
      await this.loadData();
    },
    getCurrentDate() {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date().toLocaleDateString("tr-TR", options);
    },
    formatBudget(budget) {
      return budget.toLocaleString("tr-TR");
    },
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
        hour: "2-digit",
        minute: "2-digit",
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
    getActiveRequestCount() {
      return this.recentReservations.filter(
        (req) => !this.confirmedStatuses[req.reservation_request_id]
      ).length;
    },
    getConfirmedRequestCount() {
      return this.recentReservations.filter(
        (req) => this.confirmedStatuses[req.reservation_request_id]
      ).length;
    },
    getTotalBudget() {
      const total = this.recentReservations.reduce(
        (sum, req) => sum + req.budget,
        0
      );
      return this.formatBudget(total);
    },
    getAverageBudget() {
      if (this.recentReservations.length === 0) return "0";
      const total = this.recentReservations.reduce(
        (sum, req) => sum + req.budget,
        0
      );
      const average = total / this.recentReservations.length;
      return this.formatBudget(Math.round(average));
    },
    getTopLocations() {
      const locations = {};
      this.recentReservations.forEach((req) => {
        locations[req.location] = (locations[req.location] || 0) + 1;
      });

      const sortedLocations = Object.entries(locations)
        .map(([name, count]) => ({
          name,
          count,
          percentage: (count / this.recentReservations.length) * 100,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return sortedLocations;
    },
    getRecentActivity() {
      return this.recentReservations
        .slice()
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
        .map((req) => ({
          id: req.reservation_request_id,
          type: this.confirmedStatuses[req.reservation_request_id]
            ? "confirmed"
            : "pending",
          title: `${req.user_name} - ${req.location}`,
          time: req.created_at,
        }));
    },
    getActivityIcon(type) {
      return {
        confirmed: "fas fa-check-circle",
        pending: "fas fa-clock",
        cancelled: "fas fa-times-circle",
      }[type];
    },
    formatActivityTime(time) {
      const date = new Date(time);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));

      if (hours < 24) {
        return `${hours} saat önce`;
      }
      return this.formatDate(time);
    },
    getAverageStayDuration() {
      if (this.recentReservations.length === 0) return 0;
      const total = this.recentReservations.reduce(
        (sum, req) => sum + req.stay_duration,
        0
      );
      return Math.round(total / this.recentReservations.length);
    },
    getMostCommonGroupSize() {
      if (this.recentReservations.length === 0) return 0;
      const groupSizes = this.recentReservations.map(
        (req) => req.adult_num + (req.child_num || 0)
      );
      const counts = {};
      let maxCount = 0;
      let mostCommon = 0;

      groupSizes.forEach((size) => {
        counts[size] = (counts[size] || 0) + 1;
        if (counts[size] > maxCount) {
          maxCount = counts[size];
          mostCommon = size;
        }
      });

      return mostCommon;
    },
    getTopExperience() {
      if (this.recentReservations.length === 0) return "N/A";
      const experiences = {};

      this.recentReservations.forEach((req) => {
        if (req.exp_1)
          experiences[req.exp_1] =
            (experiences[req.exp_1] || 0) + req.exp_1_rating;
        if (req.exp_2)
          experiences[req.exp_2] =
            (experiences[req.exp_2] || 0) + req.exp_2_rating;
        if (req.exp_3)
          experiences[req.exp_3] =
            (experiences[req.exp_3] || 0) + req.exp_3_rating;
      });

      const topExp = Object.entries(experiences).sort(
        ([, a], [, b]) => b - a
      )[0];

      return topExp ? topExp[0] : "N/A";
    },
    getAverageChildrenCount() {
      if (this.recentReservations.length === 0) return "0";
      const total = this.recentReservations.reduce(
        (sum, req) => sum + (req.child_num || 0),
        0
      );
      return (total / this.recentReservations.length).toFixed(1);
    },
    getTopLocation() {
      if (this.recentReservations.length === 0) return "N/A";
      const locations = {};
      this.recentReservations.forEach((req) => {
        locations[req.location] = (locations[req.location] || 0) + 1;
      });
      const topLocation = Object.entries(locations).sort(
        ([, a], [, b]) => b - a
      )[0];
      return topLocation ? topLocation[0] : "N/A";
    },
    getAverageBudgetValue() {
      if (this.recentReservations.length === 0) return 0;
      const total = this.recentReservations.reduce(
        (sum, req) => sum + req.budget,
        0
      );
      return Math.round(total / this.recentReservations.length);
    },
  },
};
</script>

<style scoped>
.admin-home {
  padding: 24px;
  max-width: 1600px;
  margin: 0 auto;
  background-color: #f8f9fa;
  min-height: calc(100vh - 64px);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.dashboard-header h1 {
  font-size: 28px;
  color: #1a1a1a;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.date-display {
  font-size: 14px;
  color: #666;
  background-color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}

.stat-icon.users {
  background-color: #e3f2fd;
}
.stat-icon.reservations {
  background-color: #e8f5e9;
}
.stat-icon.hotels {
  background-color: #fff3e0;
}
.stat-icon.experiences {
  background-color: #f3e5f5;
}

.icon {
  width: 32px;
  height: 32px;
}

.stat-details h3 {
  margin: 0;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.stat-number {
  margin: 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
}

.stat-label {
  margin: 0;
  font-size: 12px;
  color: #888;
}

.content-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.admin-summary {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.summary-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.2s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.summary-card h3 {
  margin: 0;
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.summary-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.summary-number {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
}

.summary-trend {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 12px;
  color: #666;
}

.summary-trend.positive {
  color: #2e7d32;
}

.summary-trend.negative {
  color: #c62828;
}

.recent-activities {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 20px;
  color: #1a1a1a;
  margin: 0;
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.filter-group {
  display: flex;
  gap: 16px;
}

.filter-select {
  padding: 8px 16px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  background-color: #fff;
  color: #495057;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 36px;
  min-width: 140px;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 8px;
  padding-right: 32px;
}

.filter-select:hover {
  border-color: #adb5bd;
}

.filter-select:focus {
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
}

.refresh-btn {
  background-color: #fff;
  color: #1976d2;
  border: 1px solid #1976d2;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  height: 36px;
  min-width: 100px;
  white-space: nowrap;
}

.reservations-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
}

.reservations-table th {
  background-color: #f8f9fa;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  text-align: left;
  border-bottom: 2px solid #e9ecef;
}

.reservations-table td {
  padding: 16px;
  font-size: 14px;
  vertical-align: middle;
}

.id-column {
  font-weight: 500;
  color: #666;
  width: 8%;
}

.name-column {
  font-weight: 500;
  color: #1a1a1a;
  width: 25%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.budget-column {
  font-weight: 500;
  color: #2e7d32;
  width: 15%;
}

.status-column {
  width: 15%;
}

.status-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-bottom: 4px;
}

.date-column {
  width: 22%;
  color: #666;
}

.actions-column {
  width: 15%;
  text-align: right;
}

.status_active .status-indicator {
  background-color: #4caf50;
}

.status_active {
  color: #2e7d32;
}

.status_confirmed .status-indicator {
  background-color: #1976d2;
}

.status_confirmed {
  color: #1565c0;
}

.table-responsive {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.reservations-table tbody tr:last-child {
  border-bottom: none;
}

.reservations-table tbody tr:last-child td {
  border-bottom: none;
}

.action-btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  min-width: 100px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.view-btn {
  background-color: #1976d2;
  color: white;
}

.view-btn:hover {
  background-color: #1565c0;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 24px;
}

.dashboard-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.dashboard-card h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #1a1a1a;
}

.locations-card {
  grid-column: span 2;
}

.locations-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.location-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.location-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.location-name {
  font-weight: 500;
  color: #1a1a1a;
}

.location-count {
  font-size: 12px;
  color: #666;
}

.location-bar {
  height: 6px;
  background: #f1f3f5;
  border-radius: 3px;
  overflow: hidden;
}

.location-progress {
  height: 100%;
  background: linear-gradient(90deg, #4caf50 0%, #81c784 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  text-decoration: none;
  cursor: pointer;
}

.activity-item:hover {
  background-color: #f8f9fa;
  transform: translateY(-1px);
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  position: relative;
}

.activity-icon::after {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  bottom: -2px;
  right: -2px;
  border: 2px solid #fff;
}

.activity-icon.confirmed {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.activity-icon.confirmed::after {
  background-color: #4caf50;
}

.activity-icon.pending {
  background-color: #fff3e0;
  color: #f57c00;
}

.activity-icon.pending::after {
  background-color: #ff9800;
}

.activity-icon.cancelled {
  background-color: #ffebee;
  color: #c62828;
}

.activity-icon.cancelled::after {
  background-color: #f44336;
}

.activity-details {
  flex: 1;
}

.activity-title {
  font-weight: 500;
  color: #1a1a1a;
}

.activity-time {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.stat-item {
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stat-icon-small {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  color: #1976d2;
  font-size: 16px;
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-info .stat-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-info .stat-value {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.date-badge {
  background: #f8f9fa;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  color: #666;
}

.table-footer {
  margin-top: 20px;
  padding: 16px;
  background: #ffffff;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.table-stats {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.stat-pill {
  background: #f8f9fa;
  padding: 6px 12px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  line-height: 1;
}

.stat-label {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
  line-height: 1;
  margin: 0;
}

.stat-value {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1;
  margin: 0;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pagination-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #1976d2;
}

.pagination-btn:hover:not(:disabled) {
  background: #1976d2;
  border-color: #1976d2;
  color: #fff;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  color: #666;
}

.page-info {
  font-size: 14px;
  color: #495057;
}

@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .locations-card {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  .section-header {
    flex-direction: column;
    gap: 12px;
  }

  .filter-group {
    width: 100%;
  }

  .filter-select {
    flex: 1;
  }

  .table-footer {
    flex-direction: column;
    gap: 16px;
  }

  .table-stats {
    justify-content: center;
  }

  .pagination {
    justify-content: center;
  }
}
</style>
