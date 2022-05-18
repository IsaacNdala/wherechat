<template>
  <div class="messages">
    <top-navigation />
    <div class="messages__container">
      <h5 class="messages__container__title">Messages</h5>
      <form @submit.prevent="" class="mb-3">
        <div class="row g-2 align-items-center">
          <div class="col-md-12">
            <input
              type="text"
              id="search"
              class="form-control"
              placeholder="search..."
              v-model="searchInput"
              @keyup="searchMessages"
            />
          </div>
        </div>
      </form>
      <div class="messages__items">
        <router-link
          v-for="message in filteredMessages"
          :key="message.id"
          :to="messagePath + message.id"
          active-class="active"
          class="link-list"
        >
          <div class="messages__items__img-container border">
            <img :src="serverDomain + message.imageUrl" alt="" />
          </div>
          <div class="messages__items__caption-container">
            <span class="messages__items__caption-container__name">{{
              message.name
            }}</span>
            <span>{{ message.content }}</span>
          </div>
          <span class="messages__items__caption-container__time">{{
            message.date
          }}</span>
        </router-link>
      </div>
    </div>
    <router-view />
    <bottom-navigation />
  </div>
</template>

<script>
import BottomNavigation from "@/components/BottomNavigation.vue"
import TopNavigation from "@/components/TopNavigation.vue"
import axios from 'axios'
import store from '@/store'
import { mapState } from 'vuex'
import openSocket from 'socket.io-client'

export default {
  name: "MessagesView",
  components: {
    BottomNavigation,
    TopNavigation,
  },
  data() {
    return {
      messagePath: '/messages/',
      messages: [],
      searchInput: ''
    };
  },
  computed: {
    ...mapState(['serverDomain']),
    filteredMessages() {
      let messages = [];

      for (let i = 0; i < this.messages.length; i++) {
        let msg = this.messages[i];
        msg.date = new Date(msg.date).toDateString()
        if (msg.content.length > 30) {
          let newMsgContent = msg.content.slice(0, 30);

          let i = newMsgContent.replace(/,[^a-zA-Z0-9]$/g, "");

          msg.content = `${i}...`;
        }

        messages.push(msg);
      }

      return messages;
    },
  },
  methods: {
    searchMessages() {
      let input = this.searchInput.toLowerCase()
      let linkList = document.getElementsByClassName('link-list')
      let name

      for(let i = 0; i < linkList.length; i++) {
        name = linkList[i].getElementsByClassName('messages__items__caption-container__name')[0]
        if(name.innerHTML.toLowerCase().includes(input)) {
          linkList[i].style.display = ''
        } else {
          linkList[i].style.display = 'none'
        }
      }
    },
    async fetchMessages() {
      try {
        const res = await axios.get(store.state.serverDomain + 'message/get-all-messages', {
          headers: {
            Authorization: `Bearer ${store.state.token}`
          }
        })

        const messages = []
        const loggedUser = store.state.user
        let user
        
        for(const message of res.data.messages) {
          if(message.from._id !== loggedUser.id && messages.findIndex(user => user.id === message.from._id) === -1) {
            user = { 
              id: message.from._id, 
              imageUrl: message.from.imageUrl, 
              content: message.content,
              name: message.from.firstName + ' ' + message.from.lastName,
              date: message.createdAt,
              viewed: message.viewed,
              me: false,
            }
            messages.push(user)
          } 

          if(message.to._id !== loggedUser.id && messages.findIndex(user => user.id === message.to._id) === -1) {
            user = { 
              id: message.to._id, 
              imageUrl: message.to.imageUrl, 
              content: message.content,
              name: message.to.firstName + ' ' + message.to.lastName,
              date: message.createdAt,
              viewed: message.viewed,
              me: true 
            }
            messages.push(user)
          }
        }
        this.messages = messages
      } catch(error) {
        if(error.response && error.response.status === 401) {
          this.$router.push('/login')
        }
      }
    },
    reatToChange(data) {
      const loggedUser = store.state.user
      let user
      let message = data.message
      if(message.from._id !== loggedUser.id) {
        if(this.messages.findIndex(user => user.id === message.from._id) !== -1) {
          this.messages.splice(this.messages.findIndex(user => user.id === message.from._id), 1)
        }
        user = { 
          id: message.from._id, 
          imageUrl: message.from.imageUrl, 
          content: message.content,
          name: message.from.firstName + ' ' + message.from.lastName,
          date: message.createdAt,
          viewed: message.viewed,
          me: false,
        }
        this.messages.unshift(user)
      }

      if(message.to._id !== loggedUser.id) {
        if(this.messages.findIndex(user => user.id === message.to._id) !== -1) {
          this.messages.splice(this.messages.findIndex(user => user.id === message.to._id), 1)
        }
        user = { 
          id: message.to._id, 
          imageUrl: message.to.imageUrl, 
          content: message.content,
          name: message.to.firstName + ' ' + message.to.lastName,
          date: message.createdAt,
          viewed: message.viewed,
          me: true 
        }
        this.messages.unshift(user)
      }
    }
  },
  created() {
    this.fetchMessages()
  },
  mounted() {
    const socket = openSocket(store.state.serverDomain)
    socket.on('messages', data => {
      if(data.action === 'sent') {
        this.reatToChange(data)
      }
    })
  }
};
</script>

<style lang="scss">
.messages__container {
  padding: 5.5rem 0;
  width: 100%;
  height: 100vh;
  overflow: auto;

  .messages__container__title,
  form {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  form {
    #search {
      background-image: url("../assets/images/search.png");
      background-repeat: no-repeat;
      background-position: 1rem 50%;
      background-size: 15px;
      padding-left: 2.5rem;
      border-radius: 2rem;
    }

    #search:focus {
      box-shadow: none;
      border-color: #ced4da;
    }
  }

  .messages__items {
    a {
      display: flex;
      align-items: center;
      padding: 0.5rem 1.5rem;
      position: relative;

      &:hover,
      &.active {
        background-color: #e4e6ebb7;
      }

      span.messages__items__caption-container__time {
        position: absolute;
        font-weight: bold;
        top: 0.9rem;
        right: 1.5rem;
      }

      .messages__items__img-container {
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

      span {
        color: #65676b;
        font-size: 0.7rem;
      }

      .messages__items__caption-container {
        display: flex;
        flex-direction: column;
        justify-content: center;

        span.messages__items__caption-container__name {
          color: black;
          font-weight: bold;
          font-size: 0.8rem;
        }
      }

      @media (min-width: 380px) {
        .messages__items__img-container {
          width: 4rem;
          height: 4rem;

          img {
            width: 4rem;
          }
        }

        span {
          font-size: 0.8rem;
        }

        .messages__items__caption-container {
          span.messages__items__caption-container__name {
            font-size: 0.9rem;
          }
        }
      }
    }
  }
}

@media (min-width: 768px) {
  .messages__container {
    width: 40%;
    border-right: 1px solid #d0d2d4;
  }
}
@media (min-width: 992px) {
  .messages__container {
    width: 40%;
  }
}
</style>