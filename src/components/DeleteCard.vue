<template>
  <div class="delete-card-container" :class="{'hide-delete': showDeleteAccount }">
    <div 
      class="mt-2 mb-1 alert alert-danger text-danger alert-dismissible fade show" 
      :class="{'show-alert': alertDanger }" 
      role="alert">
      {{ message }}
      <button type="button" @click="closeAlert" class="btn-close" aria-label="Close"></button>
    </div>
    <div :class="{'show-alert': alertSuccess }" class="alert alert-success" role="alert">
      {{ message }} 🙁
    </div>
    <div class="overlay" @click="closeDelCard"></div>
    <div class="edit__card" :class="{'move-edit': showDeleteAccount }">
      <h4 class="text-center"><i class="fi fi-rr-trash"></i> Delete Account</h4>
      <p class="text-center">Do You want to delete your account?</p>
      <form @submit.prevent="deleteAccount" class="edit__card__form">
        <div class="row g-3 align-items-center">
          <div class="col-6">
            <button type="button" @click="closeDelCard" class="btn btn-dark col-12">
              <i class="fi fi-rr-cross"></i> <span>Close</span>
            </button>
          </div>
          <div class="col-6">
            <button id="del-submit" class="btn btn-danger col-12">
              <i class="fi fi-rr-trash"></i> <span>Delete</span>
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
  name: "DeleteCard",
  props: ["user"],
  data() {
    return {
      deleteForm: {
        userId: null,
        imageUrl: null
      },
      alertSuccess: false,
      alertDanger: false,
      message: null,
    }
  },
  computed: {
    ...mapState(['showDeleteAccount']),
  },
  methods: {
    ...mapMutations(['closeDel']),
    closeDelCard() {
      this.closeDel()
    },closeAlert() {
      this.alertDanger = false
    },async deleteAccount() {
      document.getElementById('del-submit').disabled = true
      try {
        const res = await axios.post(store.state.serverDomain + 'user/delete-account', this.deleteForm, {
          headers: {
            Authorization: `Bearer ${store.state.token}`
          }
        })

        this.message = res.data.msg

        if(res) {
          this.alertSuccess = true
          this.alertDanger = false
          setTimeout(() => {
            this.alertSuccess = false
            document.getElementById('del-submit').disabled = false
            this.closeDelCard()
            this.$router.push('/login')
          }, 2000)
        }
      } catch(error) {
        document.getElementById('del-submit').disabled = false
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
  created() {
    this.deleteForm.userId = store.state.user.userId
    this.deleteForm.imageUrl = store.state.user.imageUrl
  }
};
</script>


<style lang="scss">
.delete-card-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
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
    }

    button {
      margin-top: 1rem;
      border-radius: 10rem;

      span {
          margin-left: .2rem;
          font-size: 1rem;
      }

      i {
          font-size: .85rem;
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

.hide-delete {
  opacity: 0;
  visibility: hidden;
}
</style>