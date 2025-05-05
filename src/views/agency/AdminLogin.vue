<template>
  <div class="login-container">
    <div class="animated-background">
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
    </div>

    <div class="login-split">
      <div class="login-image">
        <div class="overlay"></div>
        <img
          src="@/assets/logos/admin.jpg"
          alt="Admin Background"
          class="bg-image"
        />
        <div class="image-content">
          <img src="@/assets/logo.png" alt="Logo" class="logo-overlay" />
          <h2>Meta Persona</h2>
          <p>Welcome to Admin Dashboard</p>
        </div>
      </div>

      <div class="login-form-container">
        <div class="login-card">
          <div class="login-header">
            <h1>Admin Login</h1>
            <p class="subtitle">Please sign in to continue</p>
          </div>

          <div class="login-form">
            <form @submit.prevent="login">
              <div class="form-group">
                <label for="password">Password</label>
                <div class="password-input-wrapper">
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    placeholder="Enter your admin password"
                    class="password-input"
                  />
                  <button
                    type="button"
                    class="toggle-password"
                    @click="showPassword = !showPassword"
                  >
                    <i
                      :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                    ></i>
                  </button>
                </div>
              </div>

              <div class="form-options">
                <label class="remember-me">
                  <input type="checkbox" v-model="rememberMe" />
                  <span>Remember me</span>
                </label>
                <a
                  href="mailto:metapersona.agency@gmail.com"
                  class="forgot-password"
                >
                  Forgot Password?
                </a>
              </div>

              <button type="submit" class="login-button">
                <span>Sign In</span>
                <i class="fas fa-arrow-right"></i>
              </button>
            </form>
          </div>

          <div class="login-footer">
            <p>© {{ currentYear }} Meta Persona. All rights reserved.</p>
          </div>
        </div>
      </div>
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
      showPassword: false,
      rememberMe: false,
      currentYear: new Date().getFullYear(),
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
        if (this.rememberMe) {
          localStorage.setItem("rememberAdmin", "true");
        }
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
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f4f8;
  position: relative;
  overflow: hidden;
}

.animated-background {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
  overflow: hidden;
}

.wave {
  position: absolute;
  width: 200%;
  height: 200%;
  opacity: 0.4;
}

.wave:nth-child(1) {
  background: radial-gradient(circle at 50% 50%, #90cdf4 0%, transparent 50%);
  animation: wave 12s linear infinite;
}

.wave:nth-child(2) {
  background: radial-gradient(circle at 50% 50%, #63b3ed 0%, transparent 50%);
  animation: wave 8s linear infinite;
}

.wave:nth-child(3) {
  background: radial-gradient(circle at 50% 50%, #4299e1 0%, transparent 50%);
  animation: wave 4s linear infinite;
}

@keyframes wave {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.login-split {
  display: flex;
  width: 100%;
  max-width: 1200px;
  height: 600px;
  margin: 20px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
}

.login-image {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(66, 153, 225, 0.85) 0%,
    rgba(49, 130, 206, 0.95) 100%
  );
  z-index: 1;
  mix-blend-mode: multiply;
}

.image-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 2;
  width: 100%;
  padding: 0 40px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.logo-overlay {
  width: 120px;
  height: auto;
  margin-bottom: 20px;
  animation: fadeInUp 1s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.image-content h2 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 10px;
  animation: fadeInUp 1s ease 0.2s;
  opacity: 0;
  animation-fill-mode: forwards;
  letter-spacing: 0.5px;
}

.image-content p {
  font-size: 18px;
  opacity: 0;
  animation: fadeInUp 1s ease 0.4s;
  animation-fill-mode: forwards;
  letter-spacing: 0.3px;
}

.login-form-container {
  flex: 1;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.login-form-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.1) 100%
  );
  pointer-events: none;
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  font-size: 16px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #1a1a1a;
  font-weight: 500;
  font-size: 14px;
}

.password-input-wrapper {
  position: relative;
}

.password-input {
  width: 100%;
  height: 48px;
  padding: 0 48px 0 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 15px;
  color: #1a1a1a;
  background: white;
  transition: all 0.3s ease;
}

.password-input:focus {
  border-color: #4299e1;
  box-shadow: 0 0 0 4px rgba(66, 153, 225, 0.1);
}

.toggle-password {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0;
  font-size: 16px;
  transition: color 0.3s ease;
}

.toggle-password:hover {
  color: #4299e1;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.remember-me input[type="checkbox"] {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 2px solid #e0e0e0;
  cursor: pointer;
}

.remember-me span {
  font-size: 14px;
  color: #666;
}

.forgot-password {
  font-size: 14px;
  color: #4299e1;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #3182ce;
  text-decoration: underline;
}

.login-button {
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(66, 153, 225, 0.2);
  background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%);
}

.login-button:active {
  transform: translateY(0);
}

.login-footer {
  text-align: center;
  margin-top: 32px;
  color: #666;
  font-size: 14px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 968px) {
  .login-split {
    flex-direction: column;
    height: auto;
  }

  .login-image {
    height: 300px;
  }

  .login-form-container {
    padding: 30px 20px;
  }
}

@media (max-width: 480px) {
  .login-image {
    height: 200px;
  }

  .image-content h2 {
    font-size: 24px;
  }

  .image-content p {
    font-size: 16px;
  }

  .form-options {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .login-header h1 {
    font-size: 24px;
  }

  .subtitle {
    font-size: 14px;
  }
}
</style>
