// Selección de elementos del DOM para los inputs de rango y sus valores asociados
const distanciaInputInicial = document.getElementById("distancia-diaria");
const distanciaValorInicial = document.getElementById("valor-distancia");
const díasInputInicial = document.getElementById("días-semana");
const díasValorInicial = document.getElementById("valor-días");
// Función para actualizar dinámicamente el valor de los inputs de rango
const updateRangeValueInicial = (input, valor) => {
  if (input && valor) {
    input.addEventListener("input", () => {
      valor.textContent = input.value;
    });
  }
};
// Adjuntar los event listeners iniciales
updateRangeValueInicial(distanciaInputInicial, distanciaValorInicial);
updateRangeValueInicial(díasInputInicial, díasValorInicial);
// Selección de elementos principales de la calculadora
const calculatorLeft = document.querySelector(".calculator-left");
const calculatorRight = document.querySelector(".calculator-right");
const initialCalculatorLeftHTML = calculatorLeft.innerHTML;
const navButtonsInitial = document.querySelectorAll(".nav-button");
const sectionsInitial = document.querySelectorAll(".calculator-form");
// Función para manejar la navegación entre secciones
const attachNavButtonListeners = () => {
  const navButtons = document.querySelectorAll(".nav-button");
  const sections = document.querySelectorAll(".calculator-form");
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      navButtons.forEach((btn) => btn.classList.remove("active")); // Desactiva todos los botones
      button.classList.add("active"); // Activa el botón seleccionado
      sections.forEach((section) => (section.style.display = "none")); // Oculta todas las secciones
      const sectionId = button.getAttribute("data-section");
      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        targetSection.style.display = "block"; // Muestra la sección correspondiente
      } else {
        console.error(`No se encontró la sección con el ID: ${sectionId}`);
      }
    });
  });
};
attachNavButtonListeners(); // Adjuntar los listeners iniciales de los botones de navegación
// Estado de finalización de cada sección
const sectionCompletion = {
  transporte: false,
  hogar: false,
  "estilo-vida": false,
};
// Verifica si una sección está completa
const checkSectionCompletion = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    const ranges = section.querySelectorAll('input[type="range"]');
    return Array.from(ranges).every(
      (range) => range.dataset.changed === "true"
    );
  }
  return false;
};
// Verifica si todo el formulario está completo
const isFormComplete = () => {
  return Object.values(sectionCompletion).every((completed) => completed);
};
// Habilita o deshabilita el botón de cálculo según el estado del formulario
const toggleCalculateButton = () => {
  const calculateButton = calculatorLeft.querySelector(".calculate-button");
  if (calculateButton) {
    calculateButton.disabled = !isFormComplete();
    calculateButton.style.opacity = isFormComplete() ? "1" : "0.8";
  }
};
// Actualiza el valor mostrado de un rango
const updateRangeValue = (range) => {
  const span = range.nextElementSibling;
  if (span) {
    span.textContent =
      range.value + (range.id.includes("porcentaje") ? "%" : "");
  }
};
const handleInputChange = (event) => {
  const range = event.target;
  range.dataset.changed = "true";
  const sectionId = range.closest(".calculator-form").id;
  sectionCompletion[sectionId] = checkSectionCompletion(sectionId);
  updateRangeValue(range);
  toggleCalculateButton(); // Actualiza el estado del botón de cálculo
};
// Adjunta listeners a los inputs de rango
const attachRangeListeners = () => {
  calculatorLeft.querySelectorAll("input[type='range']").forEach((input) => {
    input.dataset.changed = "false"; // Marca los rangos como no modificados
    input.removeEventListener("input", handleInputChange); // Elimina listeners previos
    input.addEventListener("input", handleInputChange); // Agrega el listener actual
  });
};
// Reinicia el estado del formulario
const resetFormState = () => {
  Object.keys(sectionCompletion).forEach((key) => {
    sectionCompletion[key] = false;
  });
  calculatorLeft.querySelectorAll('input[type="range"]').forEach((range) => {
    range.dataset.changed = "false";
    range.value = range.min; // Restablece los valores mínimos
    updateRangeValue(range); // Actualiza los valores mostrados
  });
  toggleCalculateButton(); // Deshabilita el botón de cálculo
};
// Adjuntar los listeners iniciales de los rangos y deshabilitar el botón
attachRangeListeners();
toggleCalculateButton();
// Delegación de eventos para el botón "Volver a Calcular" y "Calcular tu Huella"
calculatorLeft.addEventListener("click", (event) => {
  if (event.target.classList.contains("recalculate-button")) {
    // Reinicia el formulario y las recomendaciones
    const firstSectionId = navButtonsInitial[0]?.getAttribute("data-section");
    sectionsInitial.forEach((section) => (section.style.display = "none"));
    if (firstSectionId) {
      const firstSection = document.getElementById(firstSectionId);
      if (firstSection) {
        firstSection.style.display = "block";
      } else {
        console.error(
          `No se encontró la sección inicial con el ID: ${firstSectionId}`
        );
      }
    }
    navButtonsInitial.forEach((btn) => btn.classList.remove("active"));
    if (navButtonsInitial.length > 0) {
      navButtonsInitial[0].classList.add("active");
    }
    calculatorLeft.innerHTML = initialCalculatorLeftHTML;
    attachNavButtonListeners();
    attachRangeListeners();
    resetFormState();
    // Restablecer el contenido de las recomendaciones al volver a calcular
    if (calculatorRight) {
      const tituloRecomendaciones = calculatorRight.querySelector("h3");
      const listaRecomendaciones =
        calculatorRight.querySelector(".advice-list");
      const nivelImpactoSpan = calculatorRight.querySelector("#nivel-impacto");
      if (tituloRecomendaciones)
        tituloRecomendaciones.textContent = "Tu Huella de Carbono";
      if (listaRecomendaciones)
        listaRecomendaciones.innerHTML = `<li class="leading-snug mb-4 relative pl-7">Esperando tu cálculo...</li>
            <li class="leading-snug mb-4 relative pl-7">Esperando tu cálculo...</li>
            <li class="leading-snug mb-4 relative pl-7">Esperando tu cálculo...</li>
            <li class="leading-snug mb-4 relative pl-7">Esperando tu cálculo...</li>
            <li class="leading-snug mb-4 relative pl-7">Esperando tu cálculo...</li>
            <li class="leading-snug mb-4 relative pl-7">Esperando tu cálculo...</li>`;
      if (nivelImpactoSpan) nivelImpactoSpan.textContent = "...";
    }
  } else if (event.target.classList.contains("calculate-button")) {
    // Realiza el cálculo de la huella de carbono y muestra los resultados
    const results = calculateCarbonFootprint();
    showResults(results);
    resetFormState(); // Reiniciar el formulario después del cálculo
    attachRangeListeners(); // Re-inicializar los listeners después del reset
  }
});
// Función para calcular la huella de carbono
const calculateButton = document.querySelector(".calculate-button");
const calculateCarbonFootprint = () => {
  // Obtiene los valores de los inputs y realiza los cálculos
  const tipoVehículo = document.getElementById("tipo-vehículo").value;
  const distanciaDiaria = parseFloat(
    document.getElementById("distancia-diaria").value
  );
  const díasSemana = parseFloat(document.getElementById("días-semana").value);
  let transporteCO2 = 0;
  switch (tipoVehículo) {
    case "Automóvil (Gasolina/Diesel)":
      transporteCO2 = distanciaDiaria * díasSemana * 0.21;
      break;
    case "Automóvil Híbrido":
      transporteCO2 = distanciaDiaria * díasSemana * 0.12;
      break;
    case "Automóvil Eléctrico":
      transporteCO2 = distanciaDiaria * díasSemana * 0.05;
      break;
    case "Motocicleta":
      transporteCO2 = distanciaDiaria * díasSemana * 0.1;
      break;
    case "Transporte Público":
      transporteCO2 = distanciaDiaria * díasSemana * 0.05;
      break;
    case "Bicicleta/A pie":
      transporteCO2 = 0;
      break;
  }
  const electricidad = parseFloat(
    document.getElementById("consumo-electricidad").value
  );
  const gas = parseFloat(document.getElementById("consumo-gas").value);
  const energíaRenovable = parseFloat(
    document.getElementById("energía-renovable").value
  );
  const hogarCO2 =
    electricidad * 0.5 +
    gas * 2.1 -
    (energíaRenovable / 100) * (electricidad * 0.5);
  const carne = parseFloat(document.getElementById("consumo-carne").value);
  const alimentosLocales = parseFloat(
    document.getElementById("alimentos-locales").value
  );
  const reciclaje = parseFloat(document.getElementById("reciclaje").value);
  const estiloVidaCO2 =
    (carne * 0.03 + (100 - alimentosLocales) * 0.02) * (1 - reciclaje / 100);
  const totalCO2 = transporteCO2 + hogarCO2 + estiloVidaCO2;
  return {
    totalCO2: totalCO2.toFixed(2),
    transporteCO2: transporteCO2.toFixed(2),
    hogarCO2: hogarCO2.toFixed(2),
    estiloVidaCO2: estiloVidaCO2.toFixed(2),
  };
};
// Función para mostrar los resultados y recomendaciones
const showResults = (results) => {
  const mediaNacional = 1000;
  const porcentajeComparación = (
    (results.totalCO2 / mediaNacional) *
    100
  ).toFixed(2);
  let nivelHuella = "";
  let recomendacionesListaHTML = "";
  if (porcentajeComparación < 50) {
    nivelHuella = "Bajo";
    recomendacionesListaHTML = `
    <li class="leading-snug mb-4 relative pl-7">Considera mantener tus hábitos de transporte sostenibles, como caminar o usar bicicleta, para seguir reduciendo emisiones.</li>
    <li class="leading-snug mb-4 relative pl-7">Sigue optimizando el consumo de energía en tu hogar, utilizando electrodomésticos eficientes y apagando luces innecesarias.</li>
    <li class="leading-snug mb-4 relative pl-7">Mantén una dieta equilibrada con alimentos locales y orgánicos, lo que también apoya a los productores locales.</li>
    <li class="leading-snug mb-4 relative pl-7">Continúa con tus prácticas de reciclaje y reducción de residuos, separando correctamente los materiales reciclables.</li>
    <li class="leading-snug mb-4 relative pl-7">Explora opciones para reutilizar objetos en lugar de desecharlos, como ropa o muebles.</li>
    <li class="leading-snug mb-4 relative pl-7">Participa en actividades comunitarias relacionadas con la sostenibilidad, como limpiezas de parques o campañas de reforestación.</li>
   `;
  } else if (porcentajeComparación >= 50 && porcentajeComparación <= 100) {
    nivelHuella = "Medio";
    recomendacionesListaHTML = `
    <li class="leading-snug mb-4 relative pl-7">Evalúa opciones para reducir tus viajes en coche o considera alternativas como el transporte público o el uso compartido de vehículos.</li>
    <li class="leading-snug mb-4 relative pl-7">Busca formas de mejorar la eficiencia energética de tu hogar, como instalar paneles solares o mejorar el aislamiento térmico.</li>
    <li class="leading-snug mb-4 relative pl-7">Intenta reducir el consumo de carne y aumentar los productos locales y de temporada en tu dieta diaria.</li>
    <li class="leading-snug mb-4 relative pl-7">Revisa tus hábitos de consumo y busca reducir residuos comprando productos con menos empaques.</li>
    <li class="leading-snug mb-4 relative pl-7">Considera cambiar a bombillas LED y electrodomésticos de bajo consumo para reducir el uso de electricidad.</li>
    <li class="leading-snug mb-4 relative pl-7">Infórmate sobre programas de reciclaje en tu comunidad y participa activamente en ellos.</li>
   `;
  } else {
    nivelHuella = "Alto";
    recomendacionesListaHTML = `
    <li class="leading-snug mb-4 relative pl-7">Analiza tus patrones de transporte y busca alternativas más ecológicas, como vehículos eléctricos o transporte público.</li>
    <li class="leading-snug mb-4 relative pl-7">Realiza mejoras significativas en la eficiencia energética de tu hogar, como cambiar ventanas por modelos más eficientes.</li>
    <li class="leading-snug mb-4 relative pl-7">Reduce considerablemente tu consumo de carne y prioriza dietas basadas en plantas, lo que también beneficia tu salud.</li>
    <li class="leading-snug mb-4 relative pl-7">Adopta prácticas de consumo más conscientes y reduce drásticamente los residuos, evitando productos desechables.</li>
    <li class="leading-snug mb-4 relative pl-7">Considera participar en programas de compensación de carbono para mitigar tus emisiones.</li>
    <li class="leading-snug mb-4 relative pl-7">Educa a tu familia y amigos sobre la importancia de reducir la huella de carbono y cómo pueden contribuir.</li>
   `;
  }
  const nivelImpactoSpanLeft = calculatorLeft.querySelector(
    ".results-container p:nth-child(4) strong"
  );
  if (nivelImpactoSpanLeft) {
    nivelImpactoSpanLeft.textContent = nivelHuella;
  } else {
    calculatorLeft.innerHTML = `
    <div class="results-container text-center text-blanco-puro">
     <h3 class="text-xl md:text-2xl font-semibold text-verde-fuerte">Calcula tu Huella de Carbono</h3>
     <p class="leading-normal mt-3 mb-7 text-xs md:text-base">Basado en tus respuestas, hemos calculado tu impacto ambiental mensual</p>
     <p class="my-3.5"><strong class="text-2xl md:text-4xl">${
       results.totalCO2
     } kg CO₂e/mes</strong></p>
     <p class="mb-3.5 text-xs md:text-base">Impacto: ${nivelHuella}</p>
     <div class="results-details text-left">
      <p class="my-3.5 text-xs md:text-base">Transporte: <span class="ml-2.5">${
        results.transporteCO2
      } kg CO₂e/mes</span></p>
      <div class="progress-bar w-full h-2 bg-blanco-puro rounded-3xl mt-1.5 mx-0 mb-6 overflow-hidden">
       <div class="progress h-full bg-verde rounded-3xl transition" style="width: ${
         (results.transporteCO2 / mediaNacional) * 100
       }%;"></div>
      </div>
      <p class="my-3.5 text-xs md:text-base">Hogar: <span class="ml-2.5">${
        results.hogarCO2
      } kg CO₂e/mes</span></p>
      <div class="progress-bar w-full h-2 bg-blanco-puro rounded-3xl mt-1.5 mx-0 mb-6 overflow-hidden">
       <div class="progress h-full bg-verde rounded-3xl transition" style="width: ${
         (results.hogarCO2 / mediaNacional) * 100
       }%;"></div>
      </div>
      <p class="my-3.5 text-xs md:text-base">Estilo Vida: <span class="ml-2.5">${
        results.estiloVidaCO2
      } kg CO₂e/mes</span></p>
      <div class="progress-bar w-full h-2 bg-blanco-puro rounded-3xl mt-1.5 mx-0 mb-6 overflow-hidden">
       <div class="progress h-full bg-verde rounded-3xl transition" style="width: ${
         (results.estiloVidaCO2 / mediaNacional) * 100
       }%;"></div>
      </div>
     </div>
     <p class="results-msg py-3.5 px-2.5 md:py-5 md:px-3.5 border-2 border-solid border-[#eabd7d] rounded-3xl mb-5 text-xs md:text-base">
      Comparación: Tu huella es aproximadamente el ${porcentajeComparación}% de la media nacional.
     </p>
     <button type="button" class="recalculate-button bg-verde text-blanco-puro border-none rounded-3xl py-3 px-5 cursor-pointer w-3/5 md:w-1/3 hover:bg-blanco-puro hover:text-negro transition-all text-xs md:text-base">Volver a Calcular</button>
    </div>
   `;
  }
  if (calculatorRight) {
    const listaRecomendacionesElement =
      calculatorRight.querySelector(".advice-list");
    const nivelImpactoSpanRight =
      calculatorRight.querySelector("#nivel-impacto");
    const tituloRecomendaciones = calculatorRight.querySelector("h3");
    if (tituloRecomendaciones)
      tituloRecomendaciones.textContent = "Tu Huella de Carbono";
    if (listaRecomendacionesElement)
      listaRecomendacionesElement.innerHTML = recomendacionesListaHTML;
    if (nivelImpactoSpanRight) nivelImpactoSpanRight.textContent = nivelHuella;
  }
};
