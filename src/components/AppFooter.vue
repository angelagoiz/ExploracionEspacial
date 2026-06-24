<template>
  <footer class="bg-black text-white pt-5 pb-3 mt-5">
    <div class="container">
      <div class="row">

        <div class="col-md-4 mb-3">
          <h5 class="text-info">🌌 Exploración Espacial</h5>
          <p>Proyecto educativo sobre los planetas del sistema solar y sus temperaturas.</p>
        </div>

        <div class="col-md-4 mb-3">
          <h5 class="text-info">🔗 Enlaces útiles</h5>
          <ul class="list-unstyled">
            <li><router-link to="/" class="text-white text-decoration-none">Inicio</router-link></li>
            <li><a href="https://science.nasa.gov/" class="text-white text-decoration-none" target="_blank">NASA</a></li>
            <li><a href="https://www.esa.int/" class="text-white text-decoration-none" target="_blank">ESA</a></li>
            <li><a href="https://www.nationalgeographic.com/" class="text-white text-decoration-none" target="_blank">National Geographic</a></li>
          </ul>
        </div>

        <div class="col-md-4 mb-3 text-center">
          <h5 class="text-info">📡 Sígueme</h5>
          <div class="d-flex justify-content-center gap-3 fs-4">
            <a href="#" class="text-white">🌐</a>
            <a href="#" class="text-white">📸</a>
            <a href="#" class="text-white">🐦</a>
          </div>
          <p class="mt-3">Contacto: contacto@espacio.com</p>
        </div>

      </div>
      <hr class="border-secondary" />
      <div class="text-center">
        <p class="mb-0">© 2026 Exploración Espacial | Clima Front-End 🚀</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default { name: 'AppFooter' }
</script>
