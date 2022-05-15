<template>
  <div
    class="image-zoom-in"
    :class="{ 'show-image-zoom-in': toggleImageZoomIn }"
  >
    <div class="image-zoom-in__overlay" @click="closeImageZoomIn"></div>
    <button class="image-zoom-in__close-btn" @click="closeImageZoomIn">
      <i class="fi fi-rr-cross d-flex"></i>
    </button>
    <img :src="serverDomain + imageUrl" alt="user" />
  </div>
</template>

<script>
export default {
  name: "ImageZoomIn",
  props: ['imageUrl'],
  data() {
    return {
    };
  },
  computed: {
    toggleImageZoomIn() {
      return this.$store.state.toggleImageZoomIn;
    },
    serverDomain() {
      return this.$store.state.serverDomain
    }
  },
  methods: {
    closeImageZoomIn() {
      this.$store.commit("closeImageZoomIn")
      document.querySelector("body").style.overflow = "auto"
    },
  },
};
</script>

<style lang="scss">
.image-zoom-in {
  position: absolute;
  width: 100%;
  overflow: auto;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 200;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  visibility: hidden;
  transition: 0.3s ease-in;

  .image-zoom-in__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    cursor: zoom-out;
  }

  .image-zoom-in__close-btn {
    background-color: transparent;
    border: none;
    position: absolute;
    top: 0.7rem;
    right: 0.7rem;
    padding: 1rem;
    color: white;
    font-weight: bold;
    z-index: 20;
  }

  img {
    z-index: 20;
    max-width: 90%;
  }

  @media(min-width: 450px) {
    img {
      max-width: 25rem;
    }
  }
}

.show-image-zoom-in {
  opacity: 1;
  visibility: visible;
}
</style>