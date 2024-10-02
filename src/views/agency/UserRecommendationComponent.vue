<template>
  <AdminLayout :current_user_name="current_user_name">
    <div class="container mt-5">
      <h1 class="mb-4">User Recommendation List</h1>
      <div class="card p-4 mb-4">
        <form @submit.prevent="fetchRecommendations">
          <div class="mb-3">
            <label for="identifier" class="form-label"
              >Reservation Request Number:</label
            >
            <input
              type="text"
              v-model="identifier"
              id="identifier"
              class="form-control"
              placeholder="Enter Request Number"
            />
          </div>
          <button type="submit" class="btn btn-primary">
            Get Recommendations
          </button>
        </form>
      </div>

      <div v-if="isLoading" class="spinner-border text-primary"></div>
      <div v-if="alreadyConfirmed" class="alert alert-info">
        This reservation request has already been confirmed.
      </div>

      <div v-else>
        <div v-if="reservationRequest" class="reservation-box mb-4">
          <h3 class="box-title">Reservation Request Details</h3>
          <div class="box-content">
            <p><strong>Location:</strong> {{ reservationRequest.location }}</p>
            <p><strong>Budget:</strong> ₺{{ reservationRequest.budget }}</p>
            <p>
              <strong>Trip Start:</strong>
              {{ formatDate(reservationRequest.check_in_range_start) }}
            </p>
            <p>
              <strong>Trip End:</strong>
              {{ formatDate(reservationRequest.check_in_range_end) }}
            </p>
            <p>
              <strong>Stay Duration:</strong>
              {{ reservationRequest.stay_duration }} days
            </p>
            <p><strong>Experience 1:</strong> {{ reservationRequest.exp_1 }}</p>
            <p><strong>Experience 2:</strong> {{ reservationRequest.exp_2 }}</p>
            <p><strong>Experience 3:</strong> {{ reservationRequest.exp_3 }}</p>
            <p>
              <strong>Adult:</strong> {{ reservationRequest.adult_num }}
              <strong>Child:</strong> {{ reservationRequest.child_num }}
            </p>
          </div>
        </div>

        <div
          v-if="userRecommendations.length === 0"
          class="alert alert-warning"
        >
          No recommendations.
        </div>

        <ul v-else class="list-group">
          <li
            v-for="userRecommendation in userRecommendations"
            :key="userRecommendation.hotel_id"
            class="list-group-item recommendation-box"
            @click="toggleOfferDetails(userRecommendation.hotel_id)"
          >
            <div class="recommendation-item">
              <strong>Location:</strong>
              <span>{{ userRecommendation.location }}</span>
            </div>
            <div class="recommendation-item">
              <strong>Name:</strong> <span>{{ userRecommendation.name }}</span>
            </div>
            <div class="recommendation-item">
              <strong>Match Point:</strong>
              <span>{{ userRecommendation.rating.toFixed(2) }}</span>
            </div>

            <button
              v-if="getOfferCount(userRecommendation.hotel_id) === 1"
              class="btn btn-success mt-3"
              @click="confirmHotelSelection(userRecommendation.hotel_id)"
            >
              Confirm Hotel
            </button>

            <div
              v-if="isOfferExist(userRecommendation.hotel_id)"
              class="offer-summary"
            >
              <h6>Offer Details:</h6>
              <p>
                <strong>Check-in Date :</strong>
                {{
                  formatDate(
                    existingOffers[
                      `${reservationRequest.reservation_request_id}_${userRecommendation.hotel_id}`
                    ].check_in_date
                  )
                }}
              </p>
              <p>
                <strong>Check-out Date:</strong>
                {{
                  formatDate(
                    existingOffers[
                      `${reservationRequest.reservation_request_id}_${userRecommendation.hotel_id}`
                    ].check_out_date
                  )
                }}
              </p>
              <p>
                <strong>Price:</strong> ₺{{
                  existingOffers[
                    `${reservationRequest.reservation_request_id}_${userRecommendation.hotel_id}`
                  ].price
                }}
              </p>
              <p>
                <strong>Room Type:</strong>
                {{
                  existingOffers[
                    `${reservationRequest.reservation_request_id}_${userRecommendation.hotel_id}`
                  ].room_type
                }}
              </p>
              <p>
                <strong>Board Type:</strong>
                {{
                  existingOffers[
                    `${reservationRequest.reservation_request_id}_${userRecommendation.hotel_id}`
                  ].board_type
                }}
              </p>
            </div>

            <div
              v-if="activeHotel === userRecommendation.hotel_id"
              class="offer-details mt-3"
              @click.stop
            >
              <h5>Offer Details</h5>
              <form @submit.prevent="saveOffer(userRecommendation.hotel_id)">
                <div class="form-group">
                  <label for="check_in_date">Check in Date</label>
                  <input
                    type="date"
                    v-model="offerDetails.check_in_date"
                    id="check_in_date"
                    class="form-control"
                    :min="offerDetails.check_in_date"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="check_out_date">Check out Date</label>
                  <input
                    type="date"
                    v-model="offerDetails.check_out_date"
                    id="check_out_date"
                    class="form-control"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="price">Price</label>
                  <input
                    type="number"
                    v-model.number="offerDetails.price"
                    id="price"
                    class="form-control no-spinner"
                    :placeholder="
                      existingOffers[
                        `${reservationRequest.reservation_request_id}_${userRecommendation.hotel_id}`
                      ]?.price || 'Enter price'
                    "
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="room_type">Room Type</label>
                  <input
                    type="text"
                    v-model="offerDetails.room_type"
                    id="room_type"
                    class="form-control"
                    :placeholder="
                      existingOffers[
                        `${reservationRequest.reservation_request_id}_${userRecommendation.hotel_id}`
                      ]?.room_type || 'Enter room type'
                    "
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="board_type">Board Type</label>
                  <select
                    v-model="offerDetails.board_type"
                    id="board_type"
                    class="form-control"
                    required
                  >
                    <option value="">Select board type</option>
                    <option value="Bed and Breakfast">Bed and Breakfast</option>
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
                    <option value="Full Board Plus">Full Board Plus</option>
                    <option value="Ultra All Inclusive">
                      Ultra All Inclusive
                    </option>
                  </select>
                </div>
                <button type="submit" class="btn btn-success mt-3">
                  Save Offer
                </button>
              </form>
            </div>
          </li>
        </ul>

        <button
          v-if="hasOffers"
          @click="showOffers = !showOffers"
          class="btn btn-info mt-4 custom-offer-button"
        >
          {{ showOffers ? "Hide Offers" : "Collect Offers" }}
        </button>

        <div v-if="showOffers" class="offer-collection-box mt-4">
          <h3 class="box-title">Available Offers</h3>
          <ul class="list-group">
            <li
              v-for="(offer, index) in collectedOffers"
              :key="index"
              class="list-group-item offer-item"
            >
              <label class="offer-label">
                <input
                  type="checkbox"
                  v-model="selectedOffers"
                  :value="offer"
                />
                <span class="offer-title"
                  >{{ offer.hotel_name }} -
                  <span class="offer-price"
                    >₺{{ offer.price.toLocaleString() }}</span
                  ></span
                >
              </label>
              <p class="offer-details">
                <strong>Date Range:</strong>
                {{ formatDate(offer.check_in_date) }} -
                {{ formatDate(offer.check_out_date) }}
              </p>
              <p class="offer-details">
                <strong>Room Type:</strong> {{ offer.room_type }}
              </p>
              <p class="offer-details">
                <strong>Board Type:</strong> {{ offer.board_type }}
              </p>
            </li>
          </ul>
          <button @click="submitSelectedOffers" class="btn btn-success mt-3">
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
        this.$router.push("/admin");
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
.container {
  max-width: 600px;
  min-height: 100vh;
}

.card {
  border: 1px solid #e3e3e3;
  border-radius: 8px;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.custom-offer-button {
  width: 200px;
  height: 40px;
  font-size: 20px;
  padding: 4px 20px;
  margin-bottom: 15px;
}

.offer-collection-box {
  border: 2px solid #007bff;
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 30px;
}

.reservation-box {
  border: 1px solid #007bff;
  border-radius: 8px;
  padding: 15px;
  background-color: #f8f9fa;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.box-title {
  font-size: 20px;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 10px;
}

.box-content p {
  margin: 5px 0;
  font-size: 16px;
}

.recommendation-box {
  border: 1px solid #28a745;
  border-radius: 8px;
  padding: 15px;
  background-color: #f1f3f4;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  cursor: pointer;
}

.recommendation-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.offer-details {
  margin-top: 15px;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.offer-details h5 {
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: bold;
  color: #007bff;
}

.offer-summary {
  background-color: #d4edda;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  color: #155724;
}
.no-spinner::-webkit-outer-spin-button,
.no-spinner::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.box-title {
  font-size: 24px;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 20px;
  text-align: center;
}

.list-group-item.offer-item {
  border: 1px solid #e3e3e3;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
  transition: background-color 0.3s ease;
}

.list-group-item.offer-item:hover {
  background-color: #f1f1f1;
}

.offer-label {
  display: flex;
  align-items: center;
  gap: 10px;
}

.offer-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.offer-price {
  font-size: 18px;
  color: #28a745;
}

.offer-details {
  margin: 5px 0;
  font-size: 16px;
  color: #555;
}
</style>
