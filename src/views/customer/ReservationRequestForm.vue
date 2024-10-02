<template>
  <CustomerLayout>
    <div class="background">
      <div class="container mt-5">
        <div class="card p-4">
          <h2 class="mb-4">Rezervasyon Bilgileri</h2>
          <form @submit.prevent="submitForm">
            <div class="form-group mb-3">
              <label for="location">Gitmek İstediğiniz Yeri Seçin:</label>
              <select
                id="location"
                v-model="location"
                class="form-control"
                required
              >
                <option
                  v-for="location in locations"
                  :key="location"
                  :value="location"
                >
                  {{ location }}
                </option>
              </select>
            </div>
            <div class="form-group mb-3">
              <label for="budget">Bütçenizi Girin (₺):</label>
              <input
                type="number"
                id="budget"
                v-model="budget"
                class="form-control"
                required
              />
            </div>
            <div class="form-group mb-3">
              <label for="check_in_range_start"
                >Tatiliniz En Erken Ne Zaman Başlayabilir:</label
              >
              <input
                type="date"
                id="check_in_range_start"
                v-model="check_in_range_start"
                class="form-control"
                :min="minDate"
                required
              />
            </div>
            <div class="form-group mb-3">
              <label for="check_in_range_end"
                >Tatiliniz En Geç Ne Zaman Başlayabilir:</label
              >
              <input
                type="date"
                id="check_in_range_end"
                v-model="check_in_range_end"
                class="form-control"
                :min="check_in_range_start || minDate"
                required
              />
            </div>
            <div class="form-group mb-3">
              <label for="stayDuration">Tatil Süresi (gün):</label>
              <input
                type="number"
                id="stayDuration"
                v-model="stayDuration"
                class="form-control"
                required
              />
            </div>
            <div class="form-group mb-3">
              <label for="adult_num">Yetişkin Sayısı:</label>
              <div class="input-group">
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="decreaseAdults"
                >
                  -
                </button>
                <input
                  type="number"
                  id="adult_num"
                  v-model="adultNum"
                  class="form-control text-center"
                  readonly
                />
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="increaseAdults"
                >
                  +
                </button>
              </div>
            </div>
            <div class="form-group mb-3">
              <label for="child_num">Çocuk Sayısı:</label>
              <div class="input-group">
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="decreaseChildren"
                >
                  -
                </button>
                <input
                  type="number"
                  id="child_num"
                  v-model="childNum"
                  class="form-control text-center"
                  readonly
                />
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="increaseChildren"
                >
                  +
                </button>
              </div>
            </div>
            <div
              v-for="(age, index) in childrenAges"
              :key="index"
              class="form-group mb-3"
            >
              <label :for="'child_age_' + index">Çocuğun Yaşı:</label>
              <input
                type="number"
                v-model="childrenAges[index]"
                class="form-control"
                min="0"
                max="18"
              />
            </div>

            <button type="submit" class="btn btn-primary w-100">
              Devam Et
            </button>
          </form>
        </div>
      </div>
    </div>
  </CustomerLayout>
</template>

<script>
import axios from "axios";
import { useToast } from "vue-toastification";
import CustomerLayout from "./CustomerLayout.vue";

export default {
  name: "ReservationForm",
  components: {
    CustomerLayout,
  },
  data() {
    return {
      location: "",
      budget: null,
      check_in_range_start: "",
      check_in_range_end: "",
      stayDuration: null,
      adultNum: 1,
      childNum: 0,
      childrenAges: [],
      userId: null,
      locations: [],
      toast: useToast(),
    };
  },
  computed: {
    minDate() {
      return new Date().toISOString().split("T")[0];
    },
  },
  async created() {
    this.userId = localStorage.getItem("userId");
    if (!this.userId) {
      this.toast.error("Kullanıcı bilgileri bulunamadı.");
      this.$router.push({ name: "UserForm" });
    }
    await this.fetchLocations();
  },
  watch: {
    childNum(newVal) {
      if (newVal > this.childrenAges.length) {
        this.childrenAges.push(
          ...Array(newVal - this.childrenAges.length).fill(null)
        );
      } else {
        this.childrenAges.splice(newVal);
      }
    },
  },
  methods: {
    async fetchLocations() {
      try {
        const response = await axios.get(
          "https://tubitak-proje.dev.reisetech.io/api/metapersona/api/hotel/locations"
        );
        this.locations = response.data;
      } catch (error) {
        console.error("Error fetching locations:", error);
        this.toast.error("Lokasyonları alırken hata oluştu.");
      }
    },
    increaseAdults() {
      this.adultNum += 1;
    },
    decreaseAdults() {
      if (this.adultNum > 1) this.adultNum -= 1;
    },
    increaseChildren() {
      this.childNum += 1;
    },
    decreaseChildren() {
      if (this.childNum > 0) this.childNum -= 1;
    },
    async submitForm() {
      if (
        !this.check_in_range_start ||
        !this.check_in_range_end ||
        !this.stayDuration
      ) {
        return;
      }

      try {
        const reservationData = {
          user_id: this.userId,
          region: this.location,
          budget: this.budget,
          check_in_range_start: this.check_in_range_start,
          check_in_range_end: this.check_in_range_end,
          stay_duration: this.stayDuration,
          adult_num: this.adultNum,
          child_num: this.childNum,
          children_ages: this.childrenAges,
        };

        localStorage.setItem(
          "reservationData",
          JSON.stringify(reservationData)
        );
        this.toast.success("Rezervasyon bilgileri kaydedildi!");
        this.$router.push({ name: "ExperienceForm" });
      } catch (error) {
        console.error("Error saving reservation data:", error);
        this.toast.error("Rezervasyon bilgileri kaydedilirken hata oluştu.");
      }
    },
  },
};
</script>

<style scoped>
.background {
  background-image: url("/src/assets/background.jpg");
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.container {
  max-width: 600px;
  margin: auto;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 20px;
}

.card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card h2 {
  text-align: center;
  color: #343a40;
  font-weight: bold;
}

.card .form-group label {
  font-weight: bold;
  color: #495057;
}

.card .form-control {
  border-radius: 5px;
}

.card .btn {
  background-color: #007bff;
  border: none;
  font-weight: bold;
}
.btn-outline-secondary {
  color: #fff;
}
</style>
