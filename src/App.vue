<template>
  <div id="app" class="container">
    <Nav></Nav>
    <router-view></router-view>
    <!-- <div class="row mt-5">
      <div class="col">
        <h2 class="text-center">Prueba de gráfica de barras</h2>
        <bar-chart></bar-chart>
      </div>
    </div> -->
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
