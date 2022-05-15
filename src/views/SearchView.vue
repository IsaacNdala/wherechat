<template>
  <div class="search">
    <top-navigation />

    <div class="search__form-container">
      <h5  class="search-title">Search For Users</h5>
      <form @submit.prevent="searchUsers" class="mt-3">
        <input v-model="search" type="search" class="form-control" placeholder="search..." />
      </form>
      <p class="mb-2 mt-3">Results For: <span class="result-search">{{ search }}</span></p>
    </div>

    <div class="search__container">
      <div v-if="showUsers" class="search__items">
        <router-link
          v-for="user in users"
          :key="user._id"
          :to="messagePath + user._id"
          class="link-list"
        >
        <div class="d-flex align-items-center">
          <div class="search__items__img-container border">
            <img :src="serverDomain + user.imageUrl" alt="" />
          </div>
          <span class="search__items__name">{{ user.firstName }} {{ user.lastName }}</span>
        </div>
          <span class="search__items__icon">
            <i class="fi fi-rr-comment-alt d-flex"></i>
          </span>
        </router-link>
      </div>

      <h5 v-if="result" class="text-center show-result">No results this search!</h5>
    </div>

    <bottom-navigation />
  </div>
</template>

<script>
import BottomNavigation from "@/components/BottomNavigation.vue"
import TopNavigation from "@/components/TopNavigation.vue"
import axios from 'axios'
import store from '@/store'
import {mapState} from 'vuex'

export default {
  name: "SearchView",
  components: {
    BottomNavigation,
    TopNavigation,
  },
  data() {
    return {
      users: [],
      search: null,
      messagePath: '/messages/',
      result: false,
      showUsers: false
    };
  },
  computed: {
    ...mapState(['serverDomain'])
  },
  watch: {
    search(newValue) {
      if(!newValue) {
        this.result = false
        this.showUsers = false
      }
    }
  },
  methods: {
    async searchUsers() {
      try {
        const res = await axios.post(store.state.serverDomain + 'user/search-users', {search: this.search}, {
          headers: {
            Authorization: `Bearer ${store.state.token}`
          }
        })

        this.users = res.data.users
        if(res.data.users.length > 0) {
          this.showUsers = true
          this.result = false
        } else {
          this.showUsers = false
          this.result = true
        }
      } catch (error) {
        if(error.response && error.response.status === 401) {
          this.$router.push('/login')
        }

        if(error.response) {
          console.log(error.response.data.msg)
        }
      }
    }
  }
};
</script>

<style lang="scss">
.search {
  padding-top: 14.9rem;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-bottom: 3rem;

  .show-result {
    margin-top: 7rem;
  }

  .search__form-container {
    width: 90%;
    position: fixed;
    padding-top: 1.5rem;
    background-color: white;
    z-index: 100;
    top: 5rem;
    .search-title {
      font-weight: bold;
      text-align: center;
    }
    p {
      font-weight: bold;
      font-size: .8rem;
    }
    .result-search {
      font-size: 1rem;
    }

    form {
      input {
        padding: 1rem;
        border-radius: 2rem;
        background-image: url("../assets/images/search.png");
        background-repeat: no-repeat;
        background-position: 1rem 50%;
        background-size: 18px;
        padding-left: 3rem;
      }

      input:focus {
        box-shadow: none;
        border-color: #ced4da;
      }
    }
  }

  .search__container {
    padding: 0.5rem 0;
    width: 90%;
    overflow: auto;

    .search__items {
      margin-bottom: 5rem;
      a {
        display: flex;
        align-items: center;
        padding: 0.5rem 1.5rem;
        position: relative;
        justify-content: space-between;
        border-bottom: 1px solid #d0d2d4;

        &:hover {
          background-color: #e4e6ebb7;
        }

        .search__items__img-container {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          margin-right: 1rem;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            width: 3rem;
          }
        }

        span.search__items__name {
          color: black;
          font-weight: bold;
          font-size: 1rem;
        }

        span.search__items__icon {
          color: black;
          font-weight: bold;
          font-size: 1.2rem;
        }

        @media (min-width: 380px) {
          .search__items__img-container {
            width: 4rem;
            height: 4rem;

            img {
              width: 4rem;
            }
          }

          span {
            font-size: 0.8rem;
          }

          .search__items__caption-container {
            span.search__items__caption-container__name {
              font-size: 0.9rem;
            }
          }
        }
      }
    }
  }

  @media (min-width: 768px) {
    .search__container {
      width: 30rem
    }
  }

  @media (min-width: 992px) {
    .search__container {
      width: 30rem
    }
  }

  @media (min-width: 768px) {
    .search__form-container {
      width: 30rem;
    }
  }
}
</style>
