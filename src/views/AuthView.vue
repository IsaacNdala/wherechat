<template>
  <div class="auth">
    <div v-if="authPreloader" class="auth__preloader">
      <img src="@/assets/images/Circle-Loading.svg" alt="">
    </div>
    <div class="auth__logo-container d-flex flex-column align-items-center">
      <h1 class="auth__logo-container-logo">
        <i class="fi fi-rr-paper-plane"></i> WhereChat
      </h1>
      <p>Be part of this global community</p>
      <div 
        class="mt-2 mb-1 alert alert-danger text-danger alert-dismissible fade show" 
        :class="{'show-alert': alertDanger }" 
        role="alert">
        {{ message }}
        <button type="button" @click="closeAlert" class="btn-close" aria-label="Close"></button>
      </div>
      <div :class="{'show-alert': alertSuccess }" class="alert alert-success" role="alert">
        {{ message }}
      </div>
      <div :class="{'show-alert': alertInfo }" class="alert alert-info" role="alert">
        {{ message }}
      </div>
    </div>
    <div class="auth__body">
      <ul class="d-flex">
        <li>
          <button @click="showSignInForm" :class="{ active: signInForm }">
            Sign In
          </button>
        </li>
        <li>
          <button @click="showSignUpForm" :class="{ active: signUpForm }">
            Sign Up
          </button>
        </li>
      </ul>
      <div class="auth__body__form-container">
        <!-- Sign In Form -->
        <form @submit.prevent="signIn" v-if="signInForm" class="mb-3 sing-in-form">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              v-model="signInFormData.email"
              type="email"
              class="form-control"
              id="email"
              placeholder="Enter email"
              required
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              v-model="signInFormData.password"
              type="password"
              class="form-control"
              id="password"
              placeholder="Enter password"
              required
            />
          </div>
          <button
            type="submit"
            class="
              mb-2
              btn
              auth__body__form-container__btn-submit
              col-12
              text-bold
            "
          >
            Sign in
          </button>
          <div class="text-center auth__body__form-container__forgot-password">
            <a href="" @click.prevent="featureNotAvailable">Forgot your password?</a>
          </div>
        </form>
        <!-- Sign Up Form -->
        <form @submit.prevent="signUp" v-if="signUpForm" class="mb-3 sing-in-form">
          <div class="mb-3 row g-2 align-items-center">
            <div class="col-md-6">
              <label for="firstName" class="form-label">First name</label>
              <input
                v-model.trim="signUpFormData.firstName"
                type="text"
                class="form-control"
                id="firstName"
                placeholder="Your first name"
                required
              />
            </div>
            <div class="col-md-6">
              <label for="lastName" class="form-label">Last name</label>
              <input
              v-model.trim="signUpFormData.lastName"
                type="text"
                class="form-control"
                id="lastName"
                placeholder="Your last Name"
                required
              />
            </div>
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              v-model.trim="signUpFormData.email"
              type="email"
              class="form-control"
              id="email"
              placeholder="Enter email"
              required
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
            v-model.trim="signUpFormData.password"
              type="password"
              class="form-control"
              id="password"
              placeholder="Create password"
              required
            />
          </div>
          <button
            type="submit"
            class="
              mb-2
              btn
              auth__body__form-container__btn-submit
              col-12
              text-bold
            "
          >
            Sign Up
          </button>
        </form>
        <div class="auth__body__form-container__divider mb-3"></div>
        <div class="text-center mb-3">or</div>
        <button
          @click="featureNotAvailable"
          type="submit mb-3"
          class="mb-2 btn btn-dark col-12 auth__body__form-container__btn-brand"
        >
          <i class="fi fi-brands-google"></i> Connect with Google
        </button>
        <button
          @click="featureNotAvailable"
          type="submit mb-3"
          class="
            mb-2
            btn btn-primary
            col-12
            auth__body__form-container__btn-brand
          "
        >
          <i class="fi fi-brands-facebook"></i> Connect with Facebook
        </button>
      </div>
    </div>
    <p class="text-white mt-2 auth__copy">Copyright &copy; 2022 <a href="https://www.linkedin.com/in/isaac-ndala" target="_blank" rel="noopener noreferrer">Isaac Ndala</a></p>
  </div>
</template>

<script>
import axios from 'axios'
import store from '@/store';

export default {
  name: "AuthView",
  data() {
    return {
      signUpFormData: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        latitude: null,
        longitude: null
      },
      signInFormData: {
        email: '',
        password: '',
        latitude: null,
        longitude: null
      },
      showWelcome: false,
      authPreloader: false,
      alertSuccess: false,
      alertDanger: false,
      alertInfo: false,
      message: '',
      signInForm: true,
      signUpForm: false,
    };
  },
  methods: {
    featureNotAvailable() {
      this.alertInfo = true
      this.message = 'Feature not available yet! 😊'
      setTimeout(() => {
        this.alertInfo = false
        this.message = ''
      }, 2000)
    },
    async signUp() {
      try {
        this.authPreloader = true
        if (store.state.showMapMarker) {
          this.signUpFormData.latitude = store.state.latitude
          this.signUpFormData.longitude = store.state.longitude
        }
        const response = await axios.post(store.state.serverDomain + 'auth/sign-up', this.signUpFormData)   
        this.message = response.data.msg
        const loadedUser = { 
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          email: response.data.user.email,
          imageUrl: response.data.user.imageUrl,
          id: response.data.userId,
          token: response.data.token 
        }
        localStorage.setItem('user', JSON.stringify(loadedUser))
        const user = JSON.parse(localStorage.getItem('user'))
        store.commit('setUser', user)
        store.commit('setToken', user.token)

        if(response) {
          this.showWelcome = false
          this.alertSuccess = true
          this.alertDanger = false
          setTimeout(() => {
            this.authPreloader = false
            this.$router.push('/')
          }, 2000)
        }
      } catch (err){
        if (err.response) {
          this.message = err.response.data.msg
        } else {
          this.message = 'This is a server error, try again!'
        }
        this.authPreloader = false
        this.alertSuccess = false
        this.alertDanger = true
      }
    },
    async signIn() {
      // Check user internet connection
      if(!navigator.onLine) {
        this.error = true
        this.message = 'No internet, check your connection!'
        this.authPreloader = false
        this.alertSuccess = false
        this.alertDanger = true
      }
      try {
        this.authPreloader = true
        if (store.state.showMapMarker) {
          this.signInFormData.latitude = store.state.latitude
          this.signInFormData.longitude = store.state.longitude
        }
        const response = await axios.post(store.state.serverDomain + 'auth/sign-in', this.signInFormData)
        this.message = response.data.msg
        
        const loadedUser = { 
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          email: response.data.user.email,
          imageUrl: response.data.user.imageUrl,
          id: response.data.userId,
          token: response.data.token 
        }
        
        localStorage.setItem('user', JSON.stringify(loadedUser))
        const user = JSON.parse(localStorage.getItem('user'))
        store.commit('setUser', user)
        store.commit('setToken', user.token)
        
        if(response) {
          this.showWelcome = false
          this.alertSuccess = true
          this.alertDanger = false
          setTimeout(() => {
            this.authPreloader = false
            this.$router.push('/')
          }, 2000)
        }
      } catch (err){
        if (err.response) {
          this.message = err.response.data.msg
        } else {
          this.message = ' This is a server error, try again!'
        }
        this.authPreloader = false
        this.alertSuccess = false
        this.alertDanger = true
      }
    },
    closeAlert() {
      this.alertDanger = false
    },
    showSignInForm() {
      this.signInForm = true
      this.signUpForm = false
    },
    showSignUpForm() {
      this.signInForm = false
      this.signUpForm = true
    },
  },
  mounted() {
    // Grab user geolocation
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        store.commit('setCoords', position.coords)
      }, () => {
        store.commit('disableCoords')
      }, { maximumAge: 60000 })
    } else {
      alert("Geolocation is not supported by your browser!")
    }
  },
};
</script>

<style lang="scss">
.auth {
  padding: 1.5rem;
  width: 100%;
  min-height: 100vh;
  background-image: url("../assets/images/auth-banner.jpeg");
  background-position: bottom center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: auto;

  .auth__copy {
    font-size: .9rem;
  }

  .auth__preloader {
    background-color: rgba(255, 255, 255, .7);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 100;

    h4 {
      font-weight: bold;
    }
  }

  .auth__logo-container {
    color: white;
    width: 100%;
  }

  ul {
    padding: 0;

    li {
      display: flex;

      button {
        padding: .7rem 0.5rem;
        color: white;
        font-weight: bold;
        border: none;
        background-color: transparent;
        
        &:focus {
          outline: none;
        }
      }

      button.active {
        color: #006aff;
        border-bottom: 2px solid #006aff;
      }
    }
  }

  .alert {
    width: 100%;
    display: none;
    z-index: 200;
  }

  .show-alert {
    display: block;
  }

  .auth__body__form-container {
    padding: 2rem;
    border-radius: 0.35rem;
    background-color: white;
    width: 100%;

    label,
    .auth__body__form-container__forgot-password {
      font-weight: bold;
    }

    .auth__body__form-container__divider {
      border-bottom: 1px solid #acafb6;
    }

    .auth__body__form-container__btn-submit {
      background-color: #006aff;
      color: white;
    }
  }

  @media (min-width: 430px) {
    .alert {
      width: 25rem;
    }

    .auth__body__form-container {
      width: 25rem;
    }

    .auth__logo-container {
      text-align: center;
    }

    ul {
      justify-content: center;
    }
  }
}
</style>