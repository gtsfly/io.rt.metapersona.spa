<template>
  <CustomerLayout>
    <div class="container mt-5">
      <div class="card shadow-sm p-4">
        <h2>Seçilen Deneyimleri Puanlayın</h2>
        <div
          v-for="experience in selectedExperiences"
          :key="experience.id"
          class="form-group mb-3"
        >
          <label :for="'rating-' + experience.id"
            >Puanlayın (1-5): {{ experience.name }}</label
          >
          <select
            :id="'rating-' + experience.id"
            v-model="ratings[experience.id]"
            class="form-control"
            required
          >
            <option value="" disabled selected>Seçiniz</option>
            <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>
        <button @click="submitRatings" class="btn btn-primary w-100 mt-4">
          Gönder
        </button>
      </div>
    </div>
  </CustomerLayout>
</template>

<script>
import axios from "axios";
import { createReservation } from "../../services/ReservationRequestService";
import { useToast } from "vue-toastification";
import CustomerLayout from "./CustomerLayout.vue";

export default {
  name: "ExperienceRating",
  components: {
    CustomerLayout,
  },
  data() {
    return {
      selectedExperiences: [],
      experiences: [],
      ratings: {},
      userId: null,
      toast: useToast(),
    };
  },
  async created() {
    this.userId = localStorage.getItem("userId");
    if (!this.userId) {
      this.toast.error("Kullanıcı bilgileri bulunamadı.");
      this.$router.push({ name: "UserForm" });
      return;
    }
    await this.fetchExperiences();
    this.loadSelectedExperiences();
  },
  methods: {
    async fetchExperiences() {
      try {
        const response = await axios.get(
          "https://tubitak-proje.dev.reisetech.io/api/metapersona/api/experience"
        );
        this.experiences = response.data;
      } catch (error) {
        console.error("Error fetching experiences:", error);
        this.toast.error("Deneyimler alınırken hata oluştu.");
      }
    },
    loadSelectedExperiences() {
      const selectedExperienceIds =
        JSON.parse(localStorage.getItem("selectedExperiences")) || [];
      this.selectedExperiences = this.experiences.filter((exp) =>
        selectedExperienceIds.includes(exp.id)
      );
    },
    async submitRatings() {
      try {
        const reservationData = JSON.parse(
          localStorage.getItem("reservationData")
        );

        if (!reservationData) {
          this.toast.error("Rezervasyon bilgileri bulunamadı.");
          return;
        }

        const reservationDto = {
          ...reservationData,
          exp_1: this.getExperienceName(this.selectedExperiences[0].id),
          exp_1_rating: this.ratings[this.selectedExperiences[0].id] || 0,
          exp_2: this.getExperienceName(this.selectedExperiences[1].id),
          exp_2_rating: this.ratings[this.selectedExperiences[1].id] || 0,
          exp_3: this.getExperienceName(this.selectedExperiences[2].id),
          exp_3_rating: this.ratings[this.selectedExperiences[2].id] || 0,
          created_at: new Date().toISOString(),
        };

        await createReservation(reservationDto);
        this.toast.success(
          "Rezervasyon ve deneyim bilgileri başarıyla kaydedildi!"
        );
        this.$router.push({ name: "UserForm" });
      } catch (error) {
        console.error("Error saving reservation and experience data:", error);
        this.toast.error(
          "Rezervasyon ve deneyim bilgileri kaydedilirken hata oluştu."
        );
      }
    },
    getExperienceName(id) {
      const experience = this.experiences.find((exp) => exp.id === id);
      return experience ? experience.name : "";
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
}

.card {
  background-color: white;
  border-radius: 10px;
}

.card h2 {
  text-align: center;
  color: #343a40;
}

.control-group {
  display: inline-block;
  vertical-align: top;
  background: #ffffff;
  text-align: left;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  margin: 10px;
}

.control {
  display: block;
  position: relative;
  padding-left: 30px;
  margin-bottom: 15px;
  cursor: pointer;
  font-size: 18px;
}

input {
  position: absolute;
  z-index: -1;
  opacity: 0;
}

.control__indicator {
  position: absolute;
  top: 2px;
  left: 0;
  height: 20px;
  width: 20px;
  background: #e6e6e6;
}

.control:hover input ~ .control__indicator,
.control input:focus ~ .control__indicator {
  background: #cccccc;
}

.control input:checked ~ .control__indicator {
  background: #2aa1c0;
}

.control:hover input:not([disabled]):checked ~ .control__indicator,
.control input:checked:focus ~ .control__indicator {
  background: #0e647d;
}

.control input:disabled ~ .control__indicator {
  background: #e6e6e6;
  opacity: 0.6;
  pointer-events: none;
}

.control__indicator:after {
  content: "";
  position: absolute;
  display: none;
}

.control input:checked ~ .control__indicator:after {
  display: block;
}

.control--checkbox .control__indicator:after {
  left: 8px;
  top: 4px;
  width: 3px;
  height: 8px;
  border: solid #ffffff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.control--checkbox input:disabled ~ .control__indicator:after {
  border-color: #7b7b7b;
}

.control--radio .control__indicator:after {
  left: 7px;
  top: 7px;
  height: 6px;
  width: 6px;
  border-radius: 50%;
  background: #ffffff;
}

.control--radio input:disabled ~ .control__indicator:after {
  background: #7b7b7b;
}

.select {
  position: relative;
  display: inline-block;
  margin-bottom: 15px;
  width: 100%;
}

select {
  display: inline-block;
  width: 100%;
  cursor: pointer;
  padding: 10px 15px;
  outline: 0;
  border: 0;
  border-radius: 0;
  background: #e6e6e6;
  color: #7b7b7b;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

select::-ms-expand {
  display: none;
}

select:hover,
select:focus {
  color: #000000;
  background: #cccccc;
}

select:disabled {
  opacity: 0.5;
  pointer-events: none;
}

.select__arrow {
  position: absolute;
  top: 16px;
  right: 15px;
  width: 0;
  height: 0;
  pointer-events: none;
  border-style: solid;
  border-width: 8px 5px 0 5px;
  border-color: #7b7b7b transparent transparent transparent;
}

.select select:hover ~ .select__arrow,
.select select:focus ~ .select__arrow {
  border-top-color: #000000;
}

.select select:disabled ~ .select__arrow {
  border-top-color: #cccccc;
}
</style>
