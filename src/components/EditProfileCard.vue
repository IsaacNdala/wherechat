<template>
  <div class="edit-card-container" :class="{'hide-container': showEdit }">
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
    <div class="overlay" @click="closeEditCard"></div>
    <div class="edit-card" :class="{'move-edit': showEdit }">
      <div class="edit-card__img-container border">
        <img id="preview" :src="serverDomain + loggedUser.imageUrl" alt="user"/>
      </div>
      <span v-if="remove" id="remove-image" class="border" @click="removePreview(user)">
        <i class="fi fi-rr-cross d-flex text-danger"></i>
      </span>
      <form @submit.prevent="editProfile" class="edit-card__form">
        <div class="mb-3 d-flex justify-content-center">
          <label for="image" class="form-label border"><i class="fi fi-rr-picture"></i> Choose an image</label>
          <input
            type="file"
            id="image"
            class="d-none" 
            @change="onChangeFile" 
            accept=".png, .jpg, .jpeg"
          />
        </div>
        <div class="mb-2 row g-2 align-items-center" > 
          <div class="col-6">
            <input
              type="text"
              class="form-control"
              id="firstName"
              placeholder="First name"
              v-model="editForm.firstName"
              required
            />
          </div>
          <div class="col-6">
            <input
              type="text" 
              id="lastName" 
              class="form-control" 
              placeholder="Last name" 
              v-model="editForm.lastName"
              required
            />
          </div>
        </div>
        <div 
          class="mb-3">
          <input 
            type="email" 
            id="email"
            class="form-control"
            placeholder="Email"
            v-model="editForm.email"
            required
          >
        </div>
        <div class="row g-3 align-items-center">
          <div class="col-6">
            <button type="button" @click="closeEditCard" class="btn btn-dark col-12">
              <i class="fi fi-rr-cross"></i> <span>Close</span>
            </button>
          </div>
          <div class="col-6">
            <button id="edit-submit" class="btn btn-primary col-12">
              <i class="fi fi-rr-pencil"></i> <span>Edit</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { mapMutations, mapState } from 'vuex'
import axios from 'axios';

export default {
  name: "EditCard",
  props: ["user"],
  data() {
    return {
      move: false,
      remove: false,
      alertSuccess: false,
      alertDanger: false,
      message: null,
      editForm: {
        image: null,
        firstName: null,
        lastName: null,
        email: null,
        imageChanged: false
      }
    }
  },
  computed: {
    ...mapState(['showEdit', 'serverDomain']),
    loggedUser() {
      return store.state.user
    }
  },
  methods: {
    ...mapMutations(['closeEdit']),
    closeEditCard() {
      this.closeEdit()
    },
    closeAlert() {
      this.alertDanger = false
    },  
    async editProfile() {
      document.getElementById('edit-submit').disabled = true
      try {
        const formData = new FormData();
        formData.append('firstName', this.editForm.firstName)
        formData.append('lastName', this.editForm.lastName)
        formData.append('email', this.editForm.email)
        formData.append('image', this.editForm.image)
        formData.append('imageChanged', this.editForm.imageChanged)

        const res = await axios.post(store.state.serverDomain + 'user/edit-profile', formData, {
          headers: {
            Authorization: `Bearer ${store.state.token}`
          }
        })

        this.message = res.data.msg

        const loadedUser = { 
          firstName: res.data.user.firstName,
          lastName: res.data.user.lastName,
          email: res.data.user.email,
          imageUrl: res.data.user.imageUrl,
          id: res.data.user._id,
          token: store.state.token
        }

        localStorage.setItem('user', JSON.stringify(loadedUser))
        const user = JSON.parse(localStorage.getItem('user'))
        store.commit('setUser', user)
        store.commit('setToken', user.token)

        if(res) {
          this.alertSuccess = true
          this.alertDanger = false
          this.removePreview(loadedUser)
          setTimeout(() => {
            this.closeEdit()
            this.alertSuccess = false
            document.getElementById('edit-submit').disabled = false
          }, 2000)
        }
      } catch(error) {
        document.getElementById('edit-submit').disabled = false
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
    onChangeFile() {
      let file = document.getElementById('image').files[0]
      let preview = document.getElementById('preview')
      this.editForm.image = file
      this.editForm.imageChanged = true

      if(file) {
        const read = new FileReader()

        read.onload = () => {
          preview.setAttribute('src', read.result)
        }

        read.readAsDataURL(file)
        this.remove = true
      }
    },
    removePreview(user) {
      let preview = document.getElementById('preview')
      preview.setAttribute('src', store.state.serverDomain + user.imageUrl)
      this.remove = false
      this.editForm.image = document.getElementById('image').value = null
      this.editForm.imageChanged = false
    }
  },
  created() {
    this.editForm.firstName = store.state.user.firstName
    this.editForm.lastName = store.state.user.lastName
    this.editForm.email = store.state.user.email
  }
};
</script>


<style lang="scss">
.edit-card-container {
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

  .edit-card {
    border: 1px solid #d0d2d4;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 85%;
    border-radius: 0.25rem;
    padding: 2rem 1rem;
    background-color: white;
    transition: .6s all;

    .edit-card__img-container {
      width: 7rem;
      height: 7rem;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      position: relative;

      img {
        width: 7rem;
      }
    }

    #remove-image {
      margin-top: .5rem;
      padding: .4rem;
      border-radius: 50%;
      cursor: pointer;
    }

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

    .edit-card {
      width: 30rem;
    }
  }

  .move-edit {
    transform: translateY(100%);
  }
}

.hide-container {
  opacity: 0;
  visibility: hidden;
}
</style>