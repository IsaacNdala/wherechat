<template>
  <div class="home">
    <top-navigation />
    <h3 v-if="error" class="text-danger text-center mt-5">{{ errorMsg }}</h3>
    <div v-else id="map"></div>
    <image-zoom-in :imageUrl="user.imageUrl" />
    <div v-if="cardContainer" class="home__card-container">
      <div @click="cardContainer = false" class="home__card-container__overlay"></div>
      <profile-card :user="user" :chat="true" />
    </div>
    <bottom-navigation />
  </div>
</template>

<script>
import BottomNavigation from "@/components/BottomNavigation.vue"
import TopNavigation from "@/components/TopNavigation.vue"
import { Loader } from "@googlemaps/js-api-loader"
import ProfileCard from '@/components/ProfileCard.vue'
import ImageZoomIn from '@/components/ImageZoomIn.vue'
import store from '@/store'
import axios from 'axios'
/* eslint-disable */
export default {
  name: "HomeView",
  components: {
    BottomNavigation,
    TopNavigation,
    ProfileCard,
    ImageZoomIn
  },
  data() {
    return {
      error: false,
      errorMsg: '',
      user: {},
      cardContainer: false
    }
  },
  methods: {
    // Method to show the details of a user on the Map
    // triggered by clicking the marker
    async showUserCard(userId) {
      const res = await axios.get(store.state.serverDomain + 'user/get-user/' + userId, {
        headers: {
          Authorization: `Bearer ${store.state.token}`
        }
      })
      this.user = res.data.user
      this.cardContainer = true
    },
    // Method to Render Map
    async renderMap(latitude, longitude, showMapMarker) {
      try {
        const res = await axios.get(store.state.serverDomain + 'user/location', {
          headers:{
            Authorization: `Bearer ${store.state.token}`
          }
        })
        const loader = new Loader({
          apiKey: "",
          version: "weekly",
          libraries: ["places"],
        });

        loader.load().then(() => {
          const map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: latitude, lng: longitude },
            zoom: 3,
          });
          const locations = res.data.locations
          locations.forEach(location => {
            let coords = location.geolocation
            if(showMapMarker) {
              let marker = new google.maps.Marker({
                position: { lat: coords.latitude, lng: coords.longitude },
                map: map,
              });

              marker.addListener('click', () => {
                this.showUserCard(location.userId)
              })
            }
          });
        })
      } catch (error) {
        if(error.response && error.response.status === 401) {
          this.$router.push('/login')
        } else {
          this.error = true
          this.errorMsg = 'Server Error, try again!'
        }
      }
    }
  },
  mounted() {
    if(!navigator.onLine) {
      this.error = true
      this.errorMsg = 'No internet, check your connection!'
    }

    let latitude = store.state.latitude
    let longitude = store.state.longitude
    let showMapMarker = store.state.showMapMarker

    this.renderMap(latitude, longitude, showMapMarker)
  }
};
</script>

<style lang="scss">
.home {
  height: 100vh;
  width: 100%;
  padding-top: 5rem;
  padding-bottom: 5rem;

  #map {
    height: 100%;
    width: 100%;
  }

  .home__card-container {
    height: 100%;
    width: 100%;
    position: relative;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 90;
    display: flex;
    justify-content: center;
    align-items: center;

    .home__card-container__overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.4);
      z-index: -1;
    }
  }
}
</style>