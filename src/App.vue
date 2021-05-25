<template>
  <div id="app">
    <div class="container">
      <Nav></Nav>
      <router-view></router-view>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Nav from './components/Nav';
import Footer from './components/Footer';

export default {
  name: 'App',
  components: {
    Nav,
    Footer
  }
}
</script>

<style>
</style>
