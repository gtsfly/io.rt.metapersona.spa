<template>
  <CustomerLayout>
    <div class="container mt-5">
      <div class="card p-4">
        <h2 class="mb-4">Rezervasyon Bilgileri</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group mb-3">
            <label for="location">Gitmek İstediğiniz Yeri Seçin:</label>
            <select id="location" v-model="location" class="form-control" required>
              <option v-for="location in locations" :key="location" :value="location">
                {{ location }}
              </option>
            </select>
          </div>
          <div class="form-group mb-3">
            <label for="budget">Bütçenizi Girin:</label>
            <input type="number" id="budget" v-model="budget" class="form-control" required />
          </div>
          <div class="form-group mb-3">
            <label for="trip_start">Giriş Tarihi:</label>
            <input type="date" id="trip_start" v-model="trip_start" class="form-control" :min="minDate" required />
          </div>
          <div class="form-group mb-3">
            <label for="trip_end">Çıkış Tarihi:</label>
            <input type="date" id="trip_end" v-model="trip_end" class="form-control" :min="trip_start || minDate" required />
          </div>
          <div class="form-group mb-3">
            <label for="stayDuration">Tatil Süresi (gün):</label>
            <input type="number" id="stayDuration" v-model="stayDuration" class="form-control" required />
          </div>
          <button type="submit" class="btn btn-primary w-100">Devam Et</button>
        </form>
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
      trip_start: "",
      trip_end: "",
      stayDuration: null,
      userId: null,
      locations: [],
      toast: useToast(),
    };
  },
  computed: {
    minDate() {
      return new Date().toISOString().split("T")[0];
    }
  },
  async created() {
    this.userId = localStorage.getItem('userId');
    if (!this.userId) {
      this.toast.error("Kullanıcı bilgileri bulunamadı.");
      this.$router.push({ name: 'UserForm' });
    }
    await this.fetchLocations();
  },
  methods: {
    async fetchLocations() {
      try {
        const response = await axios.get("https://localhost:7018/api/hotel/locations");
        this.locations = response.data;
      } catch (error) {
        console.error("Error fetching locations:", error);
        this.toast.error("Lokasyonları alırken hata oluştu.");
      }
    },
    async submitForm() {
      if (!this.trip_start || !this.trip_end || !this.stayDuration) {
        return;
      }

      try {
        const reservationData = {
          user_id: this.userId,
          region: this.location,
          budget: this.budget,
          trip_start: this.trip_start,
          trip_end: this.trip_end,
          stay_duration: this.stayDuration
        };

        localStorage.setItem('reservationData', JSON.stringify(reservationData));
        this.toast.success("Rezervasyon bilgileri kaydedildi!");
        this.$router.push({ name: 'ExperienceForm' });
      } catch (error) {
        console.error("Error saving reservation data:", error);
        this.toast.error("Rezervasyon bilgileri kaydedilirken hata oluştu.");
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
}

.card {
  background-color: white;
  border-radius: 10px;
}

.card h2 {
  text-align: center;
  color: #343a40;
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
</style>
