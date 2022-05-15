<template>
  <div class="profile__card">
    <div v-if="profile" class="profile__card__icon-buttons">
        <i class="fi fi-rr-lock" @click="openEditPasswordCard()"></i>
        <i class="fi fi-rr-trash" @click="openDeleteCard()"></i>
    </div>
    <div class="profile__card__img-container border" @click="showImageZoomIn(user.imageUrl)">
      <div v-if="user.imageUrl !== 'images/user.png'" class="profile__card__img-container__overlay"></div>
      <img :src="serverDomain + user.imageUrl" alt="user" />
    </div>
    <div class="profile__card__info">
      <span class="profile__card__info__username"
        >{{ user.firstName }} {{ user.lastName }}</span
      >
      <span class="profile__card__info__country">{{ user.country }}</span>
    </div>
    <span v-if="profile" class="profile__card__email">{{ user.email }}</span>
    <button 
      v-if="chat && user._id !== loggedUser.id" 
      @click="this.$router.push('/messages/' + user._id)" 
      class="btn btn-primary">
      <i class="fi fi-rr-comment-alt"></i> <span>Chat</span>
    </button>
        <button 
      v-if="chat && user._id === loggedUser.id" 
      @click="this.$router.push('/profile')" 
      class="btn btn-primary">
      <i class="fi fi-rr-user"></i> <span>Profile</span>
    </button>
    <button 
      v-if="profile" 
      @click="openEditCard()" 
      class="btn btn-primary">
      <i class="fi fi-rr-pencil"></i> <span>Edit</span>
    </button>
  </div>
</template>

<script>
import store from '@/store'
import { mapMutations, mapState } from 'vuex'

export default {
  name: "ProfileCard",
  props: ["user", "chat", "profile"],
  data() {
    return {
      move: false
    }
  },
  computed: {
    ...mapState(['serverDomain', 'toggleImageZoomIn']),
    loggedUser() {
      return store.state.user
    }
  },
  methods: {
    ...mapMutations(['openEdit', 'openEditPassword', 'openDel']),
    showImageZoomIn(imageUrl) {
      if(imageUrl !== 'images/user.png') {
        this.$store.commit("showImageZoomIn");
        document.querySelector("body").style.overflow = "hidden"
      }
    },
    openEditCard() {
      this.openEdit()
    },
    openEditPasswordCard() {
      this.openEditPassword()
    },
    openDeleteCard() {
      this.openDel()
    }
  },
};
</script>


<style lang="scss">
.profile__card {
  position: relative;
  border: 1px solid #d0d2d4;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 85%;
  border-radius: 0.25rem;
  padding: 2rem 1rem;
  background-color: white;
  transition: .5s all;

  .profile__card__icon-buttons {
    position: absolute;
    top: .5rem;
    right: .5rem;

    i {
      padding: .2rem;
      font-size: 1.1rem;
      cursor: pointer;
      &:last-child {
        margin-left: .2rem;
      }
    }
  }

  .profile__card__img-container {
    width: 7rem;
    height: 7rem;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;

    .profile__card__img-container__overlay {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      position: absolute;
      top: 0;
      left: 0;
      transition: 0.3s all;
      cursor: zoom-in;

      &:hover {
        background-color: rgba(0, 0, 0, 0.4);
      }
    }

    img {
      width: 7rem;
    }
  }

  .profile__card__info {
    margin-top: 1rem;

    .profile__card__info__username {
      font-weight: bold;
    }

    .profile__card__info__country {
      margin-left: 0.3rem;
      font-size: 0.7rem;
      font-weight: bold;
      color: #006aff;
    }
  }

  .profile__card__email {
    margin-top: 0.2rem;
  }

  button {
    margin-top: 1rem;
    width: 50%;
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
  .profile__card {
    width: 30rem;
  }
}
</style>