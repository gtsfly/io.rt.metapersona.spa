<template>
  <CustomerLayout>
    <div class="background">
      <div class="container mt-5">
        <div class="card p-4 shadow">
          <h2 class="mb-4">Kullanıcı Bilgileri</h2>
          <form @submit.prevent="submitForm">
            <div class="form-group mb-3">
              <label for="name">İsim:</label>
              <input
                type="text"
                id="name"
                v-model="name"
                class="form-control"
                required
              />
            </div>
            <div class="form-group mb-3">
              <label for="email">Email:</label>
              <input
                type="email"
                id="email"
                v-model="email"
                class="form-control"
                required
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
import { createUser } from "../../services/UserService";
import { useToast } from "vue-toastification";
import CustomerLayout from "./CustomerLayout.vue";

export default {
  name: "UserForm",
  components: {
    CustomerLayout,
  },
  data() {
    return {
      name: "",
      email: "",
      toast: useToast(),
    };
  },
  methods: {
    async submitForm() {
      try {
        const userDto = {
          name: this.name,
          email: this.email,
        };
        const userResponse = await createUser(userDto);
        const userId = userResponse.user_id;
        this.toast.success("Kullanıcı başarıyla oluşturuldu!");

        localStorage.setItem("userId", userId);

        this.$router.push({ name: "ReservationForm" });
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.toast.info("Kullanıcı zaten mevcut, bilgilerle devam ediliyor.");
          const existingUserId = error.response.data.user_id;

          localStorage.setItem("userId", existingUserId);
          this.$router.push({ name: "ReservationForm" });
        } else {
          console.error("Error creating user:", error);
          this.toast.error("Kullanıcı oluşturulurken hata oluştu.");
        }
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
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card .btn {
  background-color: #007bff;
  border: none;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.card .btn:hover {
  background-color: #0056b3;
}
</style>
