<template>
  <div class="profile">
    <top-navigation />
    <image-zoom-in :imageUrl="user.imageUrl" />
    <profile-card :user="user" :profile="true"/>
    <edit-profile-card :user="user"/>
    <edit-password :user="user"/>
    <delete-card :user="user"/>
    <bottom-navigation />
  </div>
</template> 

<script>
import BottomNavigation from "@/components/BottomNavigation.vue"
import TopNavigation from "@/components/TopNavigation.vue"
import ImageZoomIn from "@/components/ImageZoomIn.vue"
import ProfileCard from '@/components/ProfileCard.vue'
import EditProfileCard from '@/components/EditProfileCard.vue'
import EditPassword from '@/components/EditPassword.vue'
import DeleteCard from '@/components/DeleteCard.vue'
import store from '@/store'

export default {
  name: "ProfileView",
  components: {
    BottomNavigation,
    TopNavigation,
    ImageZoomIn,
    ProfileCard,
    EditProfileCard,
    EditPassword,
    DeleteCard
  },
  computed: {
    user() {
      return store.state.user
    }
  }
};
</script>

<style lang="scss">
.profile {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
