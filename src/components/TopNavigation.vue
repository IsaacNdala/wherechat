<template>
    <header  class="top-navigation">
        <router-link class="top-navigation__logo-link main-color" to="/"><i class="fi fi-rr-paper-plane"></i> WhereChat</router-link>
        <button @click="logout" class="top-navigation__logout btn" data-toggle="popover" title="Logout"><i class="fi fi-rr-sign-out d-flex"></i></button>
    </header>
</template>

<script>
import store from '@/store'
export default {
    name: 'TopNavigation',
    methods: {
        logout() {
            store.commit('logout')
            setTimeout(() => {
                this.$router.push('login')
            }, 500)
        }
    }
}
</script>

<style lang="scss">
.top-navigation {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    position: fixed;
    top: 0;
    left: 0;
    padding: 0.5rem 1.5rem .5rem 1rem;
    border-bottom: 1px solid #d0d2d4;
    height: 5rem;
    background-color: white;
    z-index: 100;

    .top-navigation__logo-link {
        font-weight: bold;
        font-size: 1.5rem;
        padding: .5rem;
    }

    button.top-navigation__logout {
        padding: 1rem ;
        background-color: #e4e6ebb7;
        border-radius: 50%;
        display: flex;

        &:focus {
            box-shadow: none;
        }

        &:hover {
            background-color: #c6c9cfb7;
        }
    }
}
</style>