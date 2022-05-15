<template>
  <nav class="bottom-navigation">
    <li>
      <router-link active-class="active" to="/"
        ><i class="fi fi-rr-home"></i
      ></router-link>
    </li>
    <li>
      <router-link active-class="active" to="/messages"><i class="fi fi-rr-comment-alt"></i></router-link>
    </li>
    <li>
      <router-link active-class="active" to="/profile"><i class="fi fi-rr-user"></i></router-link>
    </li>
    <li>
      <router-link active-class="active" to="/search"><i class="fi fi-rr-search"></i></router-link>
    </li>
  </nav>
</template>

<script>
export default {
  name: "BottomNavigation",
  data() {
    return {};
  },
};
</script>

<style lang="scss">
.bottom-navigation {
  display: inline-grid;
  grid-template-columns: auto auto auto auto;
  width: 100%;
  height: 5rem;
  position: absolute;
  position: fixed;
  bottom: 0;
  left: 0;
  border-top: 1px solid #d0d2d4;
  background-color: white;
  z-index: 100;

  li {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    a {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.5rem;
      height: 100%;
      width: 100%;
      color:rgba(0, 0, 0, .80);
      border-bottom: 3px solid white;

      &.active {
          border-bottom: 3px solid #006aff;
          color: #006aff;
      }

      &:hover {
        background-color: #e4e6ebb7;
      }

      i {
        display: flex;
      }
    }
  }
}

@media (min-width: 576px) {
  .bottom-navigation {
    display: flex;
    justify-content: center;

    li {
      margin-right: 2rem;

      a {
        padding: 2rem;
      }
    }
  }
}
</style>