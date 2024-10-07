<template>
  <div class="login">
    <div class="bg-illustration">
      <img src="@/assets/logo.png" alt="Logo" style="opacity: 0" />
    </div>
    <div class="container">
      <h1>Admin Panel Login</h1>
      <div class="login-form">
        <form @submit.prevent="login">
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="password-input"
          />
          <button type="submit">Login</button>
        </form>
      </div>
      <div class="remember-form">
        <input type="checkbox" id="remember" />
        <span for="remember">Remember me</span>
      </div>
      <div class="forget-pass">
        <a href="mailto:metapersona.agency@gmail.com">Forgot Password?</a>
      </div>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";

export default {
  data() {
    return {
      password: "",
      errorMessage: "",
      correctPassword: "Dogan.123",
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    login() {
      if (this.password === this.correctPassword) {
        localStorage.setItem("isAdminLoggedIn", "true");
        this.toast.success("Login successful! Redirecting...");
        this.$router.push("/admin/home");
      } else {
        this.toast.error("Invalid password. Please try again.");
      }
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  transition: 0.3s;
}

body {
  background-color: #f4f4f4;
  font-family: "Montserrat", sans-serif;
  overflow-x: hidden;
}

.login {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.bg-illustration {
  position: relative;
  width: 50%;
  background: url("/src/assets/logos/admin.jpg") no-repeat center center;
  background-size: cover;
  border-radius: 0 20px 20px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.container {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.container h1 {
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.login-form {
  margin-bottom: 20px;
}

.login-form form {
  display: flex;
  flex-direction: column;
}

.login-form form input {
  font-size: 16px;
  background: rgba(57, 57, 57, 0.07);
  margin: 12.5px 0;
  height: 50px;
  border: none;
  padding: 0 20px;
  border-radius: 10px;
  transition: background 0.3s;
}

.login-form form input:focus {
  background: rgba(57, 57, 57, 0.1);
}

.login-form form button[type="submit"] {
  background: linear-gradient(110deg, #000000 0%, #fdd6bd 100%);
  border: none;
  margin-top: 20px;
  height: 50px;
  text-transform: uppercase;
  color: white;
  border-radius: 10px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.3s;
}

.login-form form button[type="submit"]:hover {
  transform: translateY(-2px);
}

.remember-form {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 10px;
}

.remember-form input[type="checkbox"] {
  margin-right: 10px;
}

.remember-form span {
  font-size: 14px;
  color: #555;
}

.forget-pass {
  margin-top: 10px;
}

.forget-pass a {
  font-size: 14px;
  color: #007bff;
  text-decoration: none;
}

.forget-pass a:hover {
  text-decoration: underline;
}

.error {
  color: #ff4757;
  margin-top: 10px;
}
</style>
