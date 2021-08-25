<template>
  <div id="app">
    <Navigation />
    <router-view/>
    <Footer />
  </div>
</template>
<script>
  import Navigation from '@/Components/Static/Navigation'
  import Footer from '@/Components/Static/Footer'
  export default {
    name: 'App',
    components: {
      Navigation,
      Footer
    },
    data() {
      return {

      }
    }
  }
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.nav {
  padding: 30px;
  background: #000;
}
</style>
