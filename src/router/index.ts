import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import AdminHome from "../views/agency/AdminHome.vue";
import ExperienceComponent from "../views/agency/ExperienceComponent.vue";
import HotelComponent from "../views/agency/HotelComponent.vue";
import HotelExperienceComponent from "../views/agency/HotelExperienceComponent.vue";
import ReservationRequestComponent from "../views/agency/ReservationRequestComponent.vue";
import UserComponent from "../views/agency/UserComponent.vue";
import UserPreferenceComponent from "../views/agency/UserPreferenceComponent.vue";
import UserRecommendationComponent from "../views/agency/UserRecommendationComponent.vue";
import CustomerHome from "@/views/customer/CustomerHome.vue";
import UserForm from "@/views/customer/UserForm.vue";
import ReservationRequestForm from "@/views/customer/ReservationRequestForm.vue";
import ExperienceForm from "@/views/customer/ExperienceForm.vue";
import ExperienceRating from "@/views/customer/ExperienceRating.vue";
import ReservationConfirmedComponent from "../views/agency/ReservationConfirmedComponent.vue";
import UserFeedbackComponent from "@/views/agency/UserFeedbackComponent.vue";
import UserFeedbackStatus from "@/views/agency/UserFeedbackStatus.vue";

// Import components

const routes: Array<RouteRecordRaw> = [
  {
    path: "/admin",
    name: "AdminHome",
    component: AdminHome,
  },
  {
    path: "/admin/experience",
    name: "ExperienceComponent",
    component: ExperienceComponent,
  },
  {
    path: "/admin/hotel",
    name: "HotelComponent",
    component: HotelComponent,
  },
  {
    path: "/admin/HotelExperience",
    name: "HotelExperienceComponent",
    component: HotelExperienceComponent,
  },
  {
    path: "/admin/ReservationRequest",
    name: "ReservationRequestComponent",
    component: ReservationRequestComponent,
  },
  {
    path: "/admin/User",
    name: "UserComponent",
    component: UserComponent,
  },
  {
    path: "/admin/UserPreference",
    name: "UserPreferenceComponent",
    component: UserPreferenceComponent,
  },
  {
    path: "/admin/UserRecommendation",
    name: "UserRecommendationComponent",
    component: UserRecommendationComponent,
  },
  {
    path: "/customer",
    name: "CustomerHome",
    component: CustomerHome,
  },
  {
    path: "/customer/user-form",
    name: "UserForm",
    component: UserForm,
  },
  {
    path: "/customer/reservation-form",
    name: "ReservationForm",
    component: ReservationRequestForm,
  },
  {
    path: "/customer/experience-form",
    name: "ExperienceForm",
    component: ExperienceForm,
  },
  {
    path: "/customer/experience-rating",
    name: "ExperienceRating",
    component: ExperienceRating,
  },
  {
    path: "/admin/reservation-confirmed",
    name: "ReservationConfirmedList",
    component: ReservationConfirmedComponent,
  },
  {
    path: "/admin/reservation-confirmed/:id",
    name: "ReservationConfirmedDetail",
    component: ReservationConfirmedComponent,
  },
  {
    path: "/admin/user-feedback",
    name: "UserFeedback",
    component: UserFeedbackComponent,
  },
  {
    path: "/admin/user-feedback-status",
    name: "UserFeedbackStatus",
    component: UserFeedbackStatus,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
