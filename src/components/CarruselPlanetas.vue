<template>
  <section id="carruselHome" class="carousel slide">
    <div class="carousel-inner">

      <div class="carousel-item active">
        <img src="../assets/img/sistemasolar1.png" class="d-block w-100" alt="Sistema solar" />
      </div>

      <div class="carousel-item">
        <img src="../assets/img/sistemasolar2.jpg" class="d-block w-100" alt="Planetas" />
        <div class="carousel-caption d-none d-md-block">
          <h5>¿Sabías que...?</h5>
          <p>Venus es más caliente que Mercurio 🔥</p>
        </div>
      </div>

      <div class="carousel-item">
        <img src="../assets/img/sistemasolar3.jpg" class="d-block w-100" alt="Espacio" />
        <div class="carousel-caption d-none d-md-block">
          <h5>¿Sabías que...?</h5>
          <p>Urano puede ser más frío que Neptuno ❄️</p>
        </div>
      </div>

      
    </div>

    <button class="carousel-control-prev" type="button" data-bs-target="#carruselHome" data-bs-slide="prev">
      <span class="carousel-control-prev-icon"></span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carruselHome" data-bs-slide="next">
      <span class="carousel-control-next-icon"></span>
    </button>
  </section>
</template>

<script>
export default { name: 'CarruselPlanetas' }
</script>
