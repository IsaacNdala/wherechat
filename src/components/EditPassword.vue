<template>
  <div class="edit-password-card-container" :class="{'hide-edit-password': showEditPassword }">
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
    <div class="overlay" @click="closeEditPasswordCard"></div>
    <div class="edit__card" :class="{'move-edit': showEditPassword }">
      <h4 class="text-center"><i class="fi fi-rr-lock"></i> Change Password</h4>
      <form @submit.prevent="editPassword" class="edit__card__form">
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            v-model="passwordForm.password"
            type="password" 
            id="password"
            class="form-control"
            placeholder="Your corrent password"
            required
          >
        </div>
        <div class="mb-3">
          <label for="newPassword" class="form-label">New password</label>
          <input
            v-model="passwordForm.newPassword"
            type="password" 
            id="newPassword"
            class="form-control"
            placeholder="Your new password"
            required
          >
        </div>
        <div class="row g-3 align-items-center">
          <div class="col-6">
            <button type="button" @click="closeEditPasswordCard" class="btn btn-dark col-12">
              <i class="fi fi-rr-cross"></i> <span>Close</span>
            </button>
          </div>
          <div class="col-6">
            <button id="edit-password-submit" class="btn btn-primary col-12">
              <span>Change</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import store from '@/store'
import axios from 'axios'

export default {
  name: "EditPasswordCard",
  props: ["user"],
  data() {
    return {
      passwordForm: {
        password: '',
        newPassword: ''
      },
      alertSuccess: false,
      alertDanger: false,
      message: null,
    }
  },
  computed: {
    ...mapState(['showEditPassword']),
  },
  methods: {
    ...mapMutations(['closeEditPassword']),
    closeEditPasswordCard() {
      this.closeEditPassword()
    },
    closeAlert() {
      this.alertDanger = false
    },
    async editPassword() {
      document.getElementById('edit-password-submit').disabled = true
      try {
        const res = await axios.post(store.state.serverDomain + 'user/edit-password', this.passwordForm, {
          headers: {
            Authorization: `Bearer ${store.state.token}`
          }
        })

        this.message = res.data.msg

        if(res) {
          this.alertSuccess = true
          this.alertDanger = false
          setTimeout(() => {
            this.closeEditPasswordCard()
            this.alertSuccess = false
            document.getElementById('edit-password-submit').disabled = false
          }, 2000)
        }
      } catch(error) {
        document.getElementById('edit-password-submit').disabled = false
        if(error.response && error.response.status === 401) {
          this.$router.push('/login')
        }

        if(error.response) {
          this.message = error.response.data.msg
        } else {
          this.message = 'This a server error try again!'
        }
        this.alertSuccess = false
        this.alertDanger = true
      }
    },
  },
};
</script>


<style lang="scss">
.edit-password-card-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 400;
  overflow: auto;
  background-color: rgba(0, 0, 0, .5);
  transition: 0.4s all;

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    cursor: zoom-out;
  }

  .alert {
    width: 85%;
    display: none;
    z-index: 200;
  }

  .show-alert {
    display: block;
  }

  .edit__card {
    border: 1px solid #d0d2d4;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 85%;
    border-radius: 0.25rem;
    padding: 2rem 1rem;
    background-color: white;
    transition: .6s all;

    form {
      width: 80%;

      label[for="image"] {
        margin-top: .5rem;
        padding: .3rem;
        border-radius: .5rem; 
        cursor: pointer;
      }
    }

    button {
      margin-top: 1rem;
      border-radius: 10rem;

      span {
          margin-left: .2rem;
          font-size: 1rem;
      }

      i {
          font-size: .91rem;
      }

      &:focus {
        box-shadow: none;
      }
    }
  }

  @media (min-width: 768px) {
    .show-alert {
      width: 30rem;
    }

    .edit__card {
      width: 30rem;
    }
  }

  .move-edit {
    transform: translateY(100%);
  }
}

.hide-edit-password {
  opacity: 0;
  visibility: hidden;
}
</style>