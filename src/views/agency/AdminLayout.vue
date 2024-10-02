<!-- src/views/agency/AdminLayout.vue -->
<template>
  <div class="admin-layout">
    <nav class="navbar navbar-expand-lg navbar-dark custom-navbar">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img src="@/assets/logo.png" alt="Logo" class="logo" />
          <span class="ms-2 fw-bold">Admin Panel</span>
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/admin" active-class="active"
                >Home</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link"
                to="/admin/experience"
                active-class="active"
                >Experience</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link"
                to="/admin/hotel"
                active-class="active"
                >Hotel</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link"
                to="/admin/hotelExperience"
                active-class="active"
                >Hotel Experience</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link"
                to="/admin/reservationRequest"
                active-class="active"
                >Reservation Request</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link"
                to="/admin/user"
                active-class="active"
                >User</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link"
                to="/admin/userRecommendation"
                active-class="active"
                >User Recommendation</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link"
                :to="{ name: 'ReservationConfirmedList' }"
                active-class="active"
                >Reservation Confirmed</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link"
                to="/admin/user-feedback"
                active-class="active"
                >Feedback</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link"
                to="/admin/user-feedback-status"
                active-class="active"
                >User Feedback Status</router-link
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <main class="container-fluid mt-4">
      <slot></slot>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AdminLayout",
});
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.custom-navbar {
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #1e2324;
}

.navbar-brand {
  display: flex;
  align-items: center;
  font-size: 1.25rem;
}

.logo {
  height: 40px;
  width: auto;
}

.nav-link {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  transition: color 0.3s ease;
  color: #ffffff;
}

.nav-link:hover,
.nav-link.active {
  color: #ffffff !important;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

main {
  flex: 1;
  padding: 2rem;
  background-color: #f8f9fa;
}

@media (max-width: 991.98px) {
  .navbar-nav {
    padding-top: 1rem;
  }

  .nav-link {
    padding: 0.5rem 0;
  }
}
</style>
