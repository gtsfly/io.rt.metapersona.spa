<template>
  <AdminLayout :current_user_name="current_user_name">
    <div class="recommendation-container">
      <!-- Search Section -->
      <div class="search-section">
        <div class="search-card">
          <h2 class="search-title">Reservation Request Search</h2>
          <form @submit.prevent="fetchRecommendations" class="search-form">
            <div class="input-group">
              <input
                type="text"
                v-model="identifier"
                id="identifier"
                class="search-input"
                placeholder="Enter Request Number"
              />
              <button type="submit" class="search-button">
                <i class="fas fa-search"></i>
                Get Recommendations
              </button>
            </div>
          </form>
        </div>
      </div>

      <div v-if="isLoading" class="loading-container">
        <div class="spinner"></div>
        <p>Loading recommendations...</p>
      </div>

      <div v-if="alreadyConfirmed" class="alert-container">
        <div class="alert alert-info">
          This reservation request has already been confirmed.
        </div>
      </div>

      <!-- Content Grid -->
      <div v-if="!alreadyConfirmed && reservationRequest" class="content-grid">
        <!-- Left Column - Reservation Details -->
        <div class="details-column">
          <div class="details-card">
            <h3 class="card-title">
              <i class="fas fa-info-circle"></i>
              Reservation Request Details
            </h3>
            <div class="details-content">
              <div class="user-info">
                <div class="user-avatar">
                  <i class="fas fa-user"></i>
                </div>
                <div class="user-details">
                  <h4 class="user-name">{{ reservationRequest.user_name }}</h4>
                  <span class="request-id"
                    >#{{ reservationRequest.reservation_request_id }}</span
                  >
                </div>
              </div>
              <div class="request-details">
                <div class="detail-row">
                  <i class="fas fa-map-marker-alt"></i>
                  <span class="label">Location:</span>
                  <span class="value">{{ reservationRequest.location }}</span>
                </div>
                <div class="detail-row">
                  <i class="fas fa-wallet"></i>
                  <span class="label">Budget:</span>
                  <span class="value highlight"
                    >₺{{ reservationRequest.budget }}</span
                  >
                </div>
                <div class="detail-row">
                  <i class="fas fa-calendar-alt"></i>
                  <span class="label">Trip Period:</span>
                  <span class="value"
                    >{{ formatDate(reservationRequest.check_in_range_start) }} -
                    {{
                      formatDate(reservationRequest.check_in_range_end)
                    }}</span
                  >
                </div>
                <div class="detail-row">
                  <i class="fas fa-clock"></i>
                  <span class="label">Duration:</span>
                  <span class="value"
                    >{{ reservationRequest.stay_duration }} days</span
                  >
                </div>
                <div class="detail-row">
                  <i class="fas fa-users"></i>
                  <span class="label">Group Size:</span>
                  <span class="value"
                    >{{ reservationRequest.adult_num }} Adults,
                    {{ reservationRequest.child_num }} Children</span
                  >
                </div>
                <div class="experiences-section">
                  <h4><i class="fas fa-star"></i> Preferred Experiences</h4>
                  <div class="experience-tags">
                    <span class="experience-tag">{{
                      reservationRequest.exp_1
                    }}</span>
                    <span class="experience-tag">{{
                      reservationRequest.exp_2
                    }}</span>
                    <span class="experience-tag">{{
                      reservationRequest.exp_3
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Hotel Recommendations -->
        <div class="recommendations-column">
          <div class="recommendations-card">
            <h3 class="card-title">
              <i class="fas fa-hotel"></i>
              Hotel Recommendations
            </h3>

            <div
              v-if="userRecommendations.length === 0"
              class="no-recommendations"
            >
              <i class="fas fa-info-circle"></i>
              <p>No recommendations available.</p>
            </div>

            <div v-else class="recommendations-list">
              <div
                v-for="userRecommendation in userRecommendations"
                :key="userRecommendation.hotel_id"
                class="recommendation-item"
                :class="{ active: activeHotel === userRecommendation.hotel_id }"
                @click="toggleOfferDetails(userRecommendation.hotel_id)"
              >
                <div class="recommendation-header">
                  <div class="hotel-info">
                    <h4 class="hotel-name">{{ userRecommendation.name }}</h4>
                    <span class="hotel-location">
                      <i class="fas fa-map-marker-alt"></i>
                      {{ userRecommendation.location }}
                    </span>
                  </div>
                  <div class="match-score">
                    <span class="score-label">Match Score</span>
                    <span class="score-value">{{
                      userRecommendation.rating.toFixed(2)
                    }}</span>
                  </div>
                </div>

                <div
                  v-if="isOfferExist(userRecommendation.hotel_id)"
                  class="existing-offer"
                >
                  <h5>Current Offer</h5>
                  <div class="offer-details">
                    <div class="offer-row">
                      <span>Check-in:</span>
                      <span>{{
                        formatDate(
                          existingOffers[
                            `${reservationRequest.reservation_request_id}_${userRecommendation.hotel_id}`
                          ].check_in_date
                        )
                      }}</span>
                    </div>
                    <div class="offer-row">
                      <span>Check-out:</span>
                      <span>{{
                        formatDate(
                          existingOffers[
                            `${reservationRequest.reservation_request_id}_${userRecommendation.hotel_id}`
                          ].check_out_date
                        )
                      }}</span>
                    </div>
                    <div class="offer-row">
                      <span>Price:</span>
                      <span class="price"
                        >₺{{
                          existingOffers[
                            `${reservationRequest.reservation_request_id}_${userRecommendation.hotel_id}`
                          ].price
                        }}</span
                      >
                    </div>
                    <div class="offer-row">
                      <span>Room:</span>
                      <span>{{
                        existingOffers[
                          `${reservationRequest.reservation_request_id}_${userRecommendation.hotel_id}`
                        ].room_type
                      }}</span>
                    </div>
                    <div class="offer-row">
                      <span>Board:</span>
                      <span>{{
                        existingOffers[
                          `${reservationRequest.reservation_request_id}_${userRecommendation.hotel_id}`
                        ].board_type
                      }}</span>
                    </div>
                  </div>
                </div>

                <div
                  v-if="getOfferCount(userRecommendation.hotel_id) === 1"
                  class="confirm-action"
                >
                  <button
                    class="confirm-button"
                    @click.stop="
                      confirmHotelSelection(userRecommendation.hotel_id)
                    "
                  >
                    <i class="fas fa-check"></i>
                    Confirm Hotel
                  </button>
                </div>

                <div
                  v-if="activeHotel === userRecommendation.hotel_id"
                  class="offer-form"
                  @click.stop
                >
                  <div class="offer-form-header">
                    <h5><i class="fas fa-plus-circle"></i> Create New Offer</h5>
                  </div>
                  <form
                    @submit.prevent="saveOffer(userRecommendation.hotel_id)"
                  >
                    <div class="form-row">
                      <div class="form-group">
                        <label for="check_in_date">
                          <i class="fas fa-calendar-alt"></i>
                          Check in Date
                        </label>
                        <input
                          type="date"
                          v-model="offerDetails.check_in_date"
                          id="check_in_date"
                          class="modern-input"
                          :min="
                            formatDateForInput(
                              reservationRequest.check_in_range_start
                            )
                          "
                          :max="
                            formatDateForInput(
                              reservationRequest.check_in_range_end
                            )
                          "
                          required
                        />
                      </div>
                      <div class="form-group">
                        <label for="check_out_date">
                          <i class="fas fa-calendar-alt"></i>
                          Check out Date
                        </label>
                        <input
                          type="date"
                          v-model="offerDetails.check_out_date"
                          id="check_out_date"
                          class="modern-input"
                          :min="
                            offerDetails.check_in_date ||
                            formatDateForInput(
                              reservationRequest.check_in_range_start
                            )
                          "
                          :max="
                            formatDateForInput(
                              reservationRequest.check_in_range_end
                            )
                          "
                          required
                        />
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group">
                        <label for="price">
                          <i class="fas fa-tag"></i>
                          Price
                        </label>
                        <div class="price-input-wrapper">
                          <span class="currency-symbol">₺</span>
                          <input
                            type="number"
                            v-model.number="offerDetails.price"
                            id="price"
                            class="modern-input price-input"
                            required
                          />
                        </div>
                      </div>
                      <div class="form-group">
                        <label for="room_type">
                          <i class="fas fa-bed"></i>
                          Room Type
                        </label>
                        <input
                          type="text"
                          v-model="offerDetails.room_type"
                          id="room_type"
                          class="modern-input"
                          required
                        />
                      </div>
                    </div>
                    <div class="form-group">
                      <label for="board_type">
                        <i class="fas fa-utensils"></i>
                        Board Type
                      </label>
                      <div class="select-container">
                        <select
                          v-model="offerDetails.board_type"
                          id="board_type"
                          class="modern-select"
                          required
                        >
                          <option value="">Select board type</option>
                          <option value="Bed and Breakfast">
                            Bed and Breakfast
                          </option>
                          <option value="Half Board">Half Board</option>
                          <option value="Full Board">Full Board</option>
                          <option value="All Inclusive">All Inclusive</option>
                          <option value="Room Only">Room Only</option>
                          <option value="Nonalcohol All Inclusive">
                            Nonalcohol All Inclusive
                          </option>
                          <option value="Nonalcohol Ultra All Inclusive">
                            Nonalcohol Ultra All Inclusive
                          </option>
                          <option value="Full Board Plus">
                            Full Board Plus
                          </option>
                          <option value="Ultra All Inclusive">
                            Ultra All Inclusive
                          </option>
                        </select>
                      </div>
                    </div>
                    <div class="form-actions">
                      <button
                        type="button"
                        class="cancel-button"
                        @click="activeHotel = null"
                      >
                        <i class="fas fa-times"></i>
                        Cancel
                      </button>
                      <button type="submit" class="save-offer-button">
                        <i class="fas fa-check"></i>
                        Save Offer
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Collect Offers Section -->
      <div class="collect-offers-section" v-if="hasOffers && !alreadyConfirmed">
        <button @click="showOffers = !showOffers" class="collect-offers-button">
          <i
            :class="showOffers ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"
          ></i>
          {{ showOffers ? "Hide Offers" : "Collect Offers" }}
        </button>

        <div v-if="showOffers" class="offers-collection">
          <h3>Available Offers</h3>
          <div class="offers-grid">
            <div
              v-for="(offer, index) in collectedOffers"
              :key="index"
              class="offer-card"
            >
              <div class="offer-header">
                <label class="offer-checkbox">
                  <input
                    type="checkbox"
                    v-model="selectedOffers"
                    :value="offer"
                  />
                  <span class="checkmark"></span>
                </label>
                <h4>{{ offer.hotel_name }}</h4>
                <span class="offer-price"
                  >₺{{ offer.price.toLocaleString() }}</span
                >
              </div>
              <div class="offer-body">
                <div class="offer-info">
                  <i class="fas fa-calendar"></i>
                  {{ formatDate(offer.check_in_date) }} -
                  {{ formatDate(offer.check_out_date) }}
                </div>
                <div class="offer-info">
                  <i class="fas fa-bed"></i>
                  {{ offer.room_type }}
                </div>
                <div class="offer-info">
                  <i class="fas fa-utensils"></i>
                  {{ offer.board_type }}
                </div>
              </div>
            </div>
          </div>
          <button @click="submitSelectedOffers" class="submit-offers-button">
            <i class="fas fa-paper-plane"></i>
            Submit and Send Mail
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRoute } from "vue-router";
import { HotelDto } from "../../models/HotelDto";
import {
  saveReservationOffer,
  getReservationOffer,
} from "../../services/ReservationOfferService";
import { getRecommendedHotels } from "@/services/UserRecommendationService";
import { getReservationRequestById } from "@/services/ReservationRequestService";
import {
  confirmHotel,
  checkIfReservationConfirmed,
} from "@/services/ReservationConfirmedService";
import { getUserById } from "../../services/UserService";
import AdminLayout from "./AdminLayout.vue";
import { useToast } from "vue-toastification";
import axios from "axios";

interface CollectedOffer {
  hotel_id: number;
  hotel_name: string;
  check_in_date: string;
  check_out_date: string;
  price: number;
  room_type: string;
  board_type: string;
}

export default defineComponent({
  name: "UserRecommendationComponent",
  components: {
    AdminLayout,
  },
  props: {
    current_user_name: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      userRecommendations: [] as HotelDto[],
      reservationRequest: null as any,
      alreadyConfirmed: false,
      identifier: "",
      activeHotel: null as number | null,
      offerDetails: {
        check_in_date: "",
        check_out_date: "",
        price: 0,
        room_type: "",
        board_type: "",
        reservation_request_id: 0,
        hotel_id: 0,
      },
      existingOffers: {} as Record<string, any>,
      showOffers: false,
      selectedOffers: [] as CollectedOffer[],
      userEmail: "",
      toast: useToast(),
      isLoading: false,
    };
  },
  computed: {
    collectedOffers(): CollectedOffer[] {
      if (!this.reservationRequest) return [];
      return this.userRecommendations
        .filter((recommendation: HotelDto) =>
          this.isOfferExist(recommendation.hotel_id)
        )
        .map((recommendation: HotelDto) => ({
          hotel_id: recommendation.hotel_id,
          hotel_name: recommendation.name,
          ...this.existingOffers[
            `${this.reservationRequest.reservation_request_id}_${recommendation.hotel_id}`
          ],
        }));
    },
    hasOffers(): boolean {
      return this.collectedOffers.length > 0;
    },
  },
  async mounted() {
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (!isAdminLoggedIn) {
      this.$router.push("/admin");
    }
    const route = useRoute();
    if (route.query.identifier) {
      this.identifier = route.query.identifier as string;
      await this.fetchRecommendations();

      this.alreadyConfirmed = await checkIfReservationConfirmed(
        this.reservationRequest.reservation_request_id
      );
    }
  },
  methods: {
    async fetchRecommendations() {
      try {
        this.isLoading = true; // Start loading
        let reservation_request_id: number;

        if (!isNaN(Number(this.identifier))) {
          reservation_request_id = Number(this.identifier);
        } else {
          throw new Error("Invalid reservation request ID.");
        }

        this.reservationRequest = await getReservationRequestById(
          reservation_request_id
        );
        if (!this.reservationRequest) {
          throw new Error(
            "No reservation found for the given reservation request ID."
          );
        }

        this.userRecommendations = await getRecommendedHotels(
          this.reservationRequest.reservation_request_id
        );

        const user = await getUserById(this.reservationRequest.user_id);
        this.userEmail = user.email;

        for (const recommendation of this.userRecommendations) {
          const offer_key = `${this.reservationRequest.reservation_request_id}_${recommendation.hotel_id}`;
          const offer = await getReservationOffer(offer_key);
          if (offer) {
            this.existingOffers[offer_key] = offer;
          }
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        this.toast.error("Error fetching recommendations.");
      } finally {
        this.isLoading = false;
      }
    },
    isOfferExist(hotelId: number): boolean {
      if (!this.reservationRequest) return false;
      const offer_key = `${this.reservationRequest.reservation_request_id}_${hotelId}`;
      return !!this.existingOffers[offer_key];
    },
    toggleOfferDetails(hotelId: number) {
      this.activeHotel = this.activeHotel === hotelId ? null : hotelId;
      if (this.activeHotel !== null) {
        const offer_key = `${this.reservationRequest.reservation_request_id}_${hotelId}`;
        const existingOffer = this.existingOffers[offer_key];
        if (existingOffer) {
          this.offerDetails = {
            check_in_date: existingOffer.check_in_date || "",
            check_out_date: existingOffer.check_out_date || "",
            price: existingOffer.price !== undefined ? existingOffer.price : 0,
            room_type: existingOffer.room_type || "",
            board_type: existingOffer.board_type || "",
            reservation_request_id:
              this.reservationRequest.reservation_request_id,
            hotel_id: hotelId,
          };
        } else {
          this.offerDetails = {
            check_in_date: "",
            check_out_date: "",
            price: 0,
            room_type: "",
            board_type: "",
            reservation_request_id:
              this.reservationRequest.reservation_request_id,
            hotel_id: hotelId,
          };
        }
      }
    },
    async saveOffer(hotelId: number) {
      const offer_key = `${this.reservationRequest.reservation_request_id}_${hotelId}`;

      const offerDetailsWithKey = {
        ...this.offerDetails,
        offer_key: offer_key,
      };

      try {
        await saveReservationOffer(offer_key, offerDetailsWithKey);
        this.existingOffers[offer_key] = offerDetailsWithKey;
        this.toast.success("Offer saved successfully!");
      } catch (error) {
        console.error("Error saving reservation offer:", error);
        this.toast.error("Error saving offer.");
      }
    },
    async submitSelectedOffers() {
      const user = await getUserById(this.reservationRequest.user_id);
      const emailContent = `Merhaba Sevgili ${user.name},

      Seçtiğiniz otel tekliflerinin detayları aşağıdadır:

      ${this.selectedOffers
        .map(
          (offer) => `
        **Otel:** ${offer.hotel_name}
        **Fiyat:** ₺${offer.price.toLocaleString()}
        **Tarih Aralığı:** ${this.formatDate(offer.check_in_date)} - ${this.formatDate(offer.check_out_date)}
        **Oda Tipi:** ${offer.room_type}
      `
        )
        .join("\n\n")}

      İyi günler dileriz,

      Metapersona Ekibi`;

      await this.sendEmailAPI(
        this.userEmail,
        "Seçilen Otel Teklifleri",
        emailContent
      );
    },

    async sendEmailAPI(to: string, subject: string, body: string) {
      try {
        const response = await axios.post(
          "https://localhost:7018/api/Email/send",
          {
            to: to,
            subject: subject,
            body: body,
          }
        );

        if (response.status === 200) {
          this.toast.success("Email sent successfully!");
        } else {
          this.toast.error("Email sending failed.");
        }
      } catch (error) {
        this.toast.error("Error occurred while sending email.");
        throw error;
      }
    },
    formatDate(dateString: string) {
      const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };
      return new Date(dateString).toLocaleDateString("tr-TR", options);
    },
    formatDateForInput(dateString: string) {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    },
    async confirmHotelSelection(hotel_id: number) {
      try {
        const isAlreadyConfirmed = await checkIfReservationConfirmed(
          this.reservationRequest.reservation_request_id
        );

        if (isAlreadyConfirmed) {
          this.toast.warning(
            "This reservation request has already been confirmed."
          );
          return;
        }

        // Construct the offer key
        const offer_key = `${this.reservationRequest.reservation_request_id}_${hotel_id}`;
        const selectedOffer = this.existingOffers[offer_key];

        if (!selectedOffer) {
          this.toast.error("No offer details found for this hotel.");
          return;
        }

        const userName = "Admin";

        await confirmHotel(
          this.reservationRequest.reservation_request_id,
          hotel_id,
          selectedOffer.check_in_date,
          selectedOffer.check_out_date,
          selectedOffer.price,
          selectedOffer.room_type,
          selectedOffer.board_type,
          this.reservationRequest.user_id,
          userName
        );

        this.toast.success("Hotel confirmed successfully!");
        this.$router.push("/admin/home");
      } catch (error: any) {
        this.toast.error(error.message);
      }
    },

    getOfferCount(hotelId: number) {
      const offerKeyPrefix = `${this.reservationRequest.reservation_request_id}_${hotelId}`;
      return Object.keys(this.existingOffers).filter((key) =>
        key.startsWith(offerKeyPrefix)
      ).length;
    },
  },
});
</script>

<style scoped>
.recommendation-container {
  padding: 24px;
  max-width: 1600px;
  margin: 0 auto;
  background-color: #f8f9fa;
}

.search-section {
  margin-bottom: 32px;
}

.search-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  max-width: 600px;
  margin: 0 auto;
}

.search-title {
  text-align: center;
  color: #1a1a1a;
  font-size: 24px;
  margin-bottom: 24px;
}

.search-form {
  width: 100%;
}

.input-group {
  display: flex;
  gap: 12px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
  outline: none;
}

.search-button {
  background: #1976d2;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.search-button:hover {
  background: #1565c0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin: 48px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.alert-container {
  max-width: 600px;
  margin: 32px auto;
}

.alert {
  padding: 16px;
  border-radius: 8px;
  font-size: 16px;
  text-align: center;
}

.alert-info {
  background: #e3f2fd;
  color: #1565c0;
  border: 1px solid #90caf9;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 24px;
  margin-top: 32px;
}

.details-column,
.recommendations-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.details-card,
.recommendations-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: 20px;
  color: #1a1a1a;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.details-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 20px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  background: #e3f2fd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1976d2;
  font-size: 24px;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.request-id {
  font-size: 14px;
  color: #666;
}

.request-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #1a1a1a;
}

.detail-row i {
  width: 20px;
  color: #1976d2;
}

.detail-row .label {
  min-width: 100px;
  color: #666;
  font-weight: 500;
}

.detail-row .value {
  flex: 1;
}

.detail-row .value.highlight {
  color: #2e7d32;
  font-weight: 600;
}

.experiences-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.experiences-section h4 {
  font-size: 16px;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.experiences-section h4 i {
  color: #f57c00;
}

.experience-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.experience-tag {
  background: #fff3e0;
  color: #f57c00;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.recommendation-item {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.recommendation-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.recommendation-item.active {
  border: 2px solid #1976d2;
  background: white;
}

.recommendation-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.hotel-info {
  flex: 1;
}

.hotel-name {
  font-size: 18px;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.hotel-location {
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.match-score {
  background: #e3f2fd;
  padding: 8px 12px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-label {
  font-size: 12px;
  color: #1976d2;
}

.score-value {
  font-size: 16px;
  font-weight: 600;
  color: #1565c0;
}

.existing-offer {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
}

.existing-offer h5 {
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.offer-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.offer-row {
  display: flex;
  justify-content: space-between;
  color: #666;
}

.offer-row .price {
  color: #2e7d32;
  font-weight: 600;
}

.confirm-action {
  margin-top: 16px;
}

.confirm-button {
  width: 100%;
  background: #2e7d32;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.confirm-button:hover {
  background: #1b5e20;
}

.offer-form {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-top: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.offer-form-header {
  margin-bottom: 24px;
}

.offer-form-header h5 {
  color: #1976d2;
  font-size: 18px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #666;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-group label i {
  color: #1976d2;
  width: 16px;
}

.modern-input,
.modern-select {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: #f8f9fa;
  color: #333;
  width: 100%;
}

.modern-input:focus,
.modern-select:focus {
  border-color: #1976d2;
  background: white;
  outline: none;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.modern-select {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
  color: #333;
  width: 100%;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 16px;
  padding-right: 48px;
}

.modern-select:focus {
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
  outline: none;
}

.modern-select:hover {
  border-color: #4299e1;
  background-color: #f8fafc;
}

.modern-select option {
  padding: 12px;
  font-size: 14px;
  background-color: white;
  color: #333;
}

/* Webkit (Chrome, Safari) için özel stiller */
.modern-select::-webkit-scrollbar {
  width: 8px;
}

.modern-select::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.modern-select::-webkit-scrollbar-thumb {
  background: #4299e1;
  border-radius: 4px;
}

.modern-select::-webkit-scrollbar-thumb:hover {
  background: #3182ce;
}

/* Firefox için özel stiller */
.modern-select {
  scrollbar-width: thin;
  scrollbar-color: #4299e1 #f1f1f1;
}

/* Select açıldığında option'ların stillendirilmesi için */
.modern-select option:hover,
.modern-select option:focus,
.modern-select option:active,
.modern-select option:checked {
  background: linear-gradient(0deg, #4299e1 0%, #4299e1 100%);
  background-color: #4299e1 !important;
  color: white !important;
}

/* Select container stil güncellemesi */
.form-group {
  position: relative;
}

.form-group label[for="board_type"] {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #4a5568;
  font-weight: 500;
  font-size: 14px;
}

.form-group label[for="board_type"] i {
  color: #4299e1;
  font-size: 16px;
}

/* Select placeholder stil güncellemesi */
.modern-select option[value=""] {
  color: #a0aec0;
}

/* Select option grupları için stil */
.modern-select optgroup {
  font-weight: 600;
  color: #2d3748;
  padding: 8px;
  background-color: #f7fafc;
}

/* Disabled options için stil */
.modern-select option:disabled {
  color: #cbd5e0;
  background-color: #f7fafc;
}

/* Hover efekti için container stil */
.select-container {
  position: relative;
  width: 100%;
}

.select-container::after {
  content: "";
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  pointer-events: none;
  transition: transform 0.3s ease;
}

.modern-select:focus + .select-container::after {
  transform: translateY(-50%) rotate(180deg);
}

.price-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-symbol {
  position: absolute;
  left: 16px;
  color: #666;
  font-weight: 500;
}

.price-input {
  padding-left: 32px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.cancel-button,
.save-offer-button {
  flex: 1;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.cancel-button {
  background: #f5f5f5;
  color: #666;
}

.cancel-button:hover {
  background: #e0e0e0;
}

.save-offer-button {
  background: #1976d2;
  color: white;
}

.save-offer-button:hover {
  background: #1565c0;
}

.collect-offers-section {
  margin-top: 32px;
}

.collect-offers-button {
  background: #1976d2;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto;
  transition: all 0.2s ease;
}

.collect-offers-button:hover {
  background: #1565c0;
}

.offers-collection {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-top: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.offers-collection h3 {
  color: #1a1a1a;
  margin: 0 0 24px 0;
}

.offers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.offer-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}

.offer-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.offer-checkbox {
  position: relative;
  width: 20px;
  height: 20px;
}

.offer-checkbox input {
  opacity: 0;
  width: 0;
  height: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.offer-checkbox input:checked ~ .checkmark {
  background: #1976d2;
  border-color: #1976d2;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.offer-checkbox input:checked ~ .checkmark:after {
  display: block;
}

.offer-checkbox .checkmark:after {
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.offer-price {
  color: #2e7d32;
  font-weight: 600;
}

.offer-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.offer-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
}

.submit-offers-button {
  background: #2e7d32;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0 auto;
  transition: all 0.2s ease;
}

.submit-offers-button:hover {
  background: #1b5e20;
}

@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .input-group {
    flex-direction: column;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .offers-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }
}

.no-spinner::-webkit-outer-spin-button,
.no-spinner::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
