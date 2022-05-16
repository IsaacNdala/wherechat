<template>
  <div id="message-component" class="message-component">
    <nav class="message-component__nav">
      <a @click="this.$router.go(-1)"><i class="fi fi-rr-arrow-small-left d-flex"></i
      ></a>
      <div class="message-component__nav__img-container border">
        <img :src="serverDomain + userInChat.imageUrl" alt="" />
      </div>
      <span class="message-component__nav__username">{{ userInChat.firstName }} {{ userInChat.lastName }}</span>
    </nav>

    <div class="message-component__message-form-container">
      <form @submit.prevent="sendMessage">
        <div class="d-flex">
          <textarea
            v-model="messageForm.content"
            class="form-control"
            placeholder="Write a message"
            rows="1"
          ></textarea>
          <input v-model="messageForm.to" type="hidden" />
          <button class="btn btn-primary">
            <i class="fi fi-rr-paper-plane d-flex"></i>
          </button>
        </div>
      </form>
    </div>

    <div class="message-component__body">
      <div class="message-component__body__head">
        <div @click="scrollBottom" class="message-component__body__head__img-container border">
          <img :src="serverDomain + userInChat.imageUrl" alt="" />
        </div>
        <div class="message-component__body__head__info">
          <span class="message-component__body__head__info__username"
            >{{ userInChat.firstName }} {{ userInChat.lastName }}</span
          >
        </div>
      </div>
      <div v-for="message in newMessages" :key="message._id" class="message-component__body__message">
        <div class="d-flex" :class="{'flex-row-reverse': message.me }">
          <div v-if="!message.me" class="message-component__body__message__img-container border">
            <img :src="serverDomain + message.imageUrl" alt="" />
          </div>
          <div 
            class="message-component__body__message__content"
            :class="{'message-component__body__message__content__you': message.me }"
          >{{ message.content }}</div>
        </div>
        <span 
          class="message-component__body__message__date" 
          :class="{'message-component__body__message__date__you': message.me }">
          {{ message.date }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import store from '@/store'
import openSocket from 'socket.io-client'
import { mapState } from 'vuex'
export default {
  name: "MessageComponent",
  data() {
    return {
      messages: [],
      messageForm: {
        content: '',
        to: this.$route.params.userId
      },
      userInChat: {}
    }
  },computed: {
    ...mapState(['user', 'serverDomain']),
    newMessages() {
      const messages = [...this.messages]
      messages.forEach(message => {
        if(message.from._id === store.state.user.id) {
          message.me = true
          message.imageUrl = message.from.imageUrl
        }

        if(message.from._id === this.messageForm.to) {
          message.me = false
          message.imageUrl = message.from.imageUrl
        }
        
        message.date = new Date(message.createdAt).toDateString()
      })
      return messages
    }
  },
  watch: {
    '$route'(to) {
      this.messageForm.to = to.params.userId
      this.fetchMessages()
    },
  },
  methods: {
    // Method to auto scroll de message page
    scrollBottom() {
      let messageComponent = document.getElementById('message-component')
      messageComponent.scrollTo(0, messageComponent.scrollHeight)
    },
    // Method to send message
    async sendMessage() {
      let res
      if(this.messageForm.content !== '') {
        res = await axios.post(store.state.serverDomain + 'message/send-message', this.messageForm, { 
          headers: {
            Authorization: `Bearer ${store.state.token}`
          }
        })
      }

      if(res) {
        this.messageForm.content = ''
      }
    },
    // Method to get the messages on chat
    async fetchMessages() {
      try {
        const res = await axios.get(store.state.serverDomain + 'message/view-messages/' + this.messageForm.to, {
          headers: {
            Authorization: `Bearer ${store.state.token}`
          }
        })

        this.messages = res.data.messages

        if(res) {
          this.fetchUser()
        }
      } catch (error) {
        if(error.response && error.response.status === 401) {
          this.$router.push('/login')
        }
      }
    },
    // Method to get user information on chat
    async fetchUser() {
      try {
        const res = await axios.get(store.state.serverDomain + 'user/get-user/' + this.messageForm.to, { 
          headers: {
            Authorization: `Bearer ${store.state.token}`
          }
        })

        this.userInChat = res.data.user
      } catch (error) {
        if(error.response && error.response.status === 401) {
          this.$router.push('/login')
        }
      }
    }
  },
  created() {
    this.fetchMessages()
  },
  mounted() {
    if(document.getElementById('message-component')) {
      console.log('mounted')
    }
    const socket = openSocket(store.state.serverDomain)
    socket.on('messages', data => {
      if(data.action === 'sent') {
        this.messages.push(data.message)
        this.scrollBottom()
      }
    })
  },
  updated() {
    this.scrollBottom()
  }
};
</script>

<style lang="scss">
.message-component {
  position: relative;
  position: absolute;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  background-color: white;
  overflow: auto;
  z-index: 200;
  padding-top: 6rem;
  padding-bottom: 8rem;
  max-height: 100vh;
  overflow: auto;

  .message-component__nav {
    position: absolute;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: 4.5rem;
    background-color: white;
    border-bottom: 1px solid #d0d2d4;

    .message-component__nav__img-container {
      margin-right: 0.5rem;
    }

    a {
      padding: 1rem;
      padding-right: 0.5rem;
      i {
        font-size: 1.5rem;
      }
    }

    .message-component__nav__img-container {
      height: 3rem;
      width: 3rem;
      overflow: hidden;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 3rem;
      }
    }

    .message-component__nav__username {
      font-weight: bold;
    }
  }

  .message-component__message-form-container {
    padding: 1rem;
    height: 5rem;
    width: 100%;
    background-color: white;
    position: absolute;
    position: fixed;
    bottom: 0;
    right: 0;
    border-top: 1px solid #d0d2d4;

    textarea {
      border-radius: 2rem;
      padding-top: 0.7rem;
      padding-bottom: 0.7rem;

      &:focus {
        box-shadow: none;
        border-color: #ced4da;
      }
    }

    @media (min-width: 541px) {
      textarea {
        width: 30rem;
      }
    }

    button {
      padding: 1rem;
      border-radius: 50%;
      margin-left: 0.5rem;

      &:focus {
        box-shadow: none;
        border-color: #0d6efd;
        background-color: #0d6efd;
      }
    }
  }

  .message-component__body {
    .message-component__body__head {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-bottom: 2rem;

      .message-component__body__head__img-container {
        height: 6rem;
        width: 6rem;
        overflow: hidden;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          max-width: 6rem;
        }
      }

      .message-component__body__head__info {
        margin-top: 0.5rem;
        .message-component__body__head__info__username {
          font-weight: bold;
        }

        .message-component__body__head__info__country {
          margin-left: 0.3rem;
          font-size: 0.7rem;
          font-weight: bold;
          color: #006aff;
        }
      }
    }

    .message-component__body__message {
      display: flex;
      padding: 1rem 0.8rem 0 0.8rem;
      flex-direction: column;

      .message-component__body__message__img-container {
        height: 3rem;
        width: 3rem;
        overflow: hidden;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 3rem;
        }
      }

      .message-component__body__message__content {
        margin-left: 0.5rem;
        max-width: 12rem;
        display: flex;
        flex-direction: column;
        border-radius: 0 1rem 1rem 1rem;
        padding: 0.7rem;
        background-color: #e4e6eb;
        overflow-wrap: break-word;
      }

      @media (min-width: 440px) {
        .message-component__body__message__content {
          max-width: 20rem;
        }
      }

      .message-component__body__message__content__you {
        background-color: #006aff;
        border-radius: 1rem 0 1rem 1rem;
        color: white;
        margin-left: 0;
        margin-right: 0.5rem;
      }

      .message-component__body__message__date {
        margin-top: 0.2rem;
        text-align: center;
        font-size: 0.8rem;
        color: #65676b;
        text-align: center;
      }

      @media (min-width: 992px) {
        .message-component__body__message__date {
          text-align: left;
          margin-left: 5rem;
        }

        .message-component__body__message__date__you {
          text-align: right;
          margin-right: 7rem;
        }
      }
    }
  }
}

@media (min-width: 768px) {
  .message-component {
    width: 60%;
    right: 0;
    z-index: 50;
    padding-bottom: 12rem; 

    .message-component__message-form-container {
      width: 60%;
      bottom: 5rem;
    }
  }
}
</style>