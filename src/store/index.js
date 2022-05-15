import { createStore } from 'vuex'
const userInStorage = JSON.parse(localStorage.getItem('user'))
const geolocationInStorage = JSON.parse(localStorage.getItem('geolocation'))

const latitude = geolocationInStorage ? geolocationInStorage.latitude : -8.92928
const longitude = geolocationInStorage ? geolocationInStorage.longitude : 13.3595136
const showMapMarker = geolocationInStorage ? geolocationInStorage.showMapMarker : false
const user = userInStorage ? userInStorage : null
const token = userInStorage ? userInStorage.token : null

export default createStore({
  state: {
    latitude: latitude,
    longitude: longitude,
    showMapMarker: showMapMarker,
    serverDomain: 'http://localhost:3000/',
    user: user,
    token: token,
    showEdit: true,
    showEditPassword: true,
    showDeleteAccount: true,
    toggleImageZoomIn: false
  },
  getters: {
  },
  mutations: {
    setCoords(state, coords) {
      state.latitude = coords.latitude
      state.longitude = coords.longitude
      state.showMapMarker = true
      const geolocation = {
        latitude: state.latitude,
        longitude: state.longitude,
        showMapMarker: state.showMapMarker
      }
      localStorage.setItem('geolocation', JSON.stringify(geolocation))
    },
    disableCoords() {
      localStorage.removeItem('geolocation')
    },
    setUser(state, user) {
      state.user = user
    },
    setToken(state, token) {
      state.token = token
    },
    logout() {
      localStorage.removeItem('user')
      localStorage.removeItem('geolocation')
    },
    openEdit(state) {
      state.showEdit = false
    },
    openEditPassword(state) {
      state.showEditPassword = false
    },
    openDel(state) {
      state.showDeleteAccount = false
    },
    closeEdit(state) {
      state.showEdit = true
    },
    closeEditPassword(state) {
      state.showEditPassword = true
    },
    closeDel(state) {
      state.showDeleteAccount = true
    },
    showImageZoomIn: state => {
      state.toggleImageZoomIn = true
    },
    closeImageZoomIn: state => {
      state.toggleImageZoomIn = false
    }
  },
  actions: {
  },
  modules: {
  }
})