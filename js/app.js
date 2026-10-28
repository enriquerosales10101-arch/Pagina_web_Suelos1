// ===================================================================
// GEOLAB - SISTEMA GEOTÉCNICO DE LABORATORIO 1
// Lógica de cálculo y emisión de informes según normas ASTM D2216 / D7263 / D854 y NTP 339
// ===================================================================

// Tabla ASTM D854 de Densidad del Agua (g/mL) y Coeficiente de Corrección K
const WATER_DENSITY_TABLE = [
  { t: 15.0, rho: 0.99911, k: 1.00090 },
  { t: 15.1, rho: 0.99909, k: 1.00088 },
  { t: 15.2, rho: 0.99907, k: 1.00086 },
  { t: 15.3, rho: 0.99906, k: 1.00085 },
  { t: 15.4, rho: 0.99904, k: 1.00083 },
  { t: 15.5, rho: 0.99903, k: 1.00082 },
  { t: 15.6, rho: 0.99901, k: 1.00080 },
  { t: 15.7, rho: 0.99899, k: 1.00078 },
  { t: 15.8, rho: 0.99898, k: 1.00077 },
  { t: 15.9, rho: 0.99896, k: 1.00075 },
  { t: 16.0, rho: 0.99894, k: 1.00073 },
  { t: 16.1, rho: 0.99893, k: 1.00072 },
  { t: 16.2, rho: 0.99891, k: 1.00070 },
  { t: 16.3, rho: 0.99889, k: 1.00068 },
  { t: 16.4, rho: 0.99888, k: 1.00067 },
  { t: 16.5, rho: 0.99886, k: 1.00065 },
  { t: 16.6, rho: 0.99884, k: 1.00063 },
  { t: 16.7, rho: 0.99883, k: 1.00062 },
  { t: 16.8, rho: 0.99881, k: 1.00060 },
  { t: 16.9, rho: 0.99879, k: 1.00058 },
  { t: 17.0, rho: 0.99877, k: 1.00056 },
  { t: 17.1, rho: 0.99876, k: 1.00055 },
  { t: 17.2, rho: 0.99874, k: 1.00053 },
  { t: 17.3, rho: 0.99872, k: 1.00051 },
  { t: 17.4, rho: 0.99870, k: 1.00049 },
  { t: 17.5, rho: 0.99868, k: 1.00047 },
  { t: 17.6, rho: 0.99867, k: 1.00046 },
  { t: 17.7, rho: 0.99865, k: 1.00044 },
  { t: 17.8, rho: 0.99863, k: 1.00042 },
  { t: 17.9, rho: 0.99861, k: 1.00040 },
  { t: 18.0, rho: 0.99859, k: 1.00038 },
  { t: 18.1, rho: 0.99857, k: 1.00036 },
  { t: 18.2, rho: 0.99855, k: 1.00034 },
  { t: 18.3, rho: 0.99854, k: 1.00033 },
  { t: 18.4, rho: 0.99852, k: 1.00031 },
  { t: 18.5, rho: 0.99850, k: 1.00029 },
  { t: 18.6, rho: 0.99848, k: 1.00027 },
  { t: 18.7, rho: 0.99846, k: 1.00025 },
  { t: 18.8, rho: 0.99844, k: 1.00023 },
  { t: 18.9, rho: 0.99842, k: 1.00021 },
  { t: 19.0, rho: 0.99840, k: 1.00019 },
  { t: 19.1, rho: 0.99838, k: 1.00017 },
  { t: 19.2, rho: 0.99836, k: 1.00015 },
  { t: 19.3, rho: 0.99834, k: 1.00013 },
  { t: 19.4, rho: 0.99832, k: 1.00011 },
  { t: 19.5, rho: 0.99830, k: 1.00009 },
  { t: 19.6, rho: 0.99828, k: 1.00007 },
  { t: 19.7, rho: 0.99826, k: 1.00005 },
  { t: 19.8, rho: 0.99824, k: 1.00003 },
  { t: 19.9, rho: 0.99822, k: 1.00001 },
  { t: 20.0, rho: 0.99820, k: 0.99999 },
  { t: 20.1, rho: 0.99818, k: 0.99997 },
  { t: 20.2, rho: 0.99816, k: 0.99995 },
  { t: 20.3, rho: 0.99814, k: 0.99993 },
  { t: 20.4, rho: 0.99812, k: 0.99991 },
  { t: 20.5, rho: 0.99810, k: 0.99989 },
  { t: 20.6, rho: 0.99807, k: 0.99986 },
  { t: 20.7, rho: 0.99805, k: 0.99984 },
  { t: 20.8, rho: 0.99803, k: 0.99982 },
  { t: 20.9, rho: 0.99801, k: 0.99980 },
  { t: 21.0, rho: 0.99799, k: 0.99978 },
  { t: 21.1, rho: 0.99797, k: 0.99976 },
  { t: 21.2, rho: 0.99795, k: 0.99974 },
  { t: 21.3, rho: 0.99792, k: 0.99971 },
  { t: 21.4, rho: 0.99790, k: 0.99969 },
  { t: 21.5, rho: 0.99788, k: 0.99967 },
  { t: 21.6, rho: 0.99786, k: 0.99965 },
  { t: 21.7, rho: 0.99784, k: 0.99963 },
  { t: 21.8, rho: 0.99781, k: 0.99960 },
  { t: 21.9, rho: 0.99779, k: 0.99958 },
  { t: 22.0, rho: 0.99777, k: 0.99956 },
  { t: 22.1, rho: 0.99775, k: 0.99954 },
  { t: 22.2, rho: 0.99772, k: 0.99951 },
  { t: 22.3, rho: 0.99770, k: 0.99949 },
  { t: 22.4, rho: 0.99768, k: 0.99947 },
  { t: 22.5, rho: 0.99765, k: 0.99944 },
  { t: 22.6, rho: 0.99763, k: 0.99942 },
  { t: 22.7, rho: 0.99761, k: 0.99940 },
  { t: 22.8, rho: 0.99759, k: 0.99938 },
  { t: 22.9, rho: 0.99756, k: 0.99935 },
  { t: 23.0, rho: 0.99754, k: 0.99933 },
  { t: 23.1, rho: 0.99751, k: 0.99930 },
  { t: 23.2, rho: 0.99749, k: 0.99928 },
  { t: 23.3, rho: 0.99747, k: 0.99926 },
  { t: 23.4, rho: 0.99744, k: 0.99923 },
  { t: 23.5, rho: 0.99742, k: 0.99921 },
  { t: 23.6, rho: 0.99740, k: 0.99919 },
  { t: 23.7, rho: 0.99737, k: 0.99916 },
  { t: 23.8, rho: 0.99735, k: 0.99914 },
  { t: 23.9, rho: 0.99732, k: 0.99911 },
  { t: 24.0, rho: 0.99730, k: 0.99909 },
  { t: 24.1, rho: 0.99727, k: 0.99906 },
  { t: 24.2, rho: 0.99725, k: 0.99904 },
  { t: 24.3, rho: 0.99722, k: 0.99901 },
  { t: 24.4, rho: 0.99720, k: 0.99899 },
  { t: 24.5, rho: 0.99717, k: 0.99896 },
  { t: 24.6, rho: 0.99715, k: 0.99894 },
  { t: 24.7, rho: 0.99712, k: 0.99891 },
  { t: 24.8, rho: 0.99710, k: 0.99889 },
  { t: 24.9, rho: 0.99707, k: 0.99886 },
  { t: 25.0, rho: 0.99705, k: 0.99884 },
  { t: 25.1, rho: 0.99702, k: 0.99881 },
  { t: 25.2, rho: 0.99700, k: 0.99879 },
  { t: 25.3, rho: 0.99697, k: 0.99876 },
  { t: 25.4, rho: 0.99694, k: 0.99873 },
  { t: 25.5, rho: 0.99692, k: 0.99871 },
  { t: 25.6, rho: 0.99689, k: 0.99868 },
  { t: 25.7, rho: 0.99687, k: 0.99866 },
  { t: 25.8, rho: 0.99684, k: 0.99863 },
  { t: 25.9, rho: 0.99681, k: 0.99860 },
  { t: 26.0, rho: 0.99679, k: 0.99858 },
  { t: 26.1, rho: 0.99676, k: 0.99855 },
  { t: 26.2, rho: 0.99673, k: 0.99852 },
  { t: 26.3, rho: 0.99671, k: 0.99850 },
  { t: 26.4, rho: 0.99668, k: 0.99847 },
  { t: 26.5, rho: 0.99665, k: 0.99844 },
  { t: 26.6, rho: 0.99663, k: 0.99842 },
  { t: 26.7, rho: 0.99660, k: 0.99839 },
  { t: 26.8, rho: 0.99657, k: 0.99836 },
  { t: 26.9, rho: 0.99654, k: 0.99833 },
  { t: 27.0, rho: 0.99652, k: 0.99831 },
  { t: 27.1, rho: 0.99649, k: 0.99828 },
  { t: 27.2, rho: 0.99646, k: 0.99825 },
  { t: 27.3, rho: 0.99643, k: 0.99822 },
  { t: 27.4, rho: 0.99641, k: 0.99820 },
  { t: 27.5, rho: 0.99638, k: 0.99817 },
  { t: 27.6, rho: 0.99635, k: 0.99814 },
  { t: 27.7, rho: 0.99632, k: 0.99811 },
  { t: 27.8, rho: 0.99629, k: 0.99808 },
  { t: 27.9, rho: 0.99627, k: 0.99806 },
  { t: 28.0, rho: 0.99624, k: 0.99803 },
  { t: 28.1, rho: 0.99621, k: 0.99800 },
  { t: 28.2, rho: 0.99618, k: 0.99797 },
  { t: 28.3, rho: 0.99615, k: 0.99794 },
  { t: 28.4, rho: 0.99612, k: 0.99791 },
  { t: 28.5, rho: 0.99610, k: 0.99789 },
  { t: 28.6, rho: 0.99607, k: 0.99786 },
  { t: 28.7, rho: 0.99604, k: 0.99783 },
  { t: 28.8, rho: 0.99601, k: 0.99780 },
  { t: 28.9, rho: 0.99598, k: 0.99777 },
  { t: 29.0, rho: 0.99595, k: 0.99773 },
  { t: 29.1, rho: 0.99592, k: 0.99770 },
  { t: 29.2, rho: 0.99589, k: 0.99767 },
  { t: 29.3, rho: 0.99586, k: 0.99764 },
  { t: 29.4, rho: 0.99583, k: 0.99761 },
  { t: 29.5, rho: 0.99580, k: 0.99758 },
  { t: 29.6, rho: 0.99577, k: 0.99755 },
  { t: 29.7, rho: 0.99574, k: 0.99752 },
  { t: 29.8, rho: 0.99571, k: 0.99749 },
  { t: 29.9, rho: 0.99568, k: 0.99746 },
  { t: 30.0, rho: 0.99565, k: 0.99743 }
];

function getWaterProperties(temp) {
  // Si el usuario ingresa 210, 236 en lugar de 21.0, 23.6, lo corregimos
  let t = temp;
  if (t >= 100 && t <= 500) {
    t = t / 10.0;
  }

  t = Math.min(Math.max(t, 0.0), 50.0);
  const roundedT = Math.round(t * 10) / 10;

  // Buscar en tabla primero (rango 15 a 30 es exacto según ASTM D854)
  const match = WATER_DENSITY_TABLE.find(item => Math.abs(item.t - roundedT) < 0.001);
  if (match) {
    return { rho: match.rho, rho_w: match.rho, k: match.k };
  }

  // Interpolación o extrapolación si está fuera de la tabla
  // Fórmula aproximada de densidad del agua:
  const rho = 1 - Math.pow(t - 3.98, 2) * (t + 283) / (503570 * (t + 67.26));
  const k = rho / 0.99820; // referenciado a 20°C

  return { rho, rho_w: rho, k };
}

// SERIE OFICIAL DE TAMICES ASTM E11 / ASTM D6913 (UNI FIC LMS)
const ASTM_SIEVES = [
  { id: '3in', nombre: '3"', abertura: 75.000, desc: '75.0 mm' },
  { id: '2in', nombre: '2"', abertura: 50.000, desc: '50.0 mm' },
  { id: '1_5in', nombre: '1 1/2"', abertura: 37.500, desc: '37.5 mm' },
  { id: '1in', nombre: '1"', abertura: 25.000, desc: '25.0 mm' },
  { id: '3_4in', nombre: '3/4"', abertura: 19.000, desc: '19.0 mm' },
  { id: '1_2in', nombre: '1/2"', abertura: 12.500, desc: '12.5 mm' },
  { id: '3_8in', nombre: '3/8"', abertura: 9.500, desc: '9.5 mm' },
  { id: '1_4in', nombre: '1/4"', abertura: 6.300, desc: '6.30 mm' },
  { id: 'n4', nombre: 'N° 4', abertura: 4.750, desc: '4.75 mm' },
  { id: 'n10', nombre: 'N° 10', abertura: 2.000, desc: '2.00 mm' },
  { id: 'n20', nombre: 'N° 20', abertura: 0.850, desc: '850 µm' },
  { id: 'n30', nombre: 'N° 30', abertura: 0.600, desc: '600 µm' },
  { id: 'n40', nombre: 'N° 40', abertura: 0.425, desc: '425 µm' },
  { id: 'n60', nombre: 'N° 60', abertura: 0.250, desc: '250 µm' },
  { id: 'n100', nombre: 'N° 100', abertura: 0.150, desc: '150 µm' },
  { id: 'n140', nombre: 'N° 140', abertura: 0.106, desc: '106 µm' },
  { id: 'n200', nombre: 'N° 200', abertura: 0.075, desc: '75 µm' },
  { id: 'pan', nombre: 'Platillo / Fondo', abertura: 0.000, desc: 'Fondo' },
  { id: 'mmo', nombre: 'M - Mo (Lavado)', abertura: 0.000, desc: 'Finos perdidos por lavado' }
];

// ESTADO GLOBAL DE LA APLICACIÓN
const GeoState = {
  proyecto: {
    nombre: "Carretera Central Km 45",
    muestra: "M-01",
    procedencia: "Calicata C-01 (1.50 m)",
    material: "Arcilla limosa marrón de media plasticidad",
    ensayado: "Ing. Laboratorista",
    fecha: new Date().toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" })
  },
  ensayos: {
    humedad: {
      calculado: false,
      temp: 110.0,
      tiempo: 24.0,
      determinaciones: [],
      promedio: null,
      observaciones: ""
    },
    volumetrico: {
      calculado: false,
      metodo: "parafina", // "parafina" (NTP 339.139) o "cilindro" (ASTM D7263)
      rho_parafina: 0.87,
      pruebas: [],
      humedad: null,
      rho_humeda: null,
      rho_kg_m3: null,
      gamma_kn_m3: null,
      gamma_gf_cm3: null,
      rho_seca: null,
      rho_seca_kg_m3: null,
      gamma_seca: null,
      observaciones: ""
    },
    gravedad: {
      calculado: false,
      temp: 16.5,
      rho_w: 0.99886,
      k: 1.00065,
      pruebas: [],
      gs: null, // Gs a 20°C promedio
      gt: null, // Gt a T° promedio
      observaciones: ""
    },
    granulometria: {
      calculado: false,
      metodo: "simple", // "simple" (Anexo II) o "compuesto" (Anexo I)
      masa_total: 2900.0, // W1
      masa_lavada: 2708.0, // W0
      perdida_lavado: 192.0, // W1 - W0
      porc_perdida_lavado: 6.62,
      tamices: [],
      suma_retenido: 0,
      error_gramos: 0,
      porc_error: 0,
      grava: null,
      arena: null,
      finos: null,
      d10: null,
      d30: null,
      d60: null,
      d85: null,
      cu: null,
      cc: null,
      sucs_simbolo: "",
      sucs_descripcion: "",
      observaciones: ""
    },
    atterberg: {
      calculado: false,
      np: false,
      ll: null,
      lp: null,
      ip: null,
      lc: null,
      ll_pts: [],
      lp_pts: [],
      m: null,
      b: null,
      r2: null,
      clase: null,
      observaciones: ""
    },
    proctor: {
      calculado: false,
      vol: null,
      peso_molde: null,
      gs: null,
      puntos: [],
      a: null,
      b: null,
      c: null,
      r2: null,
      och: null,
      mds: null,
      mds95: null,
      opt_dentro: true,
      observaciones: ""
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initThemeToggle();
  initProjectMetaModal();
  initHumedadEvents();
  initVolumetricoEvents();
  initGravedadEvents();
  initGranulometriaEvents();
  initAtterbergEvents();
  initProctorEvents();
  initDashboardEvents();
  initDashboardLab2Events();
  updateStripUI();
  updateDashboardPills();
  updateDashboardLab2Summary();
  updateDashboardAtterbergSummary();
  updateDashboardProctorSummary();
});

// 1. NAVEGACIÓN Y PESTAÑAS (panel principal ⇄ opciones)
function initNavigation() {
  const views = document.querySelectorAll(".view");
  const mainNav = document.getElementById("main-nav"); // contenedor del botón "Panel Principal"

  function switchView(targetId) {
    views.forEach(v => v.classList.remove("active"));
    const activeView = document.getElementById(targetId);
    if (activeView) activeView.classList.add("active");

    // El botón "Panel Principal" solo aparece dentro de una opción
    if (mainNav) mainNav.classList.toggle("hidden", targetId === "view-dashboard");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Botón "Panel Principal" (vuelve al panel)
  const btnHome = document.getElementById("btn-nav-home");
  if (btnHome) btnHome.addEventListener("click", () => switchView("view-dashboard"));

  // Marca / logo → panel
  document.getElementById("nav-brand-btn").addEventListener("click", () => switchView("view-dashboard"));

  // Tarjetas del panel → abren su opción
  document.getElementById("btn-goto-humedad").addEventListener("click", () => switchView("view-humedad"));
  document.getElementById("btn-goto-volumetrico").addEventListener("click", () => switchView("view-volumetrico"));
  document.getElementById("btn-goto-gravedad").addEventListener("click", () => switchView("view-gravedad"));
  const btnGotoGranu = document.getElementById("btn-goto-granulometria");
  if (btnGotoGranu) btnGotoGranu.addEventListener("click", () => switchView("view-granulometria"));
  const btnGotoAtt = document.getElementById("btn-goto-atterberg");
  if (btnGotoAtt) btnGotoAtt.addEventListener("click", () => switchView("view-atterberg"));
  const btnGotoPro = document.getElementById("btn-goto-proctor");
  if (btnGotoPro) btnGotoPro.addEventListener("click", () => switchView("view-proctor"));

  // Botones "Volver al Panel" dentro de cada opción
  document.querySelectorAll(".btn-back-dashboard").forEach(btn => {
    btn.addEventListener("click", () => switchView("view-dashboard"));
  });
}

// 2. CONTROL DE TEMA (CLARO / OSCURO)
function initThemeToggle() {
  const toggleBtn = document.getElementById("btn-toggle-theme");
  const icon = toggleBtn.querySelector(".theme-icon");

  toggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    if (currentTheme === "dark") {
      document.documentElement.removeAttribute("data-theme");
      icon.textContent = "🌙";
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      icon.textContent = "☀️";
    }
  });
}

// 3. METADATOS DEL PROYECTO Y MODAL
function initProjectMetaModal() {
  const modal = document.getElementById("modal-project");
  const btnOpen = document.getElementById("btn-open-meta-modal");
  const btnEditStrip = document.getElementById("btn-edit-strip");
  const btnClose = document.getElementById("btn-close-modal");
  const btnCancel = document.getElementById("btn-cancel-modal");
  const btnSave = document.getElementById("btn-save-modal");

  function openModal() {
    document.getElementById("meta-proyecto").value = GeoState.proyecto.nombre;
    document.getElementById("meta-muestra").value = GeoState.proyecto.muestra;
    document.getElementById("meta-procedencia").value = GeoState.proyecto.procedencia;
    document.getElementById("meta-material").value = GeoState.proyecto.material;
    document.getElementById("meta-ensayado").value = GeoState.proyecto.ensayado;
    modal.classList.remove("hidden");
  }

  function closeModal() {
    modal.classList.add("hidden");
  }

  btnOpen.addEventListener("click", openModal);
  btnEditStrip.addEventListener("click", openModal);
  btnClose.addEventListener("click", closeModal);
  btnCancel.addEventListener("click", closeModal);

  btnSave.addEventListener("click", () => {
    GeoState.proyecto.nombre = document.getElementById("meta-proyecto").value.trim() || "Proyecto sin título";
    GeoState.proyecto.muestra = document.getElementById("meta-muestra").value.trim() || "M-01";
    GeoState.proyecto.procedencia = document.getElementById("meta-procedencia").value.trim() || "—";
    GeoState.proyecto.material = document.getElementById("meta-material").value.trim() || "—";
    GeoState.proyecto.ensayado = document.getElementById("meta-ensayado").value.trim() || "—";

    updateStripUI();
    closeModal();
    showToast("Datos del proyecto actualizados y sincronizados.");
  });
}

function updateStripUI() {
  document.getElementById("strip-val-proyecto").textContent = GeoState.proyecto.nombre;
  document.getElementById("strip-val-muestra").textContent = GeoState.proyecto.muestra;
  document.getElementById("strip-val-procedencia").textContent = GeoState.proyecto.procedencia;
  document.getElementById("strip-val-material").textContent = GeoState.proyecto.material;
  document.getElementById("strip-val-ensayado").textContent = GeoState.proyecto.ensayado;
}

// ===================================================================
// 4. LÓGICA DE ENSAYO 01: CONTENIDO DE HUMEDAD (ASTM D2216 / NTP 339.127)
// ===================================================================
function initHumedadEvents() {
  const humCantSelect = document.getElementById("hum-cant");
  if (humCantSelect) {
    humCantSelect.addEventListener("change", renderHumedadTable);
    renderHumedadTable(); // Initial render
  }

  document.getElementById("btn-calcular-humedad").addEventListener("click", calcularHumedad);
  document.getElementById("btn-limpiar-humedad").addEventListener("click", limpiarHumedad);
  document.getElementById("btn-fill-demo-humedad").addEventListener("click", cargarDemoHumedad);

  document.getElementById("btn-exportar-pdf-humedad").addEventListener("click", () => {
    if (!GeoState.ensayos.humedad.calculado) {
      alert("Para exportar el informe en PDF, primero ingrese los datos y presione '⚡ Calcular'.");
      return;
    }
    generarPDFIndividual("humedad");
  });
}

function renderHumedadTable() {
  const select = document.getElementById("hum-cant");
  const cant = parseInt(select.value) || 3;
  const tbody = document.getElementById("tbody-humedad-inputs");
  if (!tbody) return;

  let html = "";
  for (let i = 1; i <= cant; i++) {
    html += `
      <tr>
        <td class="text-center font-bold text-accent">${i}</td>
        <td><input type="text" class="input-control text-center" id="hum-id-${i}" value="C-${i}" placeholder="ID"></td>
        <td><input type="number" step="0.01" class="input-control font-mono" id="hum-mr-${i}" placeholder="Ej. 25.40"></td>
        <td><input type="number" step="0.01" class="input-control font-mono" id="hum-mh-${i}" placeholder="Ej. 105.40"></td>
        <td><input type="number" step="0.01" class="input-control font-mono" id="hum-ms-${i}" placeholder="Ej. 92.80"></td>
      </tr>
    `;
  }
  tbody.innerHTML = html;
}

function calcularHumedad() {
  try {
    const determinaciones = [];
    const cant = parseInt(document.getElementById("hum-cant").value) || 3;

    for (let i = 1; i <= cant; i++) {
      const id = document.getElementById(`hum-id-${i}`).value.trim();
      const mrVal = document.getElementById(`hum-mr-${i}`).value.trim();
      const mhVal = document.getElementById(`hum-mh-${i}`).value.trim();
      const msVal = document.getElementById(`hum-ms-${i}`).value.trim();

      if (!mrVal && !mhVal && !msVal) continue;

      if (!mrVal || !mhVal || !msVal) {
        throw new Error(`En la fila ${i}, complete las 3 masas (Cápsula, Cáp.+Húmedo, Cáp.+Seco) o déjela vacía.`);
      }

      const mr = parseFloat(mrVal);
      const mh = parseFloat(mhVal);
      const ms = parseFloat(msVal);

      if (isNaN(mr) || isNaN(mh) || isNaN(ms)) {
        throw new Error(`Las masas en la fila ${i} deben ser números válidos.`);
      }
      if (mr < 0 || mh < 0 || ms < 0) {
        throw new Error(`Las masas en la fila ${i} no pueden ser negativas.`);
      }
      if (mh <= mr) {
        throw new Error(`En la fila ${i}, la masa de suelo húmedo + cápsula (M1) debe ser mayor a la masa de la cápsula (Mt).`);
      }
      if (ms <= mr) {
        throw new Error(`En la fila ${i}, la masa de suelo seco + cápsula (M2) debe ser mayor a la masa de la cápsula (Mt).`);
      }
      if (mh < ms) {
        throw new Error(`En la fila ${i}, la masa húmeda (${mh}g) no puede ser menor a la masa seca (${ms}g).`);
      }

      const mw = mh - ms;
      const mss = ms - mr;
      const w = (mw / mss) * 100.0;

      determinaciones.push({
        num: i,
        id: id || `C-${i}`,
        mr,
        mh,
        ms,
        mw,
        mss,
        w
      });
    }

    if (determinaciones.length === 0) {
      throw new Error("Ingrese al menos una determinación de contenido de humedad para calcular.");
    }

    const temp = parseFloat(document.getElementById("hum-temp").value) || 110.0;
    const tiempo = parseFloat(document.getElementById("hum-tiempo").value) || 24.0;
    const obs = document.getElementById("hum-obs").value.trim();

    const sumW = determinaciones.reduce((acc, d) => acc + d.w, 0);
    const promedio = sumW / determinaciones.length;

    GeoState.ensayos.humedad = {
      calculado: true,
      temp,
      tiempo,
      determinaciones,
      promedio,
      observaciones: obs
    };

    renderResultadosHumedad();
    updateDashboardSummary();
    showToast("Cálculo de contenido de humedad completado con éxito.");

  } catch (err) {
    alert("Error en los datos de humedad:\n" + err.message);
  }
}

function renderResultadosHumedad() {
  const h = GeoState.ensayos.humedad;
  if (!h.calculado) return;

  document.getElementById("hum-results-placeholder").classList.add("hidden");
  document.getElementById("hum-results-content").classList.remove("hidden");

  document.getElementById("hum-res-promedio").textContent = `${h.promedio.toFixed(2)} %`;
  document.getElementById("hum-res-ndeterminaciones").textContent = `Basado en ${h.determinaciones.length} determinación(es) • Horno a ${h.temp.toFixed(1)} °C (${h.tiempo.toFixed(1)} h)`;

  const tbody = document.getElementById("tbody-hum-breakdown");
  tbody.innerHTML = "";

  h.determinaciones.forEach(d => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="text-center font-bold text-accent">${d.num}</td>
      <td class="text-center font-bold">${d.id}</td>
      <td class="font-mono text-right">${d.mw.toFixed(2)}</td>
      <td class="font-mono text-right">${d.mss.toFixed(2)}</td>
      <td class="font-mono text-right font-bold text-primary">${d.w.toFixed(2)} %</td>
    `;
    tbody.appendChild(tr);
  });
}

function limpiarHumedad() {
  const cant = parseInt(document.getElementById("hum-cant").value) || 3;
  for (let i = 1; i <= cant; i++) {
    document.getElementById(`hum-mr-${i}`).value = "";
    document.getElementById(`hum-mh-${i}`).value = "";
    document.getElementById(`hum-ms-${i}`).value = "";
  }
  document.getElementById("hum-obs").value = "";
  GeoState.ensayos.humedad.calculado = false;
  GeoState.ensayos.humedad.determinaciones = [];
  GeoState.ensayos.humedad.promedio = null;

  document.getElementById("hum-results-content").classList.add("hidden");
  document.getElementById("hum-results-placeholder").classList.remove("hidden");
  updateDashboardSummary();
  showToast("Datos de humedad reiniciados.");
}

function cargarDemoHumedad() {
  document.getElementById("hum-cant").value = "2";
  renderHumedadTable();

  document.getElementById("hum-id-1").value = "T2-91";
  document.getElementById("hum-mr-1").value = "79.10";
  document.getElementById("hum-mh-1").value = "637.00";
  document.getElementById("hum-ms-1").value = "582.60";

  document.getElementById("hum-id-2").value = "T2-92";
  document.getElementById("hum-mr-2").value = "113.30";
  document.getElementById("hum-mh-2").value = "742.00";
  document.getElementById("hum-ms-2").value = "682.00";

  document.getElementById("hum-obs").value = "Muestra ensayada según ASTM D2216. Secado estándar de 24 horas a 110 ± 5 °C.";

  calcularHumedad();
}

// ===================================================================
// 5. LÓGICA DE ENSAYO 02: PESO VOLUMÉTRICO Y DENSIDAD (NTP 339.139 / ASTM D7263)
// ===================================================================
function initVolumetricoEvents() {
  const volCantSelect = document.getElementById("vol-cant");
  if (volCantSelect) {
    volCantSelect.addEventListener("change", renderVolumetricoTable);
    renderVolumetricoTable();
  }

  const btnParafina = document.getElementById("btn-method-parafina");
  const btnCilindro = document.getElementById("btn-method-cilindro");
  const cardParafina = document.getElementById("card-vol-parafina");
  const cardCilindro = document.getElementById("card-vol-cilindro");
  const cardCantParafina = document.getElementById("card-vol-cant-parafina");

  btnParafina.addEventListener("click", () => {
    btnParafina.classList.add("active");
    btnCilindro.classList.remove("active");
    cardParafina.classList.remove("hidden");
    if (cardCantParafina) cardCantParafina.classList.remove("hidden");
    cardCilindro.classList.add("hidden");
    GeoState.ensayos.volumetrico.metodo = "parafina";
  });

  btnCilindro.addEventListener("click", () => {
    btnCilindro.classList.add("active");
    btnParafina.classList.remove("active");
    cardCilindro.classList.remove("hidden");
    cardParafina.classList.add("hidden");
    if (cardCantParafina) cardCantParafina.classList.add("hidden");
    GeoState.ensayos.volumetrico.metodo = "cilindro";
  });

  document.getElementById("btn-calcular-vol").addEventListener("click", calcularVolumetrico);
  document.getElementById("btn-limpiar-vol").addEventListener("click", limpiarVolumetrico);
  document.getElementById("btn-fill-demo-vol").addEventListener("click", cargarDemoVolumetrico);

  document.getElementById("btn-copiar-humedad-calculada").addEventListener("click", () => {
    if (GeoState.ensayos.humedad.calculado && GeoState.ensayos.humedad.promedio !== null) {
      document.getElementById("vol-humedad").value = GeoState.ensayos.humedad.promedio.toFixed(2);
      showToast(`Humedad sincronizada desde Ensayo 01: ${GeoState.ensayos.humedad.promedio.toFixed(2)} %`);
    } else {
      alert("Aún no se ha calculado el Ensayo 01 (Contenido de Humedad). Ingréselo manualmente o calcule primero el Ensayo 01.");
    }
  });

  document.getElementById("btn-exportar-pdf-vol").addEventListener("click", () => {
    if (!GeoState.ensayos.volumetrico.calculado) {
      alert("Para exportar el informe en PDF, primero ingrese los datos y presione '⚡ Calcular'.");
      return;
    }
    generarPDFIndividual("volumetrico");
  });
}

function renderVolumetricoTable() {
  const select = document.getElementById("vol-cant");
  const cant = parseInt(select.value) || 3;
  const tbody = document.getElementById("tbody-vol-parafina-inputs");
  if (!tbody) return;

  let html = "";
  for (let i = 1; i <= cant; i++) {
    html += `
      <tr>
        <td class="text-center font-bold text-accent">${i}</td>
        <td><input type="number" step="0.1" class="input-control font-mono" id="vol-par-mm-${i}" placeholder="Ej. 123.8"></td>
        <td><input type="number" step="0.1" class="input-control font-mono" id="vol-par-mmp-${i}" placeholder="Ej. 131.2"></td>
        <td><input type="number" step="0.1" class="input-control font-mono" id="vol-par-msum-${i}" placeholder="Ej. 58.2"></td>
      </tr>
    `;
  }
  tbody.innerHTML = html;
}

function calcularVolumetrico() {
  try {
    const metodo = GeoState.ensayos.volumetrico.metodo;
    const wVal = document.getElementById("vol-humedad").value.trim();
    const w = wVal ? parseFloat(wVal) : null;
    const obs = document.getElementById("vol-obs").value.trim();

    if (w !== null && (isNaN(w) || w < 0)) {
      throw new Error("El contenido de humedad no puede ser un valor negativo.");
    }

    let pruebas = [];
    let prom_rho_humeda = 0;
    let prom_gamma_kn_m3 = 0;
    let prom_rho_seca = null;
    let prom_gamma_seca = null;

    if (metodo === "parafina") {
      const rhoP = parseFloat(document.getElementById("vol-rho-parafina").value) || 0.87;
      if (rhoP <= 0) throw new Error("La densidad de la parafina debe ser mayor que cero.");

      const cant = parseInt(document.getElementById("vol-cant").value) || 3;
      for (let i = 1; i <= cant; i++) {
        const mmVal = document.getElementById(`vol-par-mm-${i}`).value.trim();
        const mmpVal = document.getElementById(`vol-par-mmp-${i}`).value.trim();
        const msumVal = document.getElementById(`vol-par-msum-${i}`).value.trim();

        if (!mmVal && !mmpVal && !msumVal) continue;
        if (!mmVal || !mmpVal || !msumVal) {
          throw new Error(`En la Prueba ${i}, complete Masa Suelo (Mm), Masa Suelo+Parafina (Mm+p) y Masa Sumergida.`);
        }

        const mm = parseFloat(mmVal);
        const mmp = parseFloat(mmpVal);
        const msum = parseFloat(msumVal);

        if (isNaN(mm) || isNaN(mmp) || isNaN(msum)) throw new Error(`Los datos de la Prueba ${i} deben ser numéricos.`);
        if (mm <= 0 || msum < 0) throw new Error(`La masa de suelo y masa sumergida en Prueba ${i} deben ser válidas.`);
        if (mmp <= mm) throw new Error(`En la Prueba ${i}, la masa del suelo parafinado (Mm+p = ${mmp}g) debe ser mayor a la masa del suelo (Mm = ${mm}g).`);

        const vmp = mmp - msum;
        const mp = mmp - mm;
        const vp = mp / rhoP;
        const vm = vmp - vp;

        if (vm <= 0) throw new Error(`El volumen del suelo calculado en Prueba ${i} (${vm.toFixed(2)} cm³) es inválido.`);

        const gamma_m_gf = mm / vm; // g/cm³ o gf/cm³
        const gamma_m_kn = gamma_m_gf * 9.80665; // kN/m³

        let gamma_d_gf = null;
        let gamma_d_kn = null;
        if (w !== null) {
          gamma_d_gf = gamma_m_gf / (1.0 + w / 100.0);
          gamma_d_kn = gamma_m_kn / (1.0 + w / 100.0);
        }

        pruebas.push({
          num: i,
          mm,
          mmp,
          mp,
          vmp,
          vp,
          vm,
          gamma_m_gf,
          gamma_m_kn,
          gamma_d_gf,
          gamma_d_kn
        });
      }

      if (pruebas.length === 0) {
        throw new Error("Ingrese al menos una prueba válida para el ensayo de Muestra Parafinada (NTP 339.139).");
      }

      const n = pruebas.length;
      prom_rho_humeda = pruebas.reduce((acc, p) => acc + p.gamma_m_gf, 0) / n;
      prom_gamma_kn_m3 = pruebas.reduce((acc, p) => acc + p.gamma_m_kn, 0) / n;

      if (w !== null) {
        prom_rho_seca = prom_rho_humeda / (1.0 + w / 100.0);
        prom_gamma_seca = prom_gamma_kn_m3 / (1.0 + w / 100.0);
      }

    } else {
      // Método B: Cilindro
      const mmVal = document.getElementById("vol-molde").value.trim();
      const mtsVal = document.getElementById("vol-molde-suelo").value.trim();
      const vVal = document.getElementById("vol-volumen").value.trim();

      if (!mmVal || !mtsVal || !vVal) {
        throw new Error("Complete los campos requeridos: Masa del molde (Mm), Masa molde + suelo (Mts) y Volumen (V).");
      }

      const mm = parseFloat(mmVal);
      const mts = parseFloat(mtsVal);
      const v = parseFloat(vVal);

      if (isNaN(mm) || isNaN(mts) || isNaN(v)) throw new Error("Los valores medidos deben ser números válidos.");
      if (mm <= 0 || mts <= 0 || v <= 0) throw new Error("Las masas y el volumen deben ser mayores que cero.");
      if (mts <= mm) throw new Error("La masa recipiente + suelo húmedo debe ser mayor a la del recipiente vacío.");

      const masa_suelo = mts - mm;
      prom_rho_humeda = masa_suelo / v;
      prom_gamma_kn_m3 = prom_rho_humeda * 9.80665;

      if (w !== null) {
        prom_rho_seca = prom_rho_humeda / (1.0 + w / 100.0);
        prom_gamma_seca = prom_gamma_kn_m3 / (1.0 + w / 100.0);
      }

      pruebas.push({
        num: 1,
        mm,
        mts,
        masa_suelo,
        v,
        gamma_m_gf: prom_rho_humeda,
        gamma_m_kn: prom_gamma_kn_m3,
        gamma_d_gf: prom_rho_seca,
        gamma_d_kn: prom_gamma_seca
      });
    }

    GeoState.ensayos.volumetrico = {
      calculado: true,
      metodo,
      rho_parafina: document.getElementById("vol-rho-parafina") ? parseFloat(document.getElementById("vol-rho-parafina").value) : 0.87,
      pruebas,
      humedad: w,
      rho_humeda: prom_rho_humeda,
      rho_kg_m3: prom_rho_humeda * 1000.0,
      gamma_kn_m3: prom_gamma_kn_m3,
      gamma_gf_cm3: prom_rho_humeda,
      rho_seca: prom_rho_seca,
      rho_seca_kg_m3: prom_rho_seca ? prom_rho_seca * 1000.0 : null,
      gamma_seca: prom_gamma_seca,
      observaciones: obs
    };

    renderResultadosVolumetrico();
    updateDashboardSummary();
    showToast("Cálculo de peso volumétrico y densidad completado.");

  } catch (err) {
    alert("Error en datos de Peso Volumétrico:\n" + err.message);
  }
}

function renderResultadosVolumetrico() {
  const v = GeoState.ensayos.volumetrico;
  if (!v.calculado) return;

  document.getElementById("vol-results-placeholder").classList.add("hidden");
  document.getElementById("vol-results-content").classList.remove("hidden");

  document.getElementById("vol-res-rho").textContent = `${v.rho_humeda.toFixed(3)} g/cm³`;
  document.getElementById("vol-res-rho-kg").textContent = `${v.rho_kg_m3.toFixed(1)} kg/m³`;

  document.getElementById("vol-res-gamma").textContent = `${v.gamma_kn_m3.toFixed(3)} kN/m³`;
  document.getElementById("vol-res-gamma-gf").textContent = `${v.gamma_gf_cm3.toFixed(3)} gf/cm³`;

  const drySection = document.getElementById("vol-dry-section");
  if (v.humedad !== null && v.rho_seca !== null) {
    drySection.classList.remove("hidden");
    document.getElementById("vol-res-rhod").textContent = `${v.rho_seca.toFixed(3)} g/cm³`;
    document.getElementById("vol-res-rhod-kg").textContent = `${v.rho_seca_kg_m3.toFixed(1)} kg/m³`;
    document.getElementById("vol-res-gammad").textContent = `${v.gamma_seca.toFixed(3)} kN/m³`;
    document.getElementById("vol-res-w-applied").textContent = `Con w = ${v.humedad.toFixed(2)} %`;
  } else {
    drySection.classList.add("hidden");
  }

  const tbody = document.getElementById("tbody-vol-breakdown");
  const thead = document.getElementById("thead-vol-breakdown");
  tbody.innerHTML = "";

  if (v.metodo === "parafina") {
    thead.innerHTML = `
      <tr>
        <th>Prueba</th>
        <th>Masa Suelo (Mm) [g]</th>
        <th>Vol. Parafina (Vp) [cm³]</th>
        <th>Vol. Suelo (Vm) [cm³]</th>
        <th>γm [g/cm³]</th>
        <th>γm [kN/m³]</th>
      </tr>
    `;
    v.pruebas.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="text-center font-bold text-accent">${p.num}</td>
        <td class="font-mono text-right">${p.mm.toFixed(1)}</td>
        <td class="font-mono text-right">${p.vp.toFixed(2)}</td>
        <td class="font-mono text-right font-bold">${p.vm.toFixed(2)}</td>
        <td class="font-mono text-right font-bold text-primary">${p.gamma_m_gf.toFixed(3)}</td>
        <td class="font-mono text-right font-bold text-accent">${p.gamma_m_kn.toFixed(3)}</td>
      `;
      tbody.appendChild(tr);
    });
  } else {
    thead.innerHTML = `
      <tr>
        <th>Molde</th>
        <th>Masa Molde (Mm) [g]</th>
        <th>Masa Neta (M) [g]</th>
        <th>Volumen (V) [cm³]</th>
        <th>ρm [g/cm³]</th>
        <th>γm [kN/m³]</th>
      </tr>
    `;
    const p = v.pruebas[0];
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="text-center font-bold text-accent">1</td>
      <td class="font-mono text-right">${p.mm.toFixed(2)}</td>
      <td class="font-mono text-right font-bold">${p.masa_suelo.toFixed(2)}</td>
      <td class="font-mono text-right">${p.v.toFixed(1)}</td>
      <td class="font-mono text-right font-bold text-primary">${p.gamma_m_gf.toFixed(3)}</td>
      <td class="font-mono text-right font-bold text-accent">${p.gamma_m_kn.toFixed(3)}</td>
    `;
    tbody.appendChild(tr);
  }
}

function limpiarVolumetrico() {
  const cant = parseInt(document.getElementById("vol-cant").value) || 3;
  for (let i = 1; i <= cant; i++) {
    const el1 = document.getElementById(`vol-par-mm-${i}`);
    if (el1) el1.value = "";
    const el2 = document.getElementById(`vol-par-mmp-${i}`);
    if (el2) el2.value = "";
    const el3 = document.getElementById(`vol-par-msum-${i}`);
    if (el3) el3.value = "";
  }
  document.getElementById("vol-molde").value = "";
  document.getElementById("vol-molde-suelo").value = "";
  document.getElementById("vol-volumen").value = "944.0";
  document.getElementById("vol-humedad").value = "";
  document.getElementById("vol-obs").value = "";

  GeoState.ensayos.volumetrico.calculado = false;
  document.getElementById("vol-results-content").classList.add("hidden");
  document.getElementById("vol-results-placeholder").classList.remove("hidden");
  updateDashboardSummary();
  showToast("Datos de peso volumétrico reiniciados.");
}

function cargarDemoVolumetrico() {
  document.getElementById("vol-cant").value = "3";
  renderVolumetricoTable();

  // Cargar según datos oficiales de la guía UNI FIC (Anexo AT-PR.2-F1)
  document.getElementById("vol-par-mm-1").value = "123.8";
  document.getElementById("vol-par-mmp-1").value = "131.2";
  document.getElementById("vol-par-msum-1").value = (131.2 - 73.0).toFixed(1);

  document.getElementById("vol-par-mm-2").value = "105.4";
  document.getElementById("vol-par-mmp-2").value = "112.6";
  document.getElementById("vol-par-msum-2").value = (112.6 - 63.0).toFixed(1);

  document.getElementById("vol-par-mm-3").value = "104.9";
  document.getElementById("vol-par-mmp-3").value = "111.4";
  document.getElementById("vol-par-msum-3").value = (111.4 - 62.0).toFixed(1);

  document.getElementById("vol-rho-parafina").value = "0.87";

  if (GeoState.ensayos.humedad.calculado && GeoState.ensayos.humedad.promedio !== null) {
    document.getElementById("vol-humedad").value = GeoState.ensayos.humedad.promedio.toFixed(2);
  } else {
    document.getElementById("vol-humedad").value = "11.00";
  }

  document.getElementById("vol-obs").value = "Muestra inalterada de suelo cohesivo ensayada por el método de la parafina según NTP 339.139.";
  calcularVolumetrico();
}

// ===================================================================
// 6. LÓGICA DE ENSAYO 03: GRAVEDAD ESPECÍFICA DE SÓLIDOS (ASTM D854 / NTP 339.131)
// ===================================================================
function initGravedadEvents() {
  const gsCantSelect = document.getElementById("gs-cant");
  if (gsCantSelect) {
    gsCantSelect.addEventListener("change", renderGravedadTable);
    renderGravedadTable();
  }

  const tempInput = document.getElementById("gs-temp");
  const rhoInput = document.getElementById("gs-rho-w");

  if (tempInput && rhoInput) {
    tempInput.addEventListener("input", () => {
      const t = parseFloat(tempInput.value);
      if (!isNaN(t)) {
        const props = getWaterProperties(t);
        rhoInput.value = props.rho.toFixed(5);
      }
    });
  }

  document.getElementById("btn-calcular-gs").addEventListener("click", calcularGravedad);
  document.getElementById("btn-limpiar-gs").addEventListener("click", limpiarGravedad);
  document.getElementById("btn-fill-demo-gs").addEventListener("click", cargarDemoGravedad);

  document.getElementById("btn-exportar-pdf-gs").addEventListener("click", () => {
    if (!GeoState.ensayos.gravedad.calculado) {
      alert("Para exportar el informe en PDF, primero ingrese los datos y presione '⚡ Calcular'.");
      return;
    }
    generarPDFIndividual("gravedad");
  });
}

function renderGravedadTable() {
  const select = document.getElementById("gs-cant");
  const cant = parseInt(select.value) || 2;
  const tbody = document.getElementById("tbody-gs-inputs");
  if (!tbody) return;

  let html = "";
  for (let i = 1; i <= cant; i++) {
    html += `
      <tr>
        <td class="text-center font-bold text-accent">${i}</td>
        <td><input type="number" step="0.1" class="input-control font-mono" id="gs-temp-${i}" value="16.5" placeholder="°C"></td>
        <td><input type="number" step="0.01" class="input-control font-mono" id="gs-mpsw-${i}" value="320.60" placeholder="Ej. 320.60"></td>
        <td><input type="number" step="0.01" class="input-control font-mono" id="gs-ms-${i}" value="60.00" placeholder="Ej. 60.00"></td>
        <td><input type="number" step="0.01" class="input-control font-mono" id="gs-mpw-${i}" value="282.20" placeholder="Ej. 282.20"></td>
      </tr>
    `;
  }
  tbody.innerHTML = html;
}

function calcularGravedad() {
  try {
    const obs = document.getElementById("gs-obs").value.trim();

    const pruebas = [];
    const cant = parseInt(document.getElementById("gs-cant").value) || 2;

    for (let i = 1; i <= cant; i++) {
      const tempVal = document.getElementById(`gs-temp-${i}`).value.trim();
      const mpwVal = document.getElementById(`gs-mpw-${i}`).value.trim();
      const msVal = document.getElementById(`gs-ms-${i}`).value.trim();
      const mpswVal = document.getElementById(`gs-mpsw-${i}`).value.trim();

      if (!tempVal && !mpwVal && !msVal && !mpswVal) continue;

      if (!tempVal || !mpwVal || !msVal || !mpswVal) {
        throw new Error(`En la Prueba ${i}, complete Temperatura, Mpw,t, Ms y Mpws,t.`);
      }

      let temp = parseFloat(tempVal);
      if (temp >= 100 && temp <= 500) {
        temp = temp / 10.0; // Corrección para ingresos como 210 -> 21.0
      }

      if (isNaN(temp) || temp < 0 || temp > 50) {
        throw new Error(`La temperatura en la Prueba ${i} debe estar entre 0 y 50 °C.`);
      }

      const waterProps = getWaterProperties(temp);
      const rho_w = waterProps.rho || waterProps.rho_w;
      const k = waterProps.k;

      const mp = 0; // Mp is no longer used, we only use Mpw directly
      const vp = null;
      const mpw = parseFloat(mpwVal);
      const ms = parseFloat(msVal);
      const mpsw = parseFloat(mpswVal);

      if (isNaN(mpw) || isNaN(ms) || isNaN(mpsw)) {
        throw new Error(`Las pesadas de la Prueba ${i} deben ser numéricas.`);
      }
      if (ms <= 0 || mpw <= 0 || mpsw <= 0) {
        throw new Error(`Las masas en Prueba ${i} deben ser mayores que cero.`);
      }

      // Masa de agua desalojada equivalente al volumen de sólidos:
      // V_s * rho_w = M_s + M_pw,t - M_pws,t
      const desalojada = ms + mpw - mpsw;

      if (desalojada <= 0) {
        throw new Error(
          `En la Prueba ${i}, la masa de agua desalojada es inválida (${desalojada.toFixed(2)} g).\n` +
          "Verifique que la masa con suelo y agua (Mpws,t = " + mpsw + "g) sea coherente con Ms y Mpw."
        );
      }

      const gt = ms / desalojada; // Gt a T° de ensayo
      const g20 = k * gt; // Gs corregido a 20°C

      pruebas.push({
        num: i,
        temp,
        rho_w,
        k,
        mp,
        vp,
        mpw,
        ms,
        mpsw,
        desalojada,
        gt,
        g20
      });
    }

    if (pruebas.length === 0) {
      throw new Error("Ingrese al menos una prueba picnométrica para calcular la Gravedad Específica.");
    }

    const n = pruebas.length;
    const prom_gt = pruebas.reduce((acc, p) => acc + p.gt, 0) / n;
    const prom_g20 = pruebas.reduce((acc, p) => acc + p.g20, 0) / n;
    const prom_temp = pruebas.reduce((acc, p) => acc + p.temp, 0) / n;
    const prom_rho_w = pruebas.reduce((acc, p) => acc + p.rho_w, 0) / n;
    const prom_k = pruebas.reduce((acc, p) => acc + p.k, 0) / n;

    GeoState.ensayos.gravedad = {
      calculado: true,
      temp: prom_temp,
      rho_w: prom_rho_w,
      k: prom_k,
      pruebas,
      gt: prom_gt,
      gs: prom_g20, // Gs final a 20°C
      observaciones: obs
    };

    renderResultadosGravedad();
    updateDashboardSummary();
    showToast(`Gravedad Específica completada: Gs @ 20°C = ${prom_g20.toFixed(3)}`);

  } catch (err) {
    alert("Error en datos de Gravedad Específica:\n" + err.message);
  }
}

function renderResultadosGravedad() {
  const g = GeoState.ensayos.gravedad;
  if (!g.calculado) return;

  document.getElementById("gs-results-placeholder").classList.add("hidden");
  document.getElementById("gs-results-content").classList.remove("hidden");

  document.getElementById("gs-res-gs").textContent = g.gs.toFixed(3);
  document.getElementById("gs-res-gt").textContent = g.gt.toFixed(3);
  document.getElementById("gs-res-k").textContent = g.k.toFixed(5);
  document.getElementById("gs-res-temp-label").textContent = `A Tt = ${g.temp.toFixed(1)} °C`;
  document.getElementById("gs-res-rho-label").textContent = `ρw,t = ${g.rho_w.toFixed(5)} g/mL`;

  let interpretacion = "Rango normal para suelos minerales";
  if (g.gs < 2.5) {
    interpretacion = "Valor bajo (posible presencia de materia orgánica o cenizas)";
  } else if (g.gs > 2.8) {
    interpretacion = "Valor alto (posible presencia de minerales de hierro pesados o basalto)";
  } else {
    interpretacion = "Rango geotécnico típico (suelos arcillosos / limosos / cuarzosos)";
  }
  document.getElementById("gs-res-interpretacion").textContent = interpretacion;

  const tbody = document.getElementById("tbody-gs-breakdown");
  tbody.innerHTML = "";

  g.pruebas.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="text-center font-bold text-accent">${p.num}</td>
      <td class="font-mono text-right">${p.ms.toFixed(2)}</td>
      <td class="font-mono text-right">${p.desalojada.toFixed(2)}</td>
      <td class="font-mono text-right font-bold text-primary">${p.gt.toFixed(3)}</td>
      <td class="font-mono text-right font-bold text-accent">${p.g20.toFixed(3)}</td>
    `;
    tbody.appendChild(tr);
  });
}

function limpiarGravedad() {
  const cant = parseInt(document.getElementById("gs-cant").value) || 2;
  for (let i = 1; i <= cant; i++) {
    const t = document.getElementById(`gs-temp-${i}`);
    if (t) t.value = "";
    const w1 = document.getElementById(`gs-mpw-${i}`);
    if (w1) w1.value = "";
    const w2 = document.getElementById(`gs-ms-${i}`);
    if (w2) w2.value = "";
    const w3 = document.getElementById(`gs-mpsw-${i}`);
    if (w3) w3.value = "";
  }
  document.getElementById("gs-obs").value = "";

  GeoState.ensayos.gravedad.calculado = false;
  document.getElementById("gs-results-content").classList.add("hidden");
  document.getElementById("gs-results-placeholder").classList.remove("hidden");
  updateDashboardSummary();
  showToast("Datos de gravedad específica reiniciados.");
}

function cargarDemoGravedad() {
  document.getElementById("gs-cant").value = "2";
  renderGravedadTable();

  // Cargar según datos oficiales de la guía UNI FIC (Anexo AT-PR.3-F1 - Página 12)
  document.getElementById("gs-temp-1").value = "16.5";
  document.getElementById("gs-mpw-1").value = "282.20";
  document.getElementById("gs-ms-1").value = "60.00";
  document.getElementById("gs-mpsw-1").value = "320.60";

  document.getElementById("gs-temp-2").value = "16.5";
  document.getElementById("gs-mpw-2").value = "278.70";
  document.getElementById("gs-ms-2").value = "63.00";
  document.getElementById("gs-mpsw-2").value = "319.00";

  document.getElementById("gs-obs").value = "Picnómetro calibrado a 16.5 °C con agua destilada y desairado por vacío durante 2 horas según ASTM D854.";
  calcularGravedad();
}

// ===================================================================
// 7. DASHBOARD, RESUMEN CONSOLIDADO Y BOTÓN EXTERIOR DE PDF GENERAL
// ===================================================================
function initDashboardEvents() {
  const btnExportConsol = document.getElementById("btn-exportar-consolidado-dashboard");
  if (btnExportConsol) {
    btnExportConsol.addEventListener("click", () => {
      const { humedad, volumetrico, gravedad } = GeoState.ensayos;
      const algunoCalculado = humedad.calculado || volumetrico.calculado || gravedad.calculado;

      if (!algunoCalculado) {
        alert("Aún no se ha calculado ningún ensayo.\n\nPara emitir el Informe General Consolidado, debe ingresar datos y presionar '⚡ Calcular' en al menos uno de los tres ensayos.");
        return;
      }

      const todosCalculados = humedad.calculado && volumetrico.calculado && gravedad.calculado;
      if (!todosCalculados) {
        const confirmacion = confirm(
          "No todos los 3 ensayos han sido calculados aún:\n\n" +
          `• 01. Humedad: ${humedad.calculado ? '✅ Calculado' : '⏳ Pendiente'}\n` +
          `• 02. Peso Volumétrico: ${volumetrico.calculado ? '✅ Calculado' : '⏳ Pendiente'}\n` +
          `• 03. Gravedad Específica: ${gravedad.calculado ? '✅ Calculado' : '⏳ Pendiente'}\n\n` +
          "¿Desea generar el Informe General Consolidado incluyendo los ensayos disponibles?"
        );
        if (!confirmacion) return;
      }

      generarPDFConsolidado();
    });
  }

  const btnCargarTodo = document.getElementById("btn-cargar-todo-ejemplo");
  if (btnCargarTodo) {
    btnCargarTodo.addEventListener("click", () => {
      cargarDemoHumedad();
      cargarDemoVolumetrico();
      cargarDemoGravedad();
      showToast("Datos de demostración completos cargados en los 3 ensayos.");
    });
  }

  const btnSyncAll = document.getElementById("btn-sync-all");
  if (btnSyncAll) {
    btnSyncAll.addEventListener("click", () => {
      updateDashboardSummary();
      showToast("Cálculos y relaciones geotécnicas sincronizadas.");
    });
  }

  const btnSyncAtt = document.getElementById("btn-sync-att");
  if (btnSyncAtt) btnSyncAtt.addEventListener("click", () => {
    updateDashboardAtterbergSummary();
    showToast("Resultados de Atterberg sincronizados.");
  });
  const btnSyncPro = document.getElementById("btn-sync-pro");
  if (btnSyncPro) btnSyncPro.addEventListener("click", () => {
    updateDashboardProctorSummary();
    showToast("Resultados de Proctor sincronizados.");
  });

  const btnExportGeneral = document.getElementById("btn-exportar-general");
  if (btnExportGeneral) {
    btnExportGeneral.addEventListener("click", generarPDFGeneral);
  }
}

function updateDashboardPills() {
  const { humedad, volumetrico, gravedad } = GeoState.ensayos;

  const setBadge = (elId, status, text) => {
    const el = document.getElementById(elId);
    if (el) {
      el.textContent = text;
      el.className = status ? "badge badge-success" : "badge badge-pending";
    }
  };

  setBadge("pill-summary-humedad", humedad.calculado, `01. Humedad: ${humedad.calculado ? '✅' : '⏳'}`);
  setBadge("pill-summary-vol", volumetrico.calculado, `02. Volumétrico: ${volumetrico.calculado ? '✅' : '⏳'}`);
  setBadge("pill-summary-gs", gravedad.calculado, `03. Gs: ${gravedad.calculado ? '✅' : '⏳'}`);

  const setCardBadge = (elId, status) => {
    const el = document.getElementById(elId);
    if (el) {
      el.textContent = status ? "Calculado" : "Sin calcular";
      el.className = status ? "card-status calculated" : "card-status";
    }
  };

  setCardBadge("badge-card-humedad", humedad.calculado);
  setCardBadge("badge-card-vol", volumetrico.calculado);
  setCardBadge("badge-card-gs", gravedad.calculado);

  // Ensayos 04, 05 y 06 (tarjetas con su propio resumen)
  const { granulometria, atterberg, proctor } = GeoState.ensayos;
  setBadge("pill-summary-granu", granulometria.calculado, `04. Granulometría: ${granulometria.calculado ? '✅' : '⏳'}`);
  setBadge("pill-summary-att", atterberg.calculado, `05. Atterberg: ${atterberg.calculado ? '✅' : '⏳'}`);
  setBadge("pill-summary-pro", proctor.calculado, `06. Proctor: ${proctor.calculado ? '✅' : '⏳'}`);

  const setCheck = (elId, status, text) => {
    const el = document.getElementById(elId);
    if (el) el.textContent = `${status ? "✅" : "⏳"} ${text}`;
  };
  setCheck("check-humedad", humedad.calculado, "Humedad por secado");
  setCheck("check-vol", volumetrico.calculado, "Densidad y pesos volumétricos");
  setCheck("check-gs", gravedad.calculado, "Gravedad específica de sólidos");
}

function updateDashboardSummary() {
  updateDashboardPills();
  const { humedad, volumetrico, gravedad } = GeoState.ensayos;

  if (humedad.calculado && humedad.promedio !== null) {
    document.getElementById("val-preview-w").textContent = `${humedad.promedio.toFixed(2)} %`;
    document.getElementById("td-sum-w").textContent = `${humedad.promedio.toFixed(2)}`;
    document.getElementById("td-status-w").innerHTML = `<span class="badge badge-success">Completado</span>`;
  } else {
    document.getElementById("val-preview-w").textContent = "—";
    document.getElementById("td-sum-w").textContent = "—";
    document.getElementById("td-status-w").innerHTML = `<span class="badge badge-pending">Sin procesar</span>`;
  }

  if (volumetrico.calculado) {
    document.getElementById("val-preview-gamma").textContent = `${volumetrico.gamma_kn_m3.toFixed(3)} kN/m³`;
    document.getElementById("val-preview-gammad").textContent = volumetrico.gamma_seca !== null ? `${volumetrico.gamma_seca.toFixed(3)} kN/m³` : "N/A";

    document.getElementById("td-sum-rho").textContent = volumetrico.rho_humeda.toFixed(3);
    document.getElementById("td-status-vol-1").innerHTML = `<span class="badge badge-success">Completado</span>`;

    document.getElementById("td-sum-gamma").textContent = volumetrico.gamma_kn_m3.toFixed(3);
    document.getElementById("td-status-vol-2").innerHTML = `<span class="badge badge-success">Completado</span>`;

    if (volumetrico.rho_seca !== null) {
      document.getElementById("td-sum-rhod").textContent = volumetrico.rho_seca.toFixed(3);
      document.getElementById("td-status-vol-3").innerHTML = `<span class="badge badge-success">Completado</span>`;
      document.getElementById("td-sum-gammad").textContent = volumetrico.gamma_seca.toFixed(3);
      document.getElementById("td-status-vol-4").innerHTML = `<span class="badge badge-success">Completado</span>`;
    } else {
      document.getElementById("td-sum-rhod").textContent = "—";
      document.getElementById("td-status-vol-3").innerHTML = `<span class="badge badge-pending">Requiere w</span>`;
      document.getElementById("td-sum-gammad").textContent = "—";
      document.getElementById("td-status-vol-4").innerHTML = `<span class="badge badge-pending">Requiere w</span>`;
    }
  } else {
    document.getElementById("val-preview-gamma").textContent = "—";
    document.getElementById("val-preview-gammad").textContent = "—";
    document.getElementById("td-sum-rho").textContent = "—";
    document.getElementById("td-sum-gamma").textContent = "—";
    document.getElementById("td-sum-rhod").textContent = "—";
    document.getElementById("td-sum-gammad").textContent = "—";
    document.getElementById("td-status-vol-1").innerHTML = `<span class="badge badge-pending">Sin procesar</span>`;
    document.getElementById("td-status-vol-2").innerHTML = `<span class="badge badge-pending">Sin procesar</span>`;
    document.getElementById("td-status-vol-3").innerHTML = `<span class="badge badge-pending">Sin procesar</span>`;
    document.getElementById("td-status-vol-4").innerHTML = `<span class="badge badge-pending">Sin procesar</span>`;
  }

  if (gravedad.calculado && gravedad.gs !== null) {
    document.getElementById("val-preview-gs").textContent = gravedad.gs.toFixed(3);
    document.getElementById("td-sum-gs").textContent = gravedad.gs.toFixed(3);
    document.getElementById("td-status-gs").innerHTML = `<span class="badge badge-success">Completado</span>`;
  } else {
    document.getElementById("val-preview-gs").textContent = "—";
    document.getElementById("td-sum-gs").textContent = "—";
    document.getElementById("td-status-gs").innerHTML = `<span class="badge badge-pending">Sin procesar</span>`;
  }

  // Relaciones Geotécnicas Derivadas (e0, n, Sr)
  const gamma_w = 9.80665;
  if (volumetrico.calculado && volumetrico.gamma_seca !== null && gravedad.calculado && gravedad.gs !== null) {
    const e0 = (gravedad.gs * gamma_w) / volumetrico.gamma_seca - 1.0;
    if (e0 > 0) {
      const n = (e0 / (1.0 + e0)) * 100.0;
      document.getElementById("td-sum-e").textContent = e0.toFixed(3);
      document.getElementById("td-status-e").innerHTML = `<span class="badge badge-success">Calculado</span>`;

      document.getElementById("td-sum-n").textContent = `${n.toFixed(2)} %`;
      document.getElementById("td-status-n").innerHTML = `<span class="badge badge-success">Calculado</span>`;

      const wEfectivo = volumetrico.humedad !== null ? volumetrico.humedad : (humedad.promedio !== null ? humedad.promedio : null);
      if (wEfectivo !== null) {
        const sr = (wEfectivo * gravedad.gs) / e0;
        document.getElementById("td-sum-sr").textContent = `${sr.toFixed(2)} %`;
        document.getElementById("td-status-sr").innerHTML = `<span class="badge badge-success">Calculado</span>`;
      } else {
        document.getElementById("td-sum-sr").textContent = "—";
        document.getElementById("td-status-sr").innerHTML = `<span class="badge badge-pending">Requiere w</span>`;
      }
    } else {
      document.getElementById("td-sum-e").textContent = "Incoherente";
      document.getElementById("td-status-e").innerHTML = `<span class="badge badge-pending">Verificar datos</span>`;
    }
  } else {
    document.getElementById("td-sum-e").textContent = "—";
    document.getElementById("td-status-e").innerHTML = `<span class="badge badge-pending">Requiere γd y Gs</span>`;
    document.getElementById("td-sum-n").textContent = "—";
    document.getElementById("td-status-n").innerHTML = `<span class="badge badge-pending">Requiere e₀</span>`;
    document.getElementById("td-sum-sr").textContent = "—";
    document.getElementById("td-status-sr").innerHTML = `<span class="badge badge-pending">Requiere w, Gs, e₀</span>`;
  }
}

// ===================================================================
// 8. DASHBOARD LABORATORIO 2 Y SÍNTESIS
// ===================================================================
function initDashboardLab2Events() {
  const btnExportar = document.getElementById("btn-exportar-consolidado-lab2");
  if (btnExportar) {
    btnExportar.addEventListener("click", () => {
      const g = GeoState.ensayos.granulometria;
      if (!g.calculado) {
        alert("Para emitir el Informe General de Laboratorio 2, primero ingrese las pesadas y presione '⚡ Calcular Granulometría'.");
        return;
      }
      generarPDFConsolidadoLab2();
    });
  }

  const btnCargarDemoDash = document.getElementById("btn-cargar-demo-lab2-dash");
  if (btnCargarDemoDash) {
    btnCargarDemoDash.addEventListener("click", () => {
      cargarDemoGranuSimple();
      showToast("Datos de demostración cargados en granulometría.");
    });
  }

  const btnSyncLab2 = document.getElementById("btn-sync-lab2");
  if (btnSyncLab2) {
    btnSyncLab2.addEventListener("click", () => {
      updateDashboardLab2Summary();
      showToast("Resultados de Laboratorio 2 sincronizados.");
    });
  }
}

function updateDashboardLab2Summary() {
  const g = GeoState.ensayos.granulometria;
  updateDashboardPills();

  const setBadge = (elId, status, text) => {
    const el = document.getElementById(elId);
    if (el) {
      el.textContent = text;
      el.className = status ? "badge badge-success" : "badge badge-pending";
    }
  };

  setBadge("pill-lab2-tamizado", g.calculado, `Tamizado: ${g.calculado ? '✅' : '⏳'}`);
  setBadge("pill-lab2-curva", g.calculado, `Curva: ${g.calculado ? '✅' : '⏳'}`);

  const checkLavado = document.getElementById("check-lab2-lavado");
  if (checkLavado) checkLavado.textContent = g.calculado ? "✅ Tamizado con lavado en malla N°200" : "⏳ Tamizado con lavado en malla N°200";
  const checkCurva = document.getElementById("check-lab2-curva");
  if (checkCurva) checkCurva.textContent = g.calculado ? "✅ Curva granulométrica semilogarítmica" : "⏳ Curva granulométrica semilogarítmica";
  const checkGrad = document.getElementById("check-lab2-gradacion");
  if (checkGrad) checkGrad.textContent = g.calculado ? "✅ Coeficientes Cu y Cc" : "⏳ Coeficientes Cu y Cc";

  const setCardBadge = (elId, status) => {
    const el = document.getElementById(elId);
    if (el) {
      el.textContent = status ? "Calculado" : "Sin calcular";
      el.className = status ? "card-status calculated" : "card-status";
    }
  };

  setCardBadge("badge-card-lab2-masas", g.calculado);
  setCardBadge("badge-card-lab2-fracciones", g.calculado);
  setCardBadge("badge-card-lab2-sucs", g.calculado);

  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  const setHtml = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  };

  if (g.calculado) {
    setEl("val-preview-granu-mtotal", `${g.masa_total.toFixed(1)} g`);
    setEl("val-preview-granu-plavado", `${g.perdida_lavado.toFixed(1)} g (${g.porc_perdida_lavado.toFixed(1)}%)`);
    setEl("val-preview-lab2-grava", `${g.grava.toFixed(1)} %`);
    setEl("val-preview-lab2-arena", `${g.arena.toFixed(1)} %`);
    setEl("val-preview-lab2-finos", `${g.finos.toFixed(1)} %`);
    setEl("val-preview-lab2-cu-cc", `Cu=${g.cu ? g.cu.toFixed(1) : '—'} | Cc=${g.cc ? g.cc.toFixed(2) : '—'}`);

    // Tabla de resumen de Lab 2
    setEl("td-lab2-w1", `${g.masa_total.toFixed(2)}`);
    setHtml("td-status-lab2-w1", '<span class="badge badge-success">Completado</span>');

    setEl("td-lab2-w0", `${g.masa_lavada.toFixed(2)}`);
    setHtml("td-status-lab2-w0", '<span class="badge badge-success">Completado</span>');

    setEl("td-lab2-perdidaw", `${g.perdida_lavado.toFixed(2)} g (${g.porc_perdida_lavado.toFixed(2)}%)`);
    setHtml("td-status-lab2-perdidaw", '<span class="badge badge-success">Completado</span>');

    const errOk = g.porc_error <= 1.0;
    setEl("td-lab2-error", `${g.porc_error.toFixed(2)} % (${g.error_gramos.toFixed(2)} g)`);
    setHtml("td-status-lab2-error", errOk ? '<span class="badge badge-success">Aceptado (&le; 1%)</span>' : '<span class="badge badge-pending">Revisar (&gt; 1%)</span>');

    setEl("td-lab2-grava", `${g.grava.toFixed(2)} %`);
    setHtml("td-status-lab2-grava", '<span class="badge badge-success">Calculado</span>');

    setEl("td-lab2-arena", `${g.arena.toFixed(2)} %`);
    setHtml("td-status-lab2-arena", '<span class="badge badge-success">Calculado</span>');

    setEl("td-lab2-finos", `${g.finos.toFixed(2)} %`);
    setHtml("td-status-lab2-finos", '<span class="badge badge-success">Calculado</span>');

    const dStr = `${g.d10 ? g.d10.toFixed(3) : '—'} / ${g.d30 ? g.d30.toFixed(3) : '—'} / ${g.d60 ? g.d60.toFixed(3) : '—'}`;
    setEl("td-lab2-diametros", dStr);
    setHtml("td-status-lab2-diametros", '<span class="badge badge-success">Calculado</span>');

    setEl("td-lab2-cu", g.cu ? g.cu.toFixed(2) : '—');
    setHtml("td-status-lab2-cu", g.cu ? '<span class="badge badge-success">Calculado</span>' : '<span class="badge badge-pending">N/A</span>');

    setEl("td-lab2-cc", g.cc ? g.cc.toFixed(2) : '—');
    setHtml("td-status-lab2-cc", g.cc ? '<span class="badge badge-success">Calculado</span>' : '<span class="badge badge-pending">N/A</span>');

  } else {
    setEl("val-preview-granu-mtotal", "—");
    setEl("val-preview-granu-plavado", "—");
    setEl("val-preview-lab2-grava", "—");
    setEl("val-preview-lab2-arena", "—");
    setEl("val-preview-lab2-finos", "—");
    setEl("val-preview-lab2-cu-cc", "—");
    setEl("val-preview-lab2-sucs", "—");

    setEl("td-lab2-w1", "—");
    setEl("td-lab2-w0", "—");
    setEl("td-lab2-perdidaw", "—");
    setEl("td-lab2-error", "—");
    setEl("td-lab2-grava", "—");
    setEl("td-lab2-arena", "—");
    setEl("td-lab2-finos", "—");
    setEl("td-lab2-diametros", "—");
    setEl("td-lab2-cu", "—");
    setEl("td-lab2-cc", "—");
    setEl("td-lab2-sucs", "—");

    ["w1", "w0", "perdidaw", "error", "grava", "arena", "finos", "diametros", "cu", "cc", "sucs-badge"].forEach(suffix => {
      setHtml(`td-status-lab2-${suffix}`, '<span class="badge badge-pending">Sin procesar</span>');
    });
  }

  // --- Cuadro resumen de granulometría (panel principal) ---
  const gsumSet = (valId, statusId, value, ok, okText = "Calculado", pendText = "Sin procesar") => {
    setEl(valId, value);
    setHtml(statusId, ok
      ? `<span class="badge badge-success">${okText}</span>`
      : `<span class="badge badge-pending">${pendText}</span>`);
  };

  if (g.calculado) {
    gsumSet("td-gsum-grava", "td-gstatus-grava", g.grava.toFixed(1), true);
    gsumSet("td-gsum-arena", "td-gstatus-arena", g.arena.toFixed(1), true);
    gsumSet("td-gsum-finos", "td-gstatus-finos", g.finos.toFixed(1), true);
    gsumSet("td-gsum-d10", "td-gstatus-d10", g.d10 ? g.d10.toFixed(3) : "—", !!g.d10, "Calculado", "No interpolable");
    gsumSet("td-gsum-d30", "td-gstatus-d30", g.d30 ? g.d30.toFixed(3) : "—", !!g.d30, "Calculado", "No interpolable");
    gsumSet("td-gsum-d60", "td-gstatus-d60", g.d60 ? g.d60.toFixed(3) : "—", !!g.d60, "Calculado", "No interpolable");
    gsumSet("td-gsum-cu", "td-gstatus-cu", g.cu ? g.cu.toFixed(2) : "—", !!g.cu, "Calculado", "N/A");
    gsumSet("td-gsum-cc", "td-gstatus-cc", g.cc ? g.cc.toFixed(2) : "—", !!g.cc, "Calculado", "N/A");
    const usoK = g.metodo === "compuesto";
    gsumSet("td-gsum-k", "td-gstatus-k", usoK ? g.factor_k.toFixed(4) : "1.0000", usoK, "Homogenizado", "Método simple");
    const hcs = g.comp;
    if (g.metodo === "compuesto" && hcs) gsumSet("td-gsum-hum", "td-gstatus-hum", `${hcs.humedad_fina.toFixed(2)} / ${hcs.humedad_gruesa !== null ? hcs.humedad_gruesa.toFixed(2) : "—"}`, true, "Calculada");
    else if (g.hum_simple) gsumSet("td-gsum-hum", "td-gstatus-hum", g.hum_simple.humedad_gruesa.toFixed(2), true, "Calculada");
    else gsumSet("td-gsum-hum", "td-gstatus-hum", "—", false, "", "Sin datos de secado");
    if (g.modo === "porcentajes") gsumSet("td-gsum-error", "td-gstatus-error", "—", false, "", "No aplica (sin masas)");
    else gsumSet("td-gsum-error", "td-gstatus-error", `${g.porc_error.toFixed(2)}`, g.porc_error <= 1.0, "Conforme (≤ 1%)", "Revisar (> 1%)");
  } else {
    ["grava", "arena", "finos", "d10", "d30", "d60", "cu", "cc", "k", "hum", "error"].forEach(s => {
      setEl(`td-gsum-${s}`, "—");
    });
    ["grava", "arena", "finos", "d10", "d30", "d60", "cu", "cc", "hum", "error"].forEach(s => {
      setHtml(`td-gstatus-${s}`, '<span class="badge badge-pending">Sin procesar</span>');
    });
    setHtml("td-gstatus-k", '<span class="badge badge-pending">Sin procesar</span>');
  }
}

// ===================================================================
// 9. LÓGICA DE ENSAYO 04: ANÁLISIS GRANULOMÉTRICO (ASTM D6913 / NTP 339.128)
// ===================================================================
let granuChartInstance = null;

// ¿El método elegido es Tamizado Compuesto (Parte Gruesa + Parte Fina)?
function granuEsCompuesto() {
  const el = document.querySelector('input[name="granu-metodo"]:checked');
  return !el || el.value === "a-compuesto";
}

// Lee un campo numérico (null si está vacío / inválido)
function granuNum(id) {
  const el = document.getElementById(id);
  if (!el || el.value === "") return null;
  const v = parseFloat(el.value);
  return isNaN(v) ? null : v;
}

function initGranulometriaEvents() {
  renderGranulometriaTable();

  const w1Input = document.getElementById("granu-masa-total");
  const w0Input = document.getElementById("granu-masa-lavada");
  const updatePerdidaLive = () => {
    const w1 = parseFloat(w1Input ? w1Input.value : 0) || 0;
    const w0 = parseFloat(w0Input ? w0Input.value : 0) || 0;
    const perdida = w1 > 0 && w0 > 0 && w1 >= w0 ? (w1 - w0) : 0;
    const pct = w1 > 0 ? ((perdida / w1) * 100) : 0;
    const el = document.getElementById("granu-live-perdida");
    if (el) {
      el.textContent = `${perdida.toFixed(2)} g (${pct.toFixed(2)} %)`;
    }
  };
  if (w1Input) w1Input.addEventListener("input", updatePerdidaLive);
  if (w0Input) w0Input.addEventListener("input", updatePerdidaLive);

  // Método: en Compuesto los pesos salen del Control de Secado y K es automático
  document.querySelectorAll('input[name="granu-metodo"]').forEach(r =>
    r.addEventListener("change", aplicarMetodoGranu));
  aplicarMetodoGranu();

  document.getElementById("btn-calcular-granu").addEventListener("click", calcularGranulometria);
  document.getElementById("btn-limpiar-granu").addEventListener("click", limpiarGranulometria);
  document.getElementById("btn-fill-demo-granu-simple").addEventListener("click", cargarDemoGranuSimple);
  document.getElementById("btn-fill-demo-granu-compuesto").addEventListener("click", cargarDemoGranuCompuesto);

  document.getElementById("btn-exportar-pdf-granu").addEventListener("click", () => {
    if (!GeoState.ensayos.granulometria.calculado) {
      alert("Para exportar el informe en PDF, primero ingrese los datos y presione '⚡ Calcular Granulometría'.");
      return;
    }
    generarPDFIndividual("granulometria");
  });
}

function aplicarMetodoGranu() {
  const comp = granuEsCompuesto();
  const cardSimple = document.getElementById("card-granu-simple-masas");
  const cardComp = document.getElementById("card-granu-compuesto-info");
  if (cardSimple) cardSimple.classList.toggle("hidden", comp);
  if (cardComp) cardComp.classList.toggle("hidden", !comp);
}

function renderGranulometriaTable() {
  const tbody = document.getElementById("tbody-granu-inputs");
  if (!tbody) return;

  const claseTipo = id => (id === 'n4' ? 'granu-row-n4' : (id === 'n200' ? 'granu-row-n200' : (id === 'mmo' ? 'granu-row-mmo' : '')));
  const etiqueta = id => (id === 'n4' ? ' <span class="granu-tag granu-tag-blue">Grava/Arena</span>'
    : (id === 'n200' ? ' <span class="granu-tag granu-tag-violet">Arena/Finos</span>'
      : (id === 'mmo' ? ' <span class="granu-tag granu-tag-orange">Auto-calculado</span>'
        : (id === 'n10' ? ' <span class="granu-tag granu-tag-blue">Platillo col. 1</span>' : ''))));

  // Entrada: SOLO Masa 1 y Masa 2
  let html = "";
  ASTM_SIEVES.forEach((s, idx) => {
    const auto = s.id === 'mmo';
    html += `
      <tr class="${claseTipo(s.id)}">
        <td class="text-center font-bold text-accent">${idx + 1}</td>
        <td><strong>${s.nombre}</strong> <span style="font-size:0.75rem; color:var(--neutral-muted);">(${s.desc})</span>${etiqueta(s.id)}</td>
        <td class="font-mono text-center">${s.abertura > 0 ? s.abertura.toFixed(3) : '—'}</td>
        <td>
          <input type="number" step="0.01" class="input-control font-mono" id="granu-ret-${s.id}" placeholder="0.00" ${auto ? 'readonly tabindex="-1"' : ''}>
        </td>
        <td>
          <input type="number" step="0.01" class="input-control font-mono" id="granu-ret2-${s.id}" placeholder="0.00" ${auto ? 'readonly tabindex="-1"' : ''}>
        </td>
      </tr>
    `;
  });
  tbody.innerHTML = html;

  // Opcional: ingreso directo por porcentajes (cuando el problema no da masas)
  const tbodyPct = document.getElementById("tbody-granu-pct-inputs");
  if (tbodyPct) {
    tbodyPct.innerHTML = ASTM_SIEVES.filter(s => s.id !== 'mmo').map(s => `
      <tr>
        <td><strong>${s.nombre}</strong></td>
        <td class="font-mono text-center">${s.abertura > 0 ? s.abertura.toFixed(3) : '—'}</td>
        <td><input type="number" step="0.01" class="input-control font-mono granu-pct" data-row="${s.id}" id="granu-pp-${s.id}" placeholder="—"></td>
        <td><input type="number" step="0.01" class="input-control font-mono granu-pct" data-row="${s.id}" id="granu-pa-${s.id}" placeholder="—"></td>
        <td><input type="number" step="0.01" class="input-control font-mono granu-pct" data-row="${s.id}" id="granu-pasa-${s.id}" placeholder="—"></td>
      </tr>`).join("");
  }

  // Al editar un % de una fila se borran los otros dos de esa fila (el último editado manda)
  document.querySelectorAll("input.granu-pct").forEach(inp => {
    inp.addEventListener("input", () => {
      const fila = inp.dataset.row;
      ["pp", "pa", "pasa"].forEach(k => {
        const el = document.getElementById(`granu-${k}-${fila}`);
        if (el && el !== inp) el.value = "";
      });
    });
  });
}

// -------------------------------------------------------------------
// SUCS preliminar (ASTM D2487) a partir de granulometría
// -------------------------------------------------------------------
function sucsPreliminarGranu(finos, grava, arena, cu, cc) {
  const bien = lim => cu && cc && cu >= lim && cc >= 1.0 && cc <= 3.0;
  if (finos >= 50.0) return { simbolo: "FINO", desc: "Suelo fino (Limo / Arcilla)" };
  if (grava > arena) {
    if (finos < 5.0) return bien(4.0)
      ? { simbolo: "GW", desc: "Grava bien graduada" }
      : { simbolo: "GP", desc: "Grava pobremente graduada" };
    if (finos <= 12.0) return bien(4.0)
      ? { simbolo: "GW-GM / GW-GC", desc: "Grava bien graduada con finos" }
      : { simbolo: "GP-GM / GP-GC", desc: "Grava pobremente graduada con finos" };
    return { simbolo: "GM / GC", desc: "Grava con finos limosos o arcillosos" };
  }
  if (finos < 5.0) return bien(6.0)
    ? { simbolo: "SW", desc: "Arena bien graduada" }
    : { simbolo: "SP", desc: "Arena pobremente graduada" };
  if (finos <= 12.0) return bien(6.0)
    ? { simbolo: "SW-SM / SW-SC", desc: "Arena bien graduada con finos" }
    : { simbolo: "SP-SM / SP-SC", desc: "Arena pobremente graduada con finos" };
  return { simbolo: "SM / SC", desc: "Arena con finos limosos o arcillosos" };
}

// -------------------------------------------------------------------
// Clasificación AASHTO (M 145) con Índice de Grupo
//   p10, p40, p200 = % que pasa; ll, ip = límites (0 si NP)
// -------------------------------------------------------------------
function clasificarAASHTO(p10, p40, p200, ll, ip) {
  const np = !(ll > 0) && !(ip > 0);
  let grupo = "";
  let parcial = false; // A-2-6 / A-2-7 usan solo el término parcial del IG
  if (p200 <= 35) {
    if (p10 <= 50 && p40 <= 30 && p200 <= 15 && ip <= 6) grupo = "A-1-a";
    else if (p40 <= 50 && p200 <= 25 && ip <= 6) grupo = "A-1-b";
    else if (p40 >= 51 && p200 <= 10 && np) grupo = "A-3";
    else if (ll <= 40 && ip <= 10) grupo = "A-2-4";
    else if (ll > 40 && ip <= 10) grupo = "A-2-5";
    else if (ll <= 40 && ip > 10) { grupo = "A-2-6"; parcial = true; }
    else { grupo = "A-2-7"; parcial = true; }
  } else {
    if (ll <= 40 && ip <= 10) grupo = "A-4";
    else if (ll > 40 && ip <= 10) grupo = "A-5";
    else if (ll <= 40 && ip > 10) grupo = "A-6";
    else grupo = (ip <= ll - 30) ? "A-7-5" : "A-7-6";
  }
  let ig = 0;
  if (grupo.startsWith("A-4") || grupo.startsWith("A-5") || grupo.startsWith("A-6") || grupo.startsWith("A-7") || parcial) {
    const termino2 = 0.01 * (p200 - 15) * (ip - 10);
    ig = parcial ? termino2 : ((p200 - 35) * (0.2 + 0.005 * (ll - 40)) + termino2);
    ig = Math.max(0, Math.round(ig));
  }
  return { grupo, ig, texto: `${grupo}(${ig})` };
}

// -------------------------------------------------------------------
// CLASIFICACIÓN DEL SUELO (SUCS + AASHTO): necesita granulometría Y límites de Atterberg
// -------------------------------------------------------------------
function clasificarSuelo() {
  const g = GeoState.ensayos.granulometria, a = GeoState.ensayos.atterberg;
  if (!g.calculado) return { ok: false, motivo: "Falta calcular la Granulometría (Ensayo 04)." };
  if (!a.calculado) return { ok: false, motivo: "Falta calcular los Límites de Atterberg." };
  const np = !!a.np;
  if (!np && (a.ll === null || a.ip === null)) return { ok: false, motivo: "Se necesitan el Límite Líquido y el Límite Plástico (para el IP)." };
  const ll = np ? 0 : a.ll, ip = np ? 0 : Math.max(0, a.ip);

  // AASHTO
  const aashto = clasificarAASHTO(g.pasa10, g.pasa40, g.pasa200, ll, ip);

  // SUCS (ASTM D2487)
  const tipoFinos = () => { // M (limo), C (arcilla) o CM (zona rayada 4 ≤ IP ≤ 7)
    if (np) return "M";
    const lineaA = 0.73 * (ll - 20);
    if (ip < 4 || ip < lineaA) return "M";
    if (ip > 7) return "C";
    return "CM";
  };
  let sucs;
  if (g.finos >= 50) {
    if (np || ip <= 0) sucs = { simbolo: ll >= 50 ? "MH" : "ML", desc: "Limo no plástico" };
    else { const c = clasificarPlasticidad(ll, ip); sucs = { simbolo: c.grupo, desc: c.nombre }; }
  } else {
    const base = g.grava > g.arena ? "G" : "S";
    const nom = base === "G" ? "Grava" : "Arena";
    const t = tipoFinos();
    if (g.finos < 5) {
      const p = sucsPreliminarGranu(g.finos, g.grava, g.arena, g.cu, g.cc);
      sucs = { simbolo: p.simbolo, desc: p.desc };
    } else if (g.finos > 12) {
      const sim = t === "CM" ? `${base}C-${base}M` : `${base}${t}`;
      const d = t === "M" ? "limosa" : (t === "C" ? "arcillosa" : "arcillo-limosa");
      sucs = { simbolo: sim, desc: `${nom} ${d}` };
    } else {
      const p = sucsPreliminarGranu(0, g.grava, g.arena, g.cu, g.cc); // solo W/P (graduación)
      const w = p.simbolo.endsWith("W") ? "W" : "P";
      const f = t === "C" ? "C" : "M";
      sucs = { simbolo: `${base}${w}-${base}${f}`, desc: `${p.desc} con ${f === "C" ? "arcilla" : "limo"}` };
    }
  }
  return { ok: true, sucs, aashto, np, ll, ip };
}

// -------------------------------------------------------------------
// CÁLCULO DE GRANULOMETRÍA
// -------------------------------------------------------------------
function calcularGranulometria() {
  try {
    const compuesto = granuEsCompuesto();
    const obs = document.getElementById("granu-obs").value.trim();

    let m_total_sec = 0;       // masa seca total de la muestra
    let factor_k = 1.0;        // factor de homogenización K
    let perdida_lavado = 0;    // pérdida por lavado total (g, escala de la muestra completa)
    let porc_error = 0;
    let masa_lavada = 0;
    let items = [];
    let datosComp = null;
    let datosHumSimple = null;

    // ¿Hay masas retenidas? Si no, se trabaja con los porcentajes escritos a mano
    const hayMasas = ASTM_SIEVES.some(s => s.id !== 'mmo' &&
      ((granuNum(`granu-ret-${s.id}`) || 0) > 0 || (granuNum(`granu-ret2-${s.id}`) || 0) > 0));
    let modoPct = false;

    if (!hayMasas) {
      // ---------- MODO PORCENTAJES (el problema no da masas) ----------
      modoPct = true;
      let acum = 0, hayDato = false;
      ASTM_SIEVES.forEach(s => {
        const pp = granuNum(`granu-pp-${s.id}`), pa = granuNum(`granu-pa-${s.id}`), ps = granuNum(`granu-pasa-${s.id}`);
        let nuevo = acum;
        if (s.id === 'mmo') { /* sin masas no aplica */ }
        else if (ps !== null) { nuevo = 100 - ps; hayDato = true; }
        else if (pa !== null) { nuevo = pa; hayDato = true; }
        else if (pp !== null) { nuevo = acum + pp; hayDato = true; }
        if (nuevo < -0.001 || nuevo > 100.001) throw new Error(`Los porcentajes de ${s.nombre} están fuera de 0–100 %.`);
        if (nuevo + 0.01 < acum) throw new Error(`En ${s.nombre} el % acumulado retenido disminuye respecto al tamiz anterior: revise los porcentajes.`);
        items.push({
          id: s.id, nombre: s.nombre, abertura: s.abertura, desc: s.desc,
          m1: 0, m2: 0, retenido: 0, corregido: 0,
          porc_parcial: nuevo - acum, porc_acumulado: nuevo, porc_pasa: Math.max(0, 100 - nuevo)
        });
        acum = nuevo;
      });
      if (!hayDato) throw new Error("Ingrese las masas retenidas o, si el problema solo da porcentajes, complete al menos una columna de % (parcial, acumulado o que pasa).");
    } else if (compuesto) {
      // ---------- TAMIZADO COMPUESTO (Parte Gruesa + Parte Fina) ----------
      const mCgHum = granuNum("sec-g1-masa") || granuNum("granu-hdr-masa-gruesa");
      const mCgSec = granuNum("sec-g2-masa");
      if (!mCgSec || mCgSec <= 0) throw new Error("Ingrese la Masa Seca de la Parte Gruesa en 'Control de Secado' (> 0).");
      const mCgLav = granuNum("sec-g3-masa") || mCgSec;

      const mFgSubHum = granuNum("sec-f1-masa");
      const mFgSubSec = granuNum("sec-f2-masa");
      if (!mFgSubSec || mFgSubSec <= 0) throw new Error("Ingrese la Masa Seca de la Submuestra Fina (Mo) en 'Control de Secado' (> 0).");
      if (!mFgSubHum || mFgSubHum < mFgSubSec) throw new Error("Ingrese la Masa Húmeda de la Submuestra Fina (mayor o igual a la seca) para que el programa halle la humedad.");
      const mFgSubLav = granuNum("sec-f3-masa") || mFgSubSec;

      // Humedades calculadas por el programa: w = (masa húmeda − masa seca) / masa seca
      // (se reporta a 0.1 %, como en la hoja de laboratorio)
      const r1 = v => Math.round(v * 10) / 10;
      const humFina = r1(((mFgSubHum - mFgSubSec) / mFgSubSec) * 100);
      const humGruesa = mCgHum ? r1(((mCgHum - mCgSec) / mCgSec) * 100) : null;

      // Masa húmeda de toda la parte fina → masa seca con la humedad hallada
      let mFgHum = granuNum("granu-hdr-masa-fina");
      if (!mFgHum) {
        const mTotH = granuNum("granu-hdr-masa-total");
        if (mTotH && mCgHum) mFgHum = mTotH - mCgHum;
      }
      if (!mFgHum || mFgHum <= 0) throw new Error("Ingrese la Masa Parte Fina (húmeda) en 'Datos del Ensayo' (o la Masa Total y la masa húmeda gruesa).");
      const mFgSecTotal = mFgHum / (1 + humFina / 100);
      m_total_sec = mCgSec + mFgSecTotal;
      const humTotal = (((mCgHum || mCgSec) + mFgHum - m_total_sec) / m_total_sec) * 100;

      const perdCg = Math.max(0, mCgSec - mCgLav);
      const perdFg = Math.max(0, mFgSubSec - mFgSubLav);

      // 1er paso: valores crudos de cada tamiz
      const crudos = ASTM_SIEVES.map(s => {
        let v1 = granuNum(`granu-ret-${s.id}`) || 0;
        let v2 = granuNum(`granu-ret2-${s.id}`) || 0;
        if (s.id === 'mmo') { v1 = perdCg; v2 = perdFg; }
        if (v1 < 0 || v2 < 0) throw new Error(`Las masas retenidas en ${s.nombre} no pueden ser negativas.`);
        return { s, v1, v2 };
      });

      // Zona fina = malla N°10 (2.00 mm) y más finas + platillo. Lo que la parte gruesa dejó ahí
      // (columna 1) es "platillo de la columna 1": no se pesa como grueso, entra al numerador de K.
      const esZonaFina = s => s.abertura <= 2.0 + 1e-9 || s.id === 'pan';
      const platilloM1 = crudos.reduce((a, c) => a + ((c.s.id !== 'mmo' && esZonaFina(c.s)) ? c.v1 : 0), 0);
      const sumaCol2 = crudos.reduce((a, c) => a + c.v2, 0); // incluye M-Mo de la columna 2
      // K = (masa seca fina total + platillo col.1 + M-Mo col.1) / Σ de toda la columna 2
      factor_k = (mFgSecTotal + platilloM1 + perdCg) / (sumaCol2 > 0 ? sumaCol2 : mFgSubSec);

      // 2do paso: masa única (homogenizada) y porcentajes
      let acum = 0, sumaM1 = 0, sumaM2 = 0, sumaEq = 0;
      crudos.forEach(({ s, v1, v2 }) => {
        if (s.id !== 'mmo') { sumaM1 += v1; sumaM2 += v2; }
        const mEq = (s.id === 'mmo' || esZonaFina(s)) ? v2 * factor_k : v1 + v2 * factor_k;
        sumaEq += mEq;
        const parcial = m_total_sec > 0 ? (mEq / m_total_sec) * 100 : 0;
        acum += parcial;
        items.push({
          id: s.id, nombre: s.nombre, abertura: s.abertura, desc: s.desc,
          m1: v1, m2: v2, retenido: mEq, corregido: mEq,
          porc_parcial: parcial, porc_acumulado: acum, porc_pasa: Math.max(0, 100 - acum)
        });
      });

      const errCg = Math.abs(mCgSec - (sumaM1 + perdCg)) / mCgSec * 100;
      const errFg = Math.abs(mFgSubSec - (sumaM2 + perdFg)) / mFgSubSec * 100;
      porc_error = Math.max(errCg, errFg);
      perdida_lavado = perdCg + perdFg * factor_k;
      masa_lavada = m_total_sec - perdida_lavado;
      datosComp = {
        humedad: humFina, humedad_fina: humFina, humedad_gruesa: humGruesa, humedad_total: humTotal, masa_seca_gruesa: mCgSec, masa_seca_fina_total: mFgSecTotal, masa_seca_submuestra: mFgSubSec,
        platillo_m1: platilloM1, perdida_gruesa: perdCg, perdida_fina: perdFg, err_gruesa: errCg, err_fina: errFg,
        suma_eq: sumaEq
      };
    } else {
      // ---------- TAMIZADO SIMPLE (muestra única) — igual que Suelos_1.py ----------
      const gh = granuNum("sec-g1-masa"), gs = granuNum("sec-g2-masa");
      const masaSeca = granuNum("granu-masa-total") || gs;
      if (!masaSeca || masaSeca <= 0) throw new Error("Ingrese la Masa Seca Total (o la masa seca en 'Control de Secado').");
      if (gh && gs && gh >= gs) datosHumSimple = { humedad_gruesa: ((gh - gs) / gs) * 100 };

      m_total_sec = masaSeca;
      const w0 = granuNum("granu-masa-lavada");
      masa_lavada = (w0 && w0 > 0 && w0 <= masaSeca) ? w0 : masaSeca;
      perdida_lavado = masaSeca - masa_lavada;

      let suma = 0, acum = 0;
      ASTM_SIEVES.forEach(s => {
        const m1 = s.id === 'mmo' ? 0 : Math.max(0, granuNum(`granu-ret-${s.id}`) || 0);
        const m2 = s.id === 'mmo' ? 0 : Math.max(0, granuNum(`granu-ret2-${s.id}`) || 0);
        const ret = m1 + m2;
        suma += ret;
        const parcial = (ret / masaSeca) * 100.0;
        acum += parcial;
        items.push({
          id: s.id, nombre: s.nombre, abertura: s.abertura, desc: s.desc,
          m1, m2, retenido: ret, corregido: ret,
          porc_parcial: parcial, porc_acumulado: acum, porc_pasa: Math.max(0, 100 - acum)
        });
      });
      // Error de tamizado: |masa seca − Σ(M1+M2)| / masa seca (criterio ≤ 1 %)
      porc_error = Math.abs(masaSeca - suma) / masaSeca * 100.0;
    }

    const suma_retenido = items.reduce((a, t) => a + t.corregido, 0);
    const error_gramos = modoPct ? 0 : m_total_sec - suma_retenido;
    const porc_perdida_lavado = m_total_sec > 0 ? (perdida_lavado / m_total_sec) * 100.0 : 0;

    // ---------- Fracciones (ASTM D2487) ----------
    const pasa = id => { const t = items.find(x => x.id === id); return t ? t.porc_pasa : 0; };
    const pasa4 = pasa('n4'), pasa10 = pasa('n10'), pasa40 = pasa('n40'), pasa200 = pasa('n200');
    const grava = Math.max(0, 100.0 - pasa4);
    const arena = Math.max(0, pasa4 - pasa200);
    const finos = Math.max(0, pasa200);

    // ---------- D10, D30, D60, D85 por interpolación logarítmica ----------
    const puntosCurva = items.filter(t => t.abertura > 0).sort((a, b) => b.abertura - a.abertura);
    function findDiameter(pctTarget) {
      for (let i = 0; i < puntosCurva.length - 1; i++) {
        const p1 = puntosCurva[i], p2 = puntosCurva[i + 1];
        if ((p1.porc_pasa >= pctTarget && p2.porc_pasa <= pctTarget) ||
          (p1.porc_pasa <= pctTarget && p2.porc_pasa >= pctTarget)) {
          if (p1.porc_pasa === p2.porc_pasa) return p1.abertura;
          if (p1.abertura <= 0 || p2.abertura <= 0) return null;
          const l1 = Math.log10(p1.abertura), l2 = Math.log10(p2.abertura);
          return Math.pow(10, l1 + ((pctTarget - p1.porc_pasa) / (p2.porc_pasa - p1.porc_pasa)) * (l2 - l1));
        }
      }
      return null;
    }
    const d10 = finos <= 10.0 ? findDiameter(10.0) : null;
    const d30 = findDiameter(30.0);
    const d60 = findDiameter(60.0);
    const d85 = findDiameter(85.0);
    const cu = (d60 && d10 && d10 > 0) ? (d60 / d10) : null;
    const cc = (d30 && d10 && d60 && d10 > 0 && d60 > 0) ? (Math.pow(d30, 2) / (d10 * d60)) : null;

    GeoState.ensayos.granulometria = {
      calculado: true,
      metodo: modoPct ? "porcentajes" : (compuesto ? "compuesto" : "simple"),
      modo: modoPct ? "porcentajes" : "masas",
      masa_total: m_total_sec,
      masa_lavada,
      perdida_lavado,
      porc_perdida_lavado,
      tamices: items,
      suma_retenido,
      error_gramos,
      porc_error,
      grava, arena, finos,
      pasa10, pasa40, pasa200,
      d10, d30, d60, d85, cu, cc,
      observaciones: obs,
      factor_k,
      comp: datosComp,
      hum_simple: datosHumSimple,
      encabezado: capturarEncabezadoGranu()
    };

    sincronizarEncabezadoGranuAProyecto(GeoState.ensayos.granulometria.encabezado);
    renderResultadosGranulometria();
    updateDashboardLab2Summary();
    showToast(`Granulometría calculada: ${grava.toFixed(1)} % grava • ${arena.toFixed(1)} % arena • ${finos.toFixed(1)} % finos`);

  } catch (err) {
    alert("Error en datos de Granulometría:\n" + err.message);
  }
}

function renderResultadosGranulometria() {
  const g = GeoState.ensayos.granulometria;
  if (!g.calculado) return;

  document.getElementById("granu-results-placeholder").classList.add("hidden");
  document.getElementById("granu-results-content").classList.remove("hidden");

  document.getElementById("granu-res-grava").textContent = `${g.grava.toFixed(2)} %`;
  document.getElementById("granu-res-arena").textContent = `${g.arena.toFixed(2)} %`;
  document.getElementById("granu-res-finos").textContent = `${g.finos.toFixed(2)} %`;

  const d10Str = g.d10 ? `D10: ${g.d10.toFixed(3)} mm` : (g.finos > 10 ? 'D10: < 0.075' : 'D10: —');
  const d30Str = g.d30 ? `D30: ${g.d30.toFixed(3)} mm` : 'D30: —';
  const d60Str = g.d60 ? `D60: ${g.d60.toFixed(3)} mm` : 'D60: —';
  const d85Str = g.d85 ? `D85: ${g.d85.toFixed(3)} mm` : 'D85: —';
  document.getElementById("granu-res-d-values").textContent = `${d10Str} • ${d30Str} • ${d60Str}`;
  document.getElementById("granu-res-d85").textContent = d85Str;

  const cuStr = g.cu ? `Cu = ${g.cu.toFixed(2)}` : 'Cu = —';
  const ccStr = g.cc ? `Cc = ${g.cc.toFixed(2)}` : 'Cc = —';
  document.getElementById("granu-res-cu-cc").textContent = `${cuStr} | ${ccStr}`;

  let evalGrad = "Gradación por evaluar";
  if (g.cu && g.cc) {
    if ((g.grava > g.arena && g.cu >= 4 && g.cc >= 1 && g.cc <= 3) ||
      (g.arena >= g.grava && g.cu >= 6 && g.cc >= 1 && g.cc <= 3)) {
      evalGrad = "✅ Suelo bien graduado (buena distribución)";
    } else {
      evalGrad = "⚠️ Suelo pobremente / uniformemente graduado";
    }
  }
  document.getElementById("granu-res-gradacion-eval").textContent = evalGrad;

  // Sub-fracciones de arena, factor K y AASHTO
  const setT = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  setT("granu-res-k", g.metodo === "compuesto" ? `K = ${g.factor_k.toFixed(4)}` : (g.modo === "porcentajes" ? "—" : "K = 1.0000"));
  setT("granu-res-k-sub", g.metodo === "compuesto" ? `Masa seca total: ${g.masa_total.toFixed(1)} g` : (g.modo === "porcentajes" ? "Datos ingresados como porcentajes" : "Método simple (sin homogenización)"));
  const hc = g.comp;
  if (g.metodo === "compuesto" && hc) {
    setT("granu-res-hum", `Fina ${hc.humedad_fina.toFixed(2)} % • Gruesa ${hc.humedad_gruesa !== null ? hc.humedad_gruesa.toFixed(2) + " %" : "—"}`);
    setT("granu-res-hum-sub", `Total de la muestra: ${hc.humedad_total.toFixed(2)} %`);
  } else if (g.hum_simple) {
    setT("granu-res-hum", `${g.hum_simple.humedad_gruesa.toFixed(2)} %`);
    setT("granu-res-hum-sub", "De la masa húmeda y seca del Control de Secado");
  } else {
    setT("granu-res-hum", "—");
    setT("granu-res-hum-sub", "Se calcula con el Control de Secado");
  }

  const errOk = g.porc_error <= 1.0;
  const errStatus = errOk ? '✅ Conforme (≤ 1.0%)' : '⚠️ No conforme (> 1.0%)';
  const detalle = g.comp
    ? ` (gruesa ${g.comp.err_gruesa.toFixed(2)} % • fina ${g.comp.err_fina.toFixed(2)} %)`
    : ` (${g.error_gramos.toFixed(2)} g)`;
  if (g.modo === "porcentajes") {
    document.getElementById("granu-res-error-text").textContent =
      "Datos ingresados directamente como porcentajes (sin masas): no hay balance de masas ni error de tamizado.";
  } else document.getElementById("granu-res-error-text").textContent =
    `ΔError = ${g.porc_error.toFixed(2)} %${detalle} • Σ masa homogenizada: ${g.suma_retenido.toFixed(2)} g • Tolerancia ASTM D6913: ${errStatus}`;

  const tbody = document.getElementById("tbody-granu-breakdown");
  tbody.innerHTML = "";
  g.tamices.forEach(t => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${t.nombre}</strong></td>
      <td class="font-mono text-center">${t.abertura > 0 ? t.abertura.toFixed(3) : '—'}</td>
      <td class="font-mono text-right">${t.m1 > 0 ? t.m1.toFixed(2) : '—'}</td>
      <td class="font-mono text-right">${t.m2 > 0 ? t.m2.toFixed(2) : '—'}</td>
      <td class="font-mono text-right font-bold">${g.modo === "porcentajes" ? '—' : t.corregido.toFixed(2)}</td>
      <td class="font-mono text-right">${t.porc_parcial.toFixed(2)} %</td>
      <td class="font-mono text-right">${t.porc_acumulado.toFixed(2)} %</td>
      <td class="font-mono text-right font-bold text-primary">${t.porc_pasa.toFixed(2)} %</td>
    `;
    tbody.appendChild(tr);

    // Reflejar los % también en la tabla de entrada de tamices (como el formato)
    // M - Mo se autocalcula en compuesto: mostrarlo en las celdas de entrada
    if (t.id === 'mmo') {
      const a = document.getElementById("granu-ret-mmo");
      const b = document.getElementById("granu-ret2-mmo");
      if (a) a.value = g.metodo === "compuesto" ? t.m1.toFixed(2) : "";
      if (b) b.value = g.metodo === "compuesto" ? t.m2.toFixed(2) : "";
    }
  });

  renderGraficoGranulometria(g.tamices);
}

// Decoración de la curva (como en el programa de escritorio): zonas y guías D10/D30/D60
const granuDecorPlugin = {
  id: 'granuDecor',
  afterDatasetsDraw(chart) {
    const g = GeoState.ensayos.granulometria;
    if (!g.calculado) return;
    const { ctx, chartArea, scales } = chart;
    const { left, right, top, bottom, height } = chartArea;
    const sx = scales.x, sy = scales.y;
    const px = v => Math.min(right, Math.max(left, sx.getPixelForValue(v)));
    ctx.save();

    // Zonas del suelo (franja superior)
    const zh = Math.max(15, height * 0.07);
    const zonas = [
      [75, 4.75, `GRAVA (${g.grava.toFixed(1)}%)`, '#FEF3C7', '#92400E'],
      [4.75, 2.0, 'A. Gruesa', '#D1FAE5', '#065F46'],
      [2.0, 0.425, 'A. Media', '#A7F3D0', '#065F46'],
      [0.425, 0.075, 'A. Fina', '#6EE7B7', '#065F46'],
      [0.075, 0.01, `FINOS (${g.finos.toFixed(1)}%)`, '#EDE9FE', '#5B21B6']
    ];
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    zonas.forEach(([a, b, txt, bg, fg]) => {
      const xa = px(a), xb = px(b), x0 = Math.min(xa, xb), w = Math.abs(xb - xa);
      ctx.fillStyle = bg; ctx.fillRect(x0, top, w, zh);
      ctx.fillStyle = fg; ctx.font = 'bold 10px Inter, Arial, sans-serif';
      if (w > 26) ctx.fillText(txt, x0 + w / 2, top + zh / 2, w - 4);
    });

    // Divisorias verticales
    ctx.setLineDash([2, 3]); ctx.strokeStyle = '#94A3B8'; ctx.lineWidth = 1;
    [4.75, 2.0, 0.425, 0.075].forEach(v => {
      const x = px(v); ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bottom); ctx.stroke();
    });

    // Guías D60, D30, D10
    ctx.setLineDash([5, 4]); ctx.lineWidth = 1.2;
    [[g.d60, 60, '#DC2626', 'D60'], [g.d30, 30, '#D97706', 'D30'], [g.d10, 10, '#2563EB', 'D10']].forEach(([d, p, col, lab]) => {
      if (!d || d <= 0) return;
      const x = px(d), y = sy.getPixelForValue(p);
      ctx.strokeStyle = col; ctx.fillStyle = col;
      ctx.beginPath(); ctx.moveTo(x, bottom); ctx.lineTo(x, y); ctx.lineTo(left, y); ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.font = 'bold 10px Inter, Arial, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      const tx = Math.min(right - 40, Math.max(left + 40, x)), tt = `${lab}=${d.toFixed(2)}mm`, tw = ctx.measureText(tt).width;
      ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fillRect(tx - tw / 2 - 2, y - 20, tw + 4, 13);
      ctx.fillStyle = col; ctx.fillText(tt, tx, y - 7);
      ctx.setLineDash([5, 4]);
    });
    ctx.setLineDash([]);

    ctx.restore();
  }
};

function renderGraficoGranulometria(puntos) {
  const canvas = document.getElementById("granu-chart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (granuChartInstance) {
    granuChartInstance.destroy();
  }

  const dataPoints = puntos
    .filter(p => p.abertura > 0)
    .sort((a, b) => b.abertura - a.abertura)
    .map(p => ({ x: p.abertura, y: p.porc_pasa, name: p.nombre }));

  granuChartInstance = new Chart(ctx, {
    type: 'line',
    plugins: [granuDecorPlugin],
    data: {
      datasets: [{
        label: '% Que Pasa (ASTM D6913)',
        data: dataPoints,
        borderColor: '#1565c0',
        backgroundColor: 'rgba(21, 101, 192, 0.1)',
        borderWidth: 2.5,
        pointBackgroundColor: '#b71c1c',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1.5,
        pointRadius: 4.5,
        pointHoverRadius: 7,
        fill: false,
        tension: 0.15
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      scales: {
        x: {
          type: 'logarithmic',
          min: 0.01,
          max: 100,
          reverse: true,
          title: {
            display: true,
            text: 'Abertura del Tamiz (mm) [Escala Logarítmica]',
            font: { weight: 'bold', size: 12 }
          },
          grid: {
            color: '#e2e8f0'
          }
        },
        y: {
          min: 0,
          max: 100,
          title: {
            display: true,
            text: 'Porcentaje Acumulado Que Pasa (%)',
            font: { weight: 'bold', size: 12 }
          },
          ticks: {
            stepSize: 10
          },
          grid: {
            color: '#e2e8f0'
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const pt = context.raw;
              return `${pt.name || ''}: Abertura = ${pt.x.toFixed(3)} mm | Pasa = ${pt.y.toFixed(2)} %`;
            }
          }
        }
      }
    }
  });
}

function limpiarGranulometria() {
  document.getElementById("granu-masa-total").value = "";
  document.getElementById("granu-masa-lavada").value = "";
  document.getElementById("granu-obs").value = "";

  // Datos del ensayo + control de secado
  ["granu-hdr-tecnico", "granu-hdr-informe", "granu-hdr-calicata", "granu-hdr-fecha", "granu-hdr-muestra",
    "granu-hdr-profundidad", "granu-hdr-horno", "granu-hdr-balanza", "granu-hdr-masa-total",
    "granu-hdr-masa-recipiente", "granu-hdr-masa-gruesa", "granu-hdr-masa-fina"]
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
  ["g1", "g2", "g3", "f1", "f2", "f3"].forEach(k => {
    ["fecha", "hora", "masa"].forEach(c => { const el = document.getElementById(`sec-${k}-${c}`); if (el) el.value = ""; });
  });
  const metDefault = document.querySelector('input[name="granu-metodo"][value="a-compuesto"]');
  if (metDefault) metDefault.checked = true;
  aplicarMetodoGranu();

  ASTM_SIEVES.forEach(s => {
    const input = document.getElementById(`granu-ret-${s.id}`);
    if (input) input.value = "";
    const input2 = document.getElementById(`granu-ret2-${s.id}`);
    if (input2) input2.value = "";
    ["granu-pp-", "granu-pa-", "granu-pasa-"].forEach(pfx => {
      const c = document.getElementById(pfx + s.id);
      if (c) c.value = "";
    });
  });

  const perdidaEl = document.getElementById("granu-live-perdida");
  if (perdidaEl) perdidaEl.textContent = "0.00 g (0.00 %)";

  GeoState.ensayos.granulometria.calculado = false;
  document.getElementById("granu-results-content").classList.add("hidden");
  document.getElementById("granu-results-placeholder").classList.remove("hidden");

  if (granuChartInstance) {
    granuChartInstance.destroy();
    granuChartInstance = null;
  }

  updateDashboardLab2Summary();
  showToast("Datos de granulometría reiniciados.");
}

function cargarDemoGranuSimple() {
  const radio = document.querySelector('input[name="granu-metodo"][value="a-simple"]');
  if (radio) radio.checked = true;
  aplicarMetodoGranu();

  document.getElementById("granu-masa-total").value = "2708.00";
  document.getElementById("granu-masa-lavada").value = "";

  const demoRetenidos = {
    '3in': '0.00',
    '2in': '233.10',
    '1_5in': '346.80',
    '1in': '517.50',
    '3_4in': '289.30',
    '1_2in': '46.50',
    '3_8in': '22.20',
    '1_4in': '195.00',
    'n4': '121.50',
    'n10': '342.10',
    'n20': '171.60',
    'n30': '32.60',
    'n40': '42.50',
    'n60': '61.10',
    'n100': '78.30',
    'n140': '0.00',
    'n200': '199.60',
    'pan': '6.60'
  };

  ASTM_SIEVES.forEach(s => {
    const input = document.getElementById(`granu-ret-${s.id}`);
    if (input) input.value = s.id === 'mmo' ? "" : (demoRetenidos[s.id] || '0.00');
    const input2 = document.getElementById(`granu-ret2-${s.id}`);
    if (input2) input2.value = "";
  });

  const perdidaEl = document.getElementById("granu-live-perdida");
  if (perdidaEl) perdidaEl.textContent = "0.00 g (0.00 %)";

  document.getElementById("granu-obs").value = "Muestra ensayada por Tamizado Simple con lavado en malla N°200 según Norma ASTM D6913 / NTP 339.128.";
  calcularGranulometria();
}

// Datos EXACTOS del formato UNI FIC AT-PR.4-F1 (Calicata C-1, Muestra M-1)
function cargarDemoGranuCompuesto() {
  const radio = document.querySelector('input[name="granu-metodo"][value="a-compuesto"]');
  if (radio) radio.checked = true;
  aplicarMetodoGranu();

  const setV = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
  setV("granu-hdr-calicata", "C-1");
  setV("granu-hdr-muestra", "M-1");
  setV("granu-hdr-profundidad", "15.60");
  setV("granu-hdr-fecha", "2026-10-12");
  setV("granu-hdr-horno", "HR-3");
  setV("granu-hdr-balanza", "BL-18 y BL-8");
  setV("granu-hdr-masa-total", "25939");
  setV("granu-hdr-masa-recipiente", "1490 (BNS-44) / 123.3 (R-12)");
  setV("granu-hdr-masa-gruesa", "19703");
  setV("granu-hdr-masa-fina", "6236");

  // Control de secado (parte gruesa y fina)
  const sec = {
    g1: ["2026-10-12", "17:00", "19703"], g2: ["2026-10-13", "09:45", "19541"], g3: ["2026-10-14", "08:25", "19491"],
    f1: ["2026-10-12", "17:01", "639.5"], f2: ["2026-10-13", "09:46", "623.3"], f3: ["2026-10-14", "08:26", "581.3"]
  };
  Object.entries(sec).forEach(([k, [f, h, m]]) => {
    setV(`sec-${k}-fecha`, f); setV(`sec-${k}-hora`, h); setV(`sec-${k}-masa`, m);
  });

  // Tamices: M-1 (gruesa) y M-2 (fina)
  const m1 = { '2in': 3536, '1_5in': 4670, '1in': 4734, '3_4in': 1855, '1_2in': 2109, '3_8in': 1061, '1_4in': 1046, 'n4': 459, 'n10': 21 };
  const m2 = { 'n10': 88.1, 'n20': 37.2, 'n30': 39.1, 'n40': 87.3, 'n60': 168.9, 'n100': 107.4, 'n140': 37.2, 'n200': 15.8, 'pan': 0.3 };
  ASTM_SIEVES.forEach(s => {
    setV(`granu-ret-${s.id}`, m1[s.id] !== undefined ? m1[s.id] : "");
    setV(`granu-ret2-${s.id}`, m2[s.id] !== undefined ? m2[s.id] : "");
  });

  document.getElementById("granu-obs").value = "Análisis granulométrico según ASTM D6913 / D6913M (Método A, Tamizado Compuesto). Lavado de finos por tamiz N°200 según ASTM D1140.";
  calcularGranulometria();
}

// ===================================================================
// 9B. LÓGICA DE ENSAYO 05: LÍMITES DE ATTERBERG (ASTM D4318 / NTP 339.129)
// ===================================================================
let attChartInstance = null;
const ATT_LL_ROWS = 4;
const ATT_LP_ROWS = 2;

const numById = id => {
  const el = document.getElementById(id);
  if (!el || el.value === "") return null;
  const v = parseFloat(el.value);
  return isNaN(v) ? null : v;
};

function initAtterbergEvents() {
  let llHtml = "";
  for (let i = 1; i <= ATT_LL_ROWS; i++) {
    llHtml += `
      <tr>
        <td class="text-center font-bold text-accent">${i}</td>
        <td><input type="number" step="1" min="1" class="input-control font-mono" id="att-ll-${i}-golpes" placeholder="${[32, 26, 21, 16][i - 1]}"></td>
        <td><input type="number" step="0.01" class="input-control font-mono" id="att-ll-${i}-mh" placeholder="0.00"></td>
        <td><input type="number" step="0.01" class="input-control font-mono" id="att-ll-${i}-ms" placeholder="0.00"></td>
        <td><input type="number" step="0.01" class="input-control font-mono" id="att-ll-${i}-cap" placeholder="0.00"></td>
      </tr>`;
  }
  document.getElementById("tbody-att-ll-inputs").innerHTML = llHtml;

  let lpHtml = "";
  for (let i = 1; i <= ATT_LP_ROWS; i++) {
    lpHtml += `
      <tr>
        <td class="text-center font-bold text-accent">${i}</td>
        <td><input type="number" step="0.01" class="input-control font-mono" id="att-lp-${i}-mh" placeholder="0.00"></td>
        <td><input type="number" step="0.01" class="input-control font-mono" id="att-lp-${i}-ms" placeholder="0.00"></td>
        <td><input type="number" step="0.01" class="input-control font-mono" id="att-lp-${i}-cap" placeholder="0.00"></td>
      </tr>`;
  }
  document.getElementById("tbody-att-lp-inputs").innerHTML = lpHtml;

  document.getElementById("att-np").addEventListener("change", toggleAtterbergNP);
  document.getElementById("btn-calcular-att").addEventListener("click", calcularAtterberg);
  document.getElementById("btn-limpiar-att").addEventListener("click", limpiarAtterberg);
  document.getElementById("btn-fill-demo-att").addEventListener("click", cargarDemoAtterberg);
  document.getElementById("btn-exportar-pdf-att").addEventListener("click", () => {
    if (!GeoState.ensayos.atterberg.calculado) {
      alert("Para exportar el informe en PDF, primero ingrese los datos y presione '⚡ Calcular Límites'.");
      return;
    }
    generarPDFIndividual("atterberg");
  });
}

function toggleAtterbergNP() {
  const np = document.getElementById("att-np").checked;
  document.querySelectorAll("#att-form-fields input.input-control").forEach(i => { i.disabled = np; });
}

// Regresión lineal  w = m·log10(N) + b
function regresionLineal(xs, ys) {
  const n = xs.length;
  const sx = xs.reduce((a, v) => a + v, 0), sy = ys.reduce((a, v) => a + v, 0);
  const sxx = xs.reduce((a, v) => a + v * v, 0);
  const sxy = xs.reduce((a, v, i) => a + v * ys[i], 0);
  const den = n * sxx - sx * sx;
  const m = den === 0 ? 0 : (n * sxy - sx * sy) / den;
  const b = den === 0 ? sy / n : (sy - m * sx) / n;
  const ym = sy / n;
  const ssTot = ys.reduce((a, v) => a + (v - ym) * (v - ym), 0);
  const ssRes = ys.reduce((a, v, i) => a + Math.pow(v - (m * xs[i] + b), 2), 0);
  const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;
  return { m, b, r2 };
}

// Clasificación de plasticidad (carta de Casagrande, línea A: IP = 0.73·(LL − 20))
function clasificarPlasticidad(ll, ip) {
  const lineaA = 0.73 * (ll - 20);
  let grupo;
  if (ip >= 4 && ip <= 7 && ip >= lineaA) grupo = "CL-ML";
  else if (ip >= lineaA) grupo = ll < 50 ? "CL" : "CH";
  else grupo = ll < 50 ? "ML" : "MH";
  const nombre = { "CL": "Arcilla de baja plasticidad", "CH": "Arcilla de alta plasticidad", "ML": "Limo de baja plasticidad", "MH": "Limo de alta plasticidad", "CL-ML": "Limo arcilloso" }[grupo];
  let nivel;
  if (ip < 7) nivel = "Baja plasticidad";
  else if (ip <= 17) nivel = "Plasticidad media";
  else nivel = "Alta plasticidad";
  return { grupo, nombre, nivel };
}

function calcularAtterberg() {
  try {
    const obs = document.getElementById("att-obs").value.trim();
    const a = GeoState.ensayos.atterberg;

    if (document.getElementById("att-np").checked) {
      GeoState.ensayos.atterberg = {
        calculado: true, np: true, ll: null, lp: null, ip: null, lc: null,
        ll_pts: [], lp_pts: [], m: null, b: null, r2: null, clase: null, observaciones: obs
      };
      renderResultadosAtterberg();
      updateDashboardAtterbergSummary();
      refrescarClasificacionGranu();
      showToast("Suelo No Plástico (NP) registrado.");
      return;
    }

    // --- Límite Líquido ---
    const llPts = [];
    for (let i = 1; i <= ATT_LL_ROWS; i++) {
      const g = numById(`att-ll-${i}-golpes`), mh = numById(`att-ll-${i}-mh`), ms = numById(`att-ll-${i}-ms`), cap = numById(`att-ll-${i}-cap`);
      if (g === null && mh === null && ms === null && cap === null) continue;
      if (g === null || mh === null || ms === null || cap === null) throw new Error(`Complete todos los datos de la prueba ${i} del Límite Líquido.`);
      if (g <= 0) throw new Error(`El N° de golpes de la prueba ${i} debe ser mayor a 0.`);
      const mSeco = ms - cap;
      if (mSeco <= 0) throw new Error(`En la prueba ${i} del LL, la masa seca + recipiente debe ser mayor que el recipiente.`);
      if (mh < ms) throw new Error(`En la prueba ${i} del LL, la masa húmeda + recipiente no puede ser menor que la seca.`);
      llPts.push({ n: i, golpes: g, mw: mh - ms, msuelo: mSeco, w: ((mh - ms) / mSeco) * 100 });
    }

    // --- Límite Plástico ---
    const lpPts = [];
    for (let i = 1; i <= ATT_LP_ROWS; i++) {
      const mh = numById(`att-lp-${i}-mh`), ms = numById(`att-lp-${i}-ms`), cap = numById(`att-lp-${i}-cap`);
      if (mh === null && ms === null && cap === null) continue;
      if (mh === null || ms === null || cap === null) throw new Error(`Complete todos los datos de la prueba ${i} del Límite Plástico.`);
      const mSeco = ms - cap;
      if (mSeco <= 0) throw new Error(`En la prueba ${i} del LP, la masa seca + recipiente debe ser mayor que el recipiente.`);
      if (mh < ms) throw new Error(`En la prueba ${i} del LP, la masa húmeda + recipiente no puede ser menor que la seca.`);
      lpPts.push({ n: i, mw: mh - ms, msuelo: mSeco, w: ((mh - ms) / mSeco) * 100 });
    }

    // --- Límite de Contracción (opcional) ---
    let lc = null;
    const vh = numById("att-lc-vh"), mhc = numById("att-lc-mhc"), msc = numById("att-lc-msc"), mc = numById("att-lc-mc"), vs = numById("att-lc-vs");
    if (vh !== null && mhc !== null && msc !== null && mc !== null && vs !== null) {
      const ms = msc - mc;
      if (ms <= 0) throw new Error("En el Límite de Contracción, la masa seca + recipiente debe ser mayor que el recipiente.");
      const winic = ((mhc - msc) / ms) * 100;
      lc = winic - ((vh - vs) / ms) * 100;
    }

    if (llPts.length < 2 && lpPts.length === 0 && lc === null) {
      throw new Error("Ingrese al menos 2 pruebas del Límite Líquido y/o el Límite Plástico.");
    }

    let ll = null, m = null, b = null, r2 = null;
    if (llPts.length >= 2) {
      const reg = regresionLineal(llPts.map(p => Math.log10(p.golpes)), llPts.map(p => p.w));
      m = reg.m; b = reg.b; r2 = reg.r2;
      ll = m * Math.log10(25) + b;
    }
    const lp = lpPts.length ? lpPts.reduce((s, p) => s + p.w, 0) / lpPts.length : null;
    const ip = (ll !== null && lp !== null) ? ll - lp : null;
    const clase = (ll !== null && ip !== null && ip > 0) ? clasificarPlasticidad(ll, ip) : null;

    GeoState.ensayos.atterberg = {
      calculado: true, np: false, ll, lp, ip, lc,
      ll_pts: llPts, lp_pts: lpPts, m, b, r2, clase, observaciones: obs
    };

    renderResultadosAtterberg();
    updateDashboardAtterbergSummary();
    refrescarClasificacionGranu();
    showToast(ll !== null ? `Límites calculados: LL = ${ll.toFixed(1)} %${ip !== null ? ` • IP = ${ip.toFixed(1)} %` : ""}` : "Límites calculados.");
  } catch (err) {
    alert("Error en datos de Límites de Atterberg:\n" + err.message);
  }
}

// Vuelve a mostrar la clasificación (se llama también al recalcular la granulometría)
function refrescarClasificacionGranu() {
  if (GeoState.ensayos.atterberg.calculado) renderResultadosAtterberg();
  updateDashboardAtterbergSummary();
}

function renderResultadosAtterberg() {
  const a = GeoState.ensayos.atterberg;
  if (!a.calculado) return;
  document.getElementById("att-results-placeholder").classList.add("hidden");
  document.getElementById("att-results-content").classList.remove("hidden");

  const fmt = (v, d = 2) => (v === null || v === undefined) ? "—" : `${v.toFixed(d)} %`;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };

  const cl = clasificarSuelo();
  set("att-res-sucs", cl.ok ? cl.sucs.simbolo : "—");
  set("att-res-sucs-desc", cl.ok ? cl.sucs.desc : "Requiere granulometría");
  set("att-res-aashto", cl.ok ? cl.aashto.texto : "—");
  set("att-res-aashto-desc", cl.ok ? `Grupo ${cl.aashto.grupo} • IG = ${cl.aashto.ig}` : "Requiere granulometría");
  set("att-res-clasif-nota", cl.ok ? "Clasificación obtenida con la granulometría (Ensayo 04) y estos límites." : `⚠️ ${cl.motivo}`);

  if (a.np) {
    ["att-res-ll", "att-res-lp", "att-res-ip", "att-res-lc"].forEach(id => set(id, "NP"));
    set("att-res-class", "NP");
    set("att-res-class-desc", "Suelo No Plástico");
    set("att-res-eq", "—");
    document.getElementById("tbody-att-ll-res").innerHTML = '<tr><td colspan="6" class="text-center">Suelo No Plástico: no se ejecutó el ensayo.</td></tr>';
    document.getElementById("tbody-att-lp-res").innerHTML = "";
    if (attChartInstance) { attChartInstance.destroy(); attChartInstance = null; }
    return;
  }

  set("att-res-ll", fmt(a.ll));
  set("att-res-lp", fmt(a.lp));
  set("att-res-ip", fmt(a.ip));
  set("att-res-lc", fmt(a.lc));
  set("att-res-class", a.clase ? a.clase.grupo : "—");
  set("att-res-class-desc", a.clase ? `${a.clase.nombre} • ${a.clase.nivel}` : (a.ip !== null && a.ip <= 0 ? "Índice de plasticidad ≤ 0: no plástico" : "Requiere LL y LP"));
  set("att-res-eq", a.m !== null
    ? `w = ${a.m.toFixed(3)}·log₁₀(N) + ${a.b.toFixed(3)}   (R² = ${a.r2.toFixed(4)})`
    : "—");

  document.getElementById("tbody-att-ll-res").innerHTML = a.ll_pts.map(p => `
    <tr>
      <td class="text-center">${p.n}</td>
      <td class="font-mono text-center">${p.golpes}</td>
      <td class="font-mono text-right">${p.mw.toFixed(2)}</td>
      <td class="font-mono text-right">${p.msuelo.toFixed(2)}</td>
      <td class="font-mono text-right font-bold text-primary">${p.w.toFixed(2)} %</td>
    </tr>`).join("") || '<tr><td colspan="5" class="text-center">—</td></tr>';
  document.getElementById("tbody-att-lp-res").innerHTML = a.lp_pts.map(p => `
    <tr>
      <td class="text-center">${p.n}</td>
      <td class="font-mono text-right">${p.mw.toFixed(2)}</td>
      <td class="font-mono text-right">${p.msuelo.toFixed(2)}</td>
      <td class="font-mono text-right font-bold text-primary">${p.w.toFixed(2)} %</td>
    </tr>`).join("") || '<tr><td colspan="4" class="text-center">—</td></tr>';

  renderGraficoAtterberg(a);
}

function renderGraficoAtterberg(a) {
  const canvas = document.getElementById("att-chart");
  if (!canvas) return;
  if (attChartInstance) { attChartInstance.destroy(); attChartInstance = null; }
  if (a.m === null) return;

  const gs = a.ll_pts.map(p => p.golpes);
  const xmin = Math.min(10, Math.min(...gs) * 0.8);
  const xmax = Math.max(100, Math.max(...gs) * 1.2);
  const linea = [];
  for (let i = 0; i <= 60; i++) {
    const x = xmin * Math.pow(xmax / xmin, i / 60);
    linea.push({ x, y: a.m * Math.log10(x) + a.b });
  }
  const ys = a.ll_pts.map(p => p.w).concat([a.ll]);
  const ymin = Math.floor(Math.min(...ys) - 3), ymax = Math.ceil(Math.max(...ys) + 3);

  attChartInstance = new Chart(canvas.getContext("2d"), {
    type: 'scatter',
    data: {
      datasets: [
        { label: 'Línea de fluidez', data: linea, type: 'line', borderColor: '#1565c0', borderWidth: 2.5, pointRadius: 0, fill: false, order: 3 },
        { label: 'Ensayos', data: a.ll_pts.map(p => ({ x: p.golpes, y: p.w })), borderColor: '#ffffff', backgroundColor: '#0891b2', pointRadius: 6, borderWidth: 1.5, order: 2 },
        { label: `LL = ${a.ll.toFixed(2)} % (25 golpes)`, data: [{ x: 25, y: a.ll }], backgroundColor: '#facc15', borderColor: '#111827', borderWidth: 1.5, pointRadius: 9, order: 1 },
        { label: '25 golpes', data: [{ x: 25, y: ymin }, { x: 25, y: a.ll }], type: 'line', borderColor: '#f59e0b', borderDash: [5, 4], borderWidth: 1.5, pointRadius: 0, fill: false },
        { label: 'LL', data: [{ x: xmin, y: a.ll }, { x: 25, y: a.ll }], type: 'line', borderColor: '#f59e0b', borderDash: [5, 4], borderWidth: 1.5, pointRadius: 0, fill: false }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      scales: {
        x: { type: 'logarithmic', min: xmin, max: xmax, title: { display: true, text: 'Número de golpes (N) [escala logarítmica]', font: { weight: 'bold' } },
          afterBuildTicks: ax => { ax.ticks = [10, 15, 20, 25, 30, 40, 50, 70, 100].filter(v => v >= xmin && v <= xmax).map(v => ({ value: v })); },
          ticks: { callback: v => v } },
        y: { min: ymin, max: ymax, title: { display: true, text: 'Contenido de humedad (%)', font: { weight: 'bold' } } }
      },
      plugins: {
        legend: { position: 'top', labels: { filter: it => !['25 golpes', 'LL'].includes(it.text) } },
        tooltip: { callbacks: { label: c => `N = ${c.raw.x.toFixed ? c.raw.x.toFixed(0) : c.raw.x} golpes | w = ${c.raw.y.toFixed(2)} %` } }
      }
    }
  });
}

function limpiarAtterberg() {
  document.querySelectorAll("#view-atterberg input.input-control").forEach(i => { i.value = ""; });
  document.getElementById("att-np").checked = false;
  toggleAtterbergNP();
  document.getElementById("att-obs").value = "";
  GeoState.ensayos.atterberg = {
    calculado: false, np: false, ll: null, lp: null, ip: null, lc: null,
    ll_pts: [], lp_pts: [], m: null, b: null, r2: null, clase: null, observaciones: ""
  };
  document.getElementById("att-results-content").classList.add("hidden");
  document.getElementById("att-results-placeholder").classList.remove("hidden");
  if (attChartInstance) { attChartInstance.destroy(); attChartInstance = null; }
  updateDashboardAtterbergSummary();
  refrescarClasificacionGranu();
  showToast("Datos de Límites de Atterberg reiniciados.");
}

function cargarDemoAtterberg() {
  document.getElementById("att-np").checked = false;
  toggleAtterbergNP();
  const setV = (id, v) => { document.getElementById(id).value = v; };
  // Límite líquido (recipiente 14.00 g)
  [[33, 38.95, 32.10], [27, 40.55, 33.05], [21, 37.60, 30.75], [15, 39.10, 31.60]].forEach(([g, mh, ms], i) => {
    setV(`att-ll-${i + 1}-golpes`, g); setV(`att-ll-${i + 1}-mh`, mh.toFixed(2));
    setV(`att-ll-${i + 1}-ms`, ms.toFixed(2)); setV(`att-ll-${i + 1}-cap`, "14.00");
  });
  // Límite plástico
  [[24.30, 22.35, 14.10], [25.15, 23.05, 14.00]].forEach(([mh, ms, cap], i) => {
    setV(`att-lp-${i + 1}-mh`, mh.toFixed(2)); setV(`att-lp-${i + 1}-ms`, ms.toFixed(2)); setV(`att-lp-${i + 1}-cap`, cap.toFixed(2));
  });
  // Límite de contracción
  setV("att-lc-vh", "14.50"); setV("att-lc-mhc", "51.70"); setV("att-lc-msc", "41.50"); setV("att-lc-mc", "20.00"); setV("att-lc-vs", "9.00");
  document.getElementById("att-obs").value = "Ensayo ejecutado con copa de Casagrande sobre material pasante la malla N°40 según ASTM D4318 / NTP 339.129.";
  calcularAtterberg();
}

// ===================================================================
// 9C. LÓGICA DE ENSAYO 06: COMPACTACIÓN PROCTOR (ASTM D698 / D1557 • NTP 339.141 / 339.142)
// ===================================================================
let proChartInstance = null;
const PRO_ROWS = 5;

function initProctorEvents() {
  let html = "";
  for (let i = 1; i <= PRO_ROWS; i++) {
    html += `
      <tr>
        <td class="text-center font-bold text-accent">${i}</td>
        <td><input type="number" step="0.1" class="input-control font-mono" id="pro-${i}-msh" placeholder="0.0"></td>
        <td><input type="number" step="0.01" class="input-control font-mono" id="pro-${i}-tarro" placeholder="0.00"></td>
        <td><input type="number" step="0.01" class="input-control font-mono" id="pro-${i}-tsh" placeholder="0.00"></td>
        <td><input type="number" step="0.01" class="input-control font-mono" id="pro-${i}-tss" placeholder="0.00"></td>
      </tr>`;
  }
  document.getElementById("tbody-pro-inputs").innerHTML = html;

  document.getElementById("btn-calcular-pro").addEventListener("click", calcularProctor);
  document.getElementById("btn-limpiar-pro").addEventListener("click", limpiarProctor);
  document.getElementById("btn-fill-demo-pro").addEventListener("click", cargarDemoProctor);
  document.getElementById("btn-usar-gs-pro").addEventListener("click", () => {
    const gs = GeoState.ensayos.gravedad;
    if (gs.calculado && gs.gs) {
      document.getElementById("pro-gs").value = gs.gs.toFixed(3);
      showToast(`Gs = ${gs.gs.toFixed(3)} copiada del Ensayo 03.`);
    } else {
      alert("Aún no hay Gs calculada. Calcule primero el Ensayo 03 (Gravedad Específica) o escriba el valor manualmente.");
    }
  });
  document.getElementById("btn-exportar-pdf-pro").addEventListener("click", () => {
    if (!GeoState.ensayos.proctor.calculado) {
      alert("Para exportar el informe en PDF, primero ingrese los datos y presione '⚡ Calcular Proctor'.");
      return;
    }
    generarPDFIndividual("proctor");
  });
}

// Ajuste polinómico de 2.º grado y = a·x² + b·x + c (mínimos cuadrados, x centrada)
function polyfit2(xs, ys) {
  const n = xs.length;
  const x0 = xs.reduce((s, v) => s + v, 0) / n;
  const u = xs.map(v => v - x0);
  const S = k => u.reduce((s, v) => s + Math.pow(v, k), 0);
  const T = k => u.reduce((s, v, i) => s + Math.pow(v, k) * ys[i], 0);
  const M = [
    [S(4), S(3), S(2), T(2)],
    [S(3), S(2), S(1), T(1)],
    [S(2), S(1), n, T(0)]
  ];
  for (let c = 0; c < 3; c++) {
    let p = c;
    for (let r = c + 1; r < 3; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    if (Math.abs(M[c][c]) < 1e-12) return null;
    for (let r = 0; r < 3; r++) {
      if (r === c) continue;
      const f = M[r][c] / M[c][c];
      for (let k = c; k < 4; k++) M[r][k] -= f * M[c][k];
    }
  }
  const A = M[0][3] / M[0][0], B = M[1][3] / M[1][1], C = M[2][3] / M[2][2];
  // y = A·(x−x0)² + B·(x−x0) + C  →  coeficientes en x
  const a = A, b = B - 2 * A * x0, c = C - B * x0 + A * x0 * x0;
  const ym = ys.reduce((s, v) => s + v, 0) / n;
  const ssTot = ys.reduce((s, v) => s + (v - ym) * (v - ym), 0);
  const ssRes = ys.reduce((s, v, i) => s + Math.pow(v - (a * xs[i] * xs[i] + b * xs[i] + c), 2), 0);
  return { a, b, c, r2: ssTot === 0 ? 1 : 1 - ssRes / ssTot };
}

function calcularProctor() {
  try {
    const vol = numById("pro-vol"), pMolde = numById("pro-molde");
    if (!vol || vol <= 0) throw new Error("Ingrese el volumen del molde (cm³) mayor a cero.");
    if (pMolde === null || pMolde < 0) throw new Error("Ingrese el peso del molde (g).");
    const gs = numById("pro-gs");
    const obs = document.getElementById("pro-obs").value.trim();

    const puntos = [];
    for (let i = 1; i <= PRO_ROWS; i++) {
      const msh = numById(`pro-${i}-msh`), tarro = numById(`pro-${i}-tarro`), tsh = numById(`pro-${i}-tsh`), tss = numById(`pro-${i}-tss`);
      if (msh === null && tarro === null && tsh === null && tss === null) continue;
      if (msh === null || tarro === null || tsh === null || tss === null) throw new Error(`Complete todos los datos del punto ${i}.`);
      const mSuelo = msh - pMolde;
      if (mSuelo <= 0) throw new Error(`En el punto ${i}, el molde + suelo húmedo debe ser mayor que el peso del molde.`);
      const mSeco = tss - tarro;
      if (mSeco <= 0) throw new Error(`En el punto ${i}, tarro + suelo seco debe ser mayor que el tarro.`);
      if (tsh < tss) throw new Error(`En el punto ${i}, tarro + suelo húmedo no puede ser menor que tarro + suelo seco.`);
      const w = ((tsh - tss) / mSeco) * 100;
      const rhoH = mSuelo / vol;
      puntos.push({ n: i, msuelo: mSuelo, rho_h: rhoH, w, rho_d: rhoH / (1 + w / 100) });
    }
    if (puntos.length < 3) throw new Error("Se requieren al menos 3 puntos para trazar la parábola de compactación.");

    const fit = polyfit2(puntos.map(p => p.w), puntos.map(p => p.rho_d));
    if (!fit || fit.a >= 0) throw new Error("Los puntos no forman una curva con máximo (la parábola es cóncava hacia arriba). Revise los datos: la densidad seca debe subir y luego bajar con la humedad.");

    const och = -fit.b / (2 * fit.a);
    const mds = fit.a * och * och + fit.b * och + fit.c;
    const wmin = Math.min(...puntos.map(p => p.w)), wmax = Math.max(...puntos.map(p => p.w));
    const optDentro = och >= wmin && och <= wmax;

    GeoState.ensayos.proctor = {
      calculado: true, vol, peso_molde: pMolde, gs: gs && gs > 0 ? gs : null,
      puntos, a: fit.a, b: fit.b, c: fit.c, r2: fit.r2, och, mds, mds95: mds * 0.95,
      opt_dentro: optDentro, observaciones: obs
    };
    renderResultadosProctor();
    updateDashboardProctorSummary();
    showToast(`Proctor: MDS = ${mds.toFixed(3)} g/cm³ • OCH = ${och.toFixed(2)} %`);
  } catch (err) {
    alert("Error en datos del Ensayo Proctor:\n" + err.message);
  }
}

function renderResultadosProctor() {
  const p = GeoState.ensayos.proctor;
  if (!p.calculado) return;
  document.getElementById("pro-results-placeholder").classList.add("hidden");
  document.getElementById("pro-results-content").classList.remove("hidden");

  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set("pro-res-mds", `${p.mds.toFixed(3)} g/cm³`);
  set("pro-res-och", `${p.och.toFixed(2)} %`);
  set("pro-res-mds95", `${p.mds95.toFixed(3)} g/cm³`);
  set("pro-res-gamma", `${(p.mds * 9.80665).toFixed(2)} kN/m³`);
  set("pro-res-eq", `ρd = ${p.a.toFixed(5)}·w² + ${p.b.toFixed(4)}·w + ${p.c.toFixed(4)}   (R² = ${p.r2.toFixed(4)})`);
  set("pro-res-aviso", p.opt_dentro ? "✅ El óptimo cae dentro del rango de humedades ensayadas." : "⚠️ El óptimo queda fuera del rango ensayado: extienda la curva con humedades adicionales.");

  if (p.gs) {
    const zav = p.gs / (1 + (p.och / 100) * p.gs);
    set("pro-res-zav", `${zav.toFixed(3)} g/cm³`);
    set("pro-res-sr", `${(((p.och / 100) * p.gs) / (p.gs / p.mds - 1) * 100).toFixed(1)} %`);
  } else {
    set("pro-res-zav", "—");
    set("pro-res-sr", "—");
  }

  document.getElementById("tbody-pro-res").innerHTML = p.puntos.map(x => `
    <tr>
      <td class="text-center">${x.n}</td>
      <td class="font-mono text-right">${x.msuelo.toFixed(1)}</td>
      <td class="font-mono text-right">${x.rho_h.toFixed(3)}</td>
      <td class="font-mono text-right">${x.w.toFixed(2)} %</td>
      <td class="font-mono text-right font-bold text-primary">${x.rho_d.toFixed(3)}</td>
    </tr>`).join("");

  renderGraficoProctor(p);
}

function renderGraficoProctor(p) {
  const canvas = document.getElementById("pro-chart");
  if (!canvas) return;
  if (proChartInstance) { proChartInstance.destroy(); proChartInstance = null; }

  const ws = p.puntos.map(x => x.w);
  const xmin = Math.min(...ws, p.och) - 2, xmax = Math.max(...ws, p.och) + 2;
  const curva = [];
  for (let i = 0; i <= 80; i++) {
    const x = xmin + (xmax - xmin) * i / 80;
    curva.push({ x, y: p.a * x * x + p.b * x + p.c });
  }
  const datasets = [
    { label: 'Curva Proctor', data: curva, type: 'line', borderColor: '#1565c0', borderWidth: 2.5, pointRadius: 0, fill: false, order: 4 },
    { label: 'Puntos de laboratorio', data: p.puntos.map(x => ({ x: x.w, y: x.rho_d })), backgroundColor: '#0891b2', borderColor: '#ffffff', borderWidth: 1.5, pointRadius: 6, order: 2 },
    { label: `Óptimo: MDS = ${p.mds.toFixed(3)} • OCH = ${p.och.toFixed(2)} %`, data: [{ x: p.och, y: p.mds }], backgroundColor: '#facc15', borderColor: '#111827', borderWidth: 1.5, pointRadius: 9, order: 1 },
    { label: 'guía-w', data: [{ x: p.och, y: 0 }, { x: p.och, y: p.mds }], type: 'line', borderColor: '#f59e0b', borderDash: [5, 4], borderWidth: 1.5, pointRadius: 0, fill: false },
    { label: 'guía-d', data: [{ x: xmin, y: p.mds }, { x: p.och, y: p.mds }], type: 'line', borderColor: '#f59e0b', borderDash: [5, 4], borderWidth: 1.5, pointRadius: 0, fill: false }
  ];
  const ys = p.puntos.map(x => x.rho_d).concat([p.mds]);
  let ymin = Math.min(...ys) - 0.08, ymax = Math.max(...ys) + 0.08;
  if (p.gs) {
    const zav = [];
    for (let i = 0; i <= 40; i++) {
      const x = xmin + (xmax - xmin) * i / 40;
      const y = p.gs / (1 + (x / 100) * p.gs);
      if (y <= ymax + 0.25) zav.push({ x, y });
    }
    datasets.push({ label: `Saturación 100 % (Gs = ${p.gs.toFixed(2)})`, data: zav, type: 'line', borderColor: '#dc2626', borderDash: [2, 3], borderWidth: 1.5, pointRadius: 0, fill: false, order: 5 });
    ymax = Math.max(ymax, Math.min(...zav.map(z => z.y)) + 0.02);
  }

  proChartInstance = new Chart(canvas.getContext("2d"), {
    type: 'scatter',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      scales: {
        x: { type: 'linear', min: xmin, max: xmax, title: { display: true, text: 'Contenido de humedad, w (%)', font: { weight: 'bold' } } },
        y: { min: ymin, max: ymax, title: { display: true, text: 'Densidad seca, ρd (g/cm³)', font: { weight: 'bold' } } }
      },
      plugins: {
        legend: { position: 'top', labels: { filter: it => !it.text.startsWith('guía') } },
        tooltip: { callbacks: { label: c => `w = ${c.raw.x.toFixed(2)} % | ρd = ${c.raw.y.toFixed(3)} g/cm³` } }
      }
    }
  });
}

function limpiarProctor() {
  document.querySelectorAll("#view-proctor input.input-control").forEach(i => { i.value = ""; });
  document.getElementById("pro-obs").value = "";
  GeoState.ensayos.proctor = {
    calculado: false, vol: null, peso_molde: null, gs: null, puntos: [],
    a: null, b: null, c: null, r2: null, och: null, mds: null, mds95: null, opt_dentro: true, observaciones: ""
  };
  document.getElementById("pro-results-content").classList.add("hidden");
  document.getElementById("pro-results-placeholder").classList.remove("hidden");
  if (proChartInstance) { proChartInstance.destroy(); proChartInstance = null; }
  updateDashboardProctorSummary();
  showToast("Datos del Ensayo Proctor reiniciados.");
}

function cargarDemoProctor() {
  const setV = (id, v) => { document.getElementById(id).value = v; };
  setV("pro-vol", "944"); setV("pro-molde", "4178.0");
  const gs = GeoState.ensayos.gravedad;
  setV("pro-gs", gs.calculado && gs.gs ? gs.gs.toFixed(3) : "2.650");
  // [molde + suelo húmedo, tarro, tarro + húmedo, tarro + seco]
  [[5992.8, 30.0, 138.0, 130.0], [6109.4, 30.0, 140.0, 130.0], [6186.8, 30.0, 142.0, 130.0],
  [6190.5, 30.0, 144.0, 130.0], [6149.1, 30.0, 146.0, 130.0]].forEach((r, i) => {
    setV(`pro-${i + 1}-msh`, r[0].toFixed(1)); setV(`pro-${i + 1}-tarro`, r[1].toFixed(2));
    setV(`pro-${i + 1}-tsh`, r[2].toFixed(2)); setV(`pro-${i + 1}-tss`, r[3].toFixed(2));
  });
  document.getElementById("pro-obs").value = "Compactación en molde de 4\" (944 cm³), 3 capas y 25 golpes por capa, según ASTM D698 Método A.";
  calcularProctor();
}

// ===================================================================
// RESÚMENES DEL PANEL PRINCIPAL: ATTERBERG Y PROCTOR (cuadros aparte)
// ===================================================================
function setSummaryRow(valId, statusId, value, ok, okText = "Calculado", pendText = "Sin procesar") {
  const v = document.getElementById(valId);
  if (v) v.textContent = value;
  const s = document.getElementById(statusId);
  if (s) s.innerHTML = ok
    ? `<span class="badge badge-success">${okText}</span>`
    : `<span class="badge badge-pending">${pendText}</span>`;
}

function updateDashboardAtterbergSummary() {
  const a = GeoState.ensayos.atterberg;
  updateDashboardPills();
  const pct = v => (v === null || v === undefined) ? "—" : `${v.toFixed(2)}`;
  const card = document.getElementById("badge-card-att");
  if (card) { card.textContent = a.calculado ? "Calculado" : "Sin calcular"; card.className = a.calculado ? "card-status calculated" : "card-status"; }
  const prev = document.getElementById("val-preview-att");
  if (prev) prev.textContent = !a.calculado ? "—" : (a.np ? "NP" : `LL ${a.ll !== null ? a.ll.toFixed(1) : "—"} • LP ${a.lp !== null ? a.lp.toFixed(1) : "—"} • IP ${a.ip !== null ? a.ip.toFixed(1) : "—"}`);

  if (!a.calculado) {
    ["ll", "lp", "ip", "lc", "clase", "sucs", "aashto", "eq", "n"].forEach(k => setSummaryRow(`td-asum-${k}`, `td-astatus-${k}`, "—", false));
    return;
  }
  const cls = clasificarSuelo();
  setSummaryRow("td-asum-sucs", "td-astatus-sucs", cls.ok ? cls.sucs.simbolo : "—", cls.ok, "Clasificado", "Requiere granulometría");
  setSummaryRow("td-asum-aashto", "td-astatus-aashto", cls.ok ? cls.aashto.texto : "—", cls.ok, "Clasificado", "Requiere granulometría");
  if (a.np) {
    ["ll", "lp", "ip", "lc"].forEach(k => setSummaryRow(`td-asum-${k}`, `td-astatus-${k}`, "NP", true, "No plástico"));
    setSummaryRow("td-asum-clase", "td-astatus-clase", "NP", true, "No plástico");
    setSummaryRow("td-asum-eq", "td-astatus-eq", "—", false, "", "No aplica");
    setSummaryRow("td-asum-n", "td-astatus-n", "—", false, "", "No aplica");
    return;
  }
  setSummaryRow("td-asum-ll", "td-astatus-ll", pct(a.ll), a.ll !== null, "Calculado", "Requiere ≥ 2 pruebas");
  setSummaryRow("td-asum-lp", "td-astatus-lp", pct(a.lp), a.lp !== null, "Calculado", "Sin datos");
  setSummaryRow("td-asum-ip", "td-astatus-ip", pct(a.ip), a.ip !== null, "Calculado", "Requiere LL y LP");
  setSummaryRow("td-asum-lc", "td-astatus-lc", pct(a.lc), a.lc !== null, "Calculado", "Opcional");
  setSummaryRow("td-asum-clase", "td-astatus-clase", a.clase ? a.clase.grupo : "—", !!a.clase, "Clasificado", "Requiere IP > 0");
  setSummaryRow("td-asum-eq", "td-astatus-eq", a.m !== null ? `R² = ${a.r2.toFixed(4)}` : "—", a.m !== null, a.r2 !== null && a.r2 >= 0.95 ? "Buen ajuste" : "Revisar ajuste", "Sin ajuste");
  setSummaryRow("td-asum-n", "td-astatus-n", `${a.ll_pts.length} LL • ${a.lp_pts.length} LP`, true, "Registrado");
}

function updateDashboardProctorSummary() {
  const p = GeoState.ensayos.proctor;
  updateDashboardPills();
  const card = document.getElementById("badge-card-pro");
  if (card) { card.textContent = p.calculado ? "Calculado" : "Sin calcular"; card.className = p.calculado ? "card-status calculated" : "card-status"; }
  const prev = document.getElementById("val-preview-pro");
  if (prev) prev.textContent = p.calculado ? `MDS ${p.mds.toFixed(3)} • OCH ${p.och.toFixed(1)} %` : "—";

  if (!p.calculado) {
    ["mds", "och", "mds95", "gamma", "zav", "sr", "r2", "n"].forEach(k => setSummaryRow(`td-psum-${k}`, `td-pstatus-${k}`, "—", false));
    return;
  }
  setSummaryRow("td-psum-mds", "td-pstatus-mds", p.mds.toFixed(3), true);
  setSummaryRow("td-psum-och", "td-pstatus-och", p.och.toFixed(2), true, p.opt_dentro ? "Calculado" : "Fuera de rango");
  setSummaryRow("td-psum-mds95", "td-pstatus-mds95", p.mds95.toFixed(3), true);
  setSummaryRow("td-psum-gamma", "td-pstatus-gamma", (p.mds * 9.80665).toFixed(2), true);
  if (p.gs) {
    setSummaryRow("td-psum-zav", "td-pstatus-zav", (p.gs / (1 + (p.och / 100) * p.gs)).toFixed(3), true);
    setSummaryRow("td-psum-sr", "td-pstatus-sr", (((p.och / 100) * p.gs) / (p.gs / p.mds - 1) * 100).toFixed(1), true);
  } else {
    setSummaryRow("td-psum-zav", "td-pstatus-zav", "—", false, "", "Requiere Gs");
    setSummaryRow("td-psum-sr", "td-pstatus-sr", "—", false, "", "Requiere Gs");
  }
  setSummaryRow("td-psum-r2", "td-pstatus-r2", p.r2.toFixed(4), true, p.r2 >= 0.95 ? "Buen ajuste" : "Revisar ajuste");
  setSummaryRow("td-psum-n", "td-pstatus-n", `${p.puntos.length}`, true, "Registrado");
}

// ===================================================================
// 10. GENERADOR DE INFORMES PDF (INDIVIDUALES Y CONSOLIDADOS POR PANEL)
// ===================================================================
// Lee los campos del "Datos del Ensayo" + Control de Secado de granulometría
function capturarEncabezadoGranu() {
  const val = id => (document.getElementById(id)?.value || "").trim();
  const metodoEl = document.querySelector('input[name="granu-metodo"]:checked');
  const metodoVal = metodoEl ? metodoEl.value : "";
  const metodoMap = {
    "a-simple": 'Método A — Tamizado Simple (T.M. < 3/4")',
    "a-compuesto": 'Método A — Tamizado Compuesto (T.M. ≥ 3/4")',
    "b-simple": 'Método B — Tamizado Simple (T.M. < N°4)'
  };
  const secado = {};
  ["g1", "g2", "g3", "f1", "f2", "f3"].forEach(k => {
    secado[k] = { fecha: val(`sec-${k}-fecha`), hora: val(`sec-${k}-hora`), masa: val(`sec-${k}-masa`) };
  });
  return {
    tecnico: val("granu-hdr-tecnico"),
    informe: val("granu-hdr-informe"),
    calicata: val("granu-hdr-calicata"),
    fecha: val("granu-hdr-fecha"),
    muestra: val("granu-hdr-muestra"),
    profundidad: val("granu-hdr-profundidad"),
    horno: val("granu-hdr-horno"),
    balanza: val("granu-hdr-balanza"),
    masa_total: val("granu-hdr-masa-total"),
    masa_recipiente: val("granu-hdr-masa-recipiente"),
    masa_gruesa: val("granu-hdr-masa-gruesa"),
    masa_fina: val("granu-hdr-masa-fina"),
    metodo: metodoVal,
    metodo_txt: metodoMap[metodoVal] || "",
    secado
  };
}

// Vuelca Muestra / Calicata / Fecha del encabezado hacia el proyecto global (solo si se llenaron)
function sincronizarEncabezadoGranuAProyecto(enc) {
  if (!enc) return;
  let cambio = false;
  if (enc.muestra) { GeoState.proyecto.muestra = enc.muestra; cambio = true; }
  if (enc.calicata) { GeoState.proyecto.procedencia = enc.calicata; cambio = true; }
  if (enc.fecha) {
    const partes = enc.fecha.split("-"); // yyyy-mm-dd -> dd/mm/yyyy
    GeoState.proyecto.fecha = partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : enc.fecha;
    cambio = true;
  }
  if (cambio) updateStripUI();
}

// Bloque para el PDF: datos del ensayo + control de secado (solo los campos con dato)
function getPlantillaEncabezadoGranuHTML() {
  const enc = GeoState.ensayos.granulometria && GeoState.ensayos.granulometria.encabezado;
  if (!enc) return "";

  // Datos del ensayo (no duplica muestra/fecha, que ya van en la metadata estándar)
  const campos = [
    ["Técnico", enc.tecnico],
    ["Informe N°", enc.informe],
    ["Calicata / Cantera", enc.calicata],
    ["Profundidad", enc.profundidad ? `${enc.profundidad} m` : ""],
    ["Horno", enc.horno],
    ["Balanza", enc.balanza],
    ["Masa Total", enc.masa_total ? `${enc.masa_total} g` : ""],
    ["Masa del Recipiente", enc.masa_recipiente ? `${enc.masa_recipiente} g` : ""],
    ["Masa Parte Gruesa", enc.masa_gruesa ? `${enc.masa_gruesa} g` : ""],
    ["Masa Parte Fina", enc.masa_fina ? `${enc.masa_fina} g` : ""],
    ["Método", enc.metodo_txt],
  ].filter(([, v]) => v);

  let headerTable = "";
  if (campos.length) {
    let filas = "";
    for (let i = 0; i < campos.length; i += 2) {
      const [l1, v1] = campos[i];
      const par = campos[i + 1];
      const l2 = par ? par[0] : "";
      const v2 = par ? par[1] : "";
      filas += `<tr><td class="pdf-meta-label">${l1}:</td><td>${v1}</td><td class="pdf-meta-label">${l2 ? l2 + ":" : ""}</td><td>${v2}</td></tr>`;
    }
    headerTable = `<table class="pdf-table-meta" style="margin-top:4px;">${filas}</table>`;
  }

  // Control de secado (solo si hay algún dato)
  const sec = enc.secado || {};
  const hayAlgun = grupo => grupo.some(k => sec[k] && (sec[k].fecha || sec[k].hora || sec[k].masa));
  const fila = (etapa, k) => {
    const s = sec[k] || {};
    return `<tr><td>${etapa}</td><td style="text-align:center;">${s.fecha || "—"}</td><td style="text-align:center;">${s.hora || "—"}</td><td style="text-align:right;">${s.masa ? s.masa + " g" : "—"}</td></tr>`;
  };
  const gruesos = ["g1", "g2", "g3"];
  const finos = ["f1", "f2", "f3"];
  let secadoTable = "";
  if (hayAlgun(gruesos) || hayAlgun(finos)) {
    const etG = ["Masa húmeda", "Masa seca (tras secado 12–16 h)", "Masa lavada y seca (12–16 h)"];
    const etF = ["Masa húmeda", "Masa seca de la submuestra (Mo)", "Masa lavada y seca (12–16 h)"];
    let body = "";
    if (hayAlgun(gruesos)) {
      body += `<tr><td colspan="4" style="background:#f1f5f9;font-weight:bold;">Parte Gruesa</td></tr>`;
      gruesos.forEach((k, i) => body += fila(etG[i], k));
    }
    if (hayAlgun(finos)) {
      body += `<tr><td colspan="4" style="background:#f1f5f9;font-weight:bold;">Parte Fina</td></tr>`;
      finos.forEach((k, i) => body += fila(etF[i], k));
    }
    secadoTable = `
      <div class="pdf-section-title" style="margin-top:6px;">CONTROL DE SECADO</div>
      <table class="pdf-data-table">
        <thead><tr><th>Etapa</th><th>Fecha</th><th>Hora</th><th>Masa</th></tr></thead>
        <tbody>${body}</tbody>
      </table>`;
  }

  return headerTable + secadoTable;
}

function getPlantillaMetadatosHTML() {
  const p = GeoState.proyecto;
  return `
    <table class="pdf-table-meta">
      <tr>
        <td class="pdf-meta-label">Proyecto:</td>
        <td><strong>${p.nombre}</strong></td>
        <td class="pdf-meta-label">N.º Muestra:</td>
        <td><strong>${p.muestra}</strong></td>
      </tr>
      <tr>
        <td class="pdf-meta-label">Procedencia:</td>
        <td>${p.procedencia}</td>
        <td class="pdf-meta-label">Material:</td>
        <td>${p.material}</td>
      </tr>
      <tr>
        <td class="pdf-meta-label">Ensayado por:</td>
        <td>${p.ensayado}</td>
        <td class="pdf-meta-label">Fecha emisión:</td>
        <td>${p.fecha}</td>
      </tr>
    </table>
  `;
}

function getPlantillaFirmasHTML() {
  return `
    <div class="pdf-signatures">
      <div class="pdf-sig-box">
        <div class="pdf-sig-line"></div>
        <div class="pdf-sig-title">Responsable del Ensayo</div>
        <div style="font-size: 7.5pt; color: #666;">Técnico / Laboratorista Geotécnico</div>
      </div>
      <div class="pdf-sig-box">
        <div class="pdf-sig-line"></div>
        <div class="pdf-sig-title">Supervisor / Jefe de Laboratorio</div>
        <div style="font-size: 7.5pt; color: #666;">Ingeniero Civil Colegiado</div>
      </div>
    </div>
  `;
}

function generarPDFIndividual(tipo) {
  const printContainer = document.getElementById("print-container");
  let contentHTML = "";
  let filename = "";

  if (tipo === "humedad") {
    const h = GeoState.ensayos.humedad;
    filename = `Informe_Humedad_${GeoState.proyecto.muestra}.pdf`;

    let filasHTML = h.determinaciones.map(d => `
      <tr>
        <td style="text-align: center;">${d.num}</td>
        <td style="text-align: center; font-weight: bold;">${d.id}</td>
        <td style="text-align: right;">${d.mr.toFixed(2)}</td>
        <td style="text-align: right;">${d.mh.toFixed(2)}</td>
        <td style="text-align: right;">${d.ms.toFixed(2)}</td>
        <td style="text-align: right;">${d.mw.toFixed(2)}</td>
        <td style="text-align: right;">${d.mss.toFixed(2)}</td>
        <td style="text-align: right; font-weight: bold; color: #1565c0;">${d.w.toFixed(2)} %</td>
      </tr>
    `).join("");

    contentHTML = `
      <div class="pdf-report-page">
        <div class="pdf-header">
          <div class="pdf-title-main">LABORATORIO DE MECÁNICA DE SUELOS • ING. GEOLÓGICA FIGMM</div>
          <div class="pdf-title-sub">INFORME TÉCNICO: DETERMINACIÓN DEL CONTENIDO DE HUMEDAD</div>
          <div class="pdf-norm-ref">Normas de referencia: ASTM D2216 / NTP 339.127 / MTC E108</div>
        </div>

        ${getPlantillaMetadatosHTML()}

        <div style="margin-bottom: 8px; font-size: 8.5pt;">
          <strong>Condiciones de Ensayo:</strong> Horno de secado a ${h.temp.toFixed(1)} °C durante ${h.tiempo.toFixed(1)} horas.
        </div>

        <div class="pdf-section-title">REGISTRO DE PESADAS Y RESULTADOS</div>
        <table class="pdf-data-table">
          <thead>
            <tr>
              <th>Det.</th>
              <th>Recipiente</th>
              <th>M. Recipiente (Mt) [g]</th>
              <th>M. Rec.+Húm. (M1) [g]</th>
              <th>M. Rec.+Seco (M2) [g]</th>
              <th>Masa Agua (Mw) [g]</th>
              <th>Masa Seca (Ms) [g]</th>
              <th>Humedad (w) [%]</th>
            </tr>
          </thead>
          <tbody>
            ${filasHTML}
            <tr style="background: #eef2ff; font-weight: bold;">
              <td colspan="7" style="text-align: right; padding-right: 10px;">PROMEDIO DE CONTENIDO DE HUMEDAD (w):</td>
              <td style="text-align: right; font-size: 9.5pt; color: #b71c1c;">${h.promedio.toFixed(2)} %</td>
            </tr>
          </tbody>
        </table>

        ${h.observaciones ? `
          <div class="pdf-section-title">OBSERVACIONES</div>
          <p style="font-size: 8.5pt; margin-bottom: 12px;">${h.observaciones}</p>
        ` : ''}

        ${getPlantillaFirmasHTML()}
      </div>
    `;

  } else if (tipo === "volumetrico") {
    const v = GeoState.ensayos.volumetrico;
    filename = `Informe_Peso_Volumetrico_${GeoState.proyecto.muestra}.pdf`;

    let tablaPruebasHTML = "";
    if (v.metodo === "parafina") {
      let filas = v.pruebas.map(p => `
        <tr>
          <td style="text-align: center;">${p.num}</td>
          <td style="text-align: right;">${p.mm.toFixed(1)}</td>
          <td style="text-align: right;">${p.mmp.toFixed(1)}</td>
          <td style="text-align: right;">${p.mp.toFixed(1)}</td>
          <td style="text-align: right;">${p.vmp.toFixed(1)}</td>
          <td style="text-align: right;">${p.vp.toFixed(2)}</td>
          <td style="text-align: right; font-weight: bold;">${p.vm.toFixed(2)}</td>
          <td style="text-align: right; font-weight: bold; color: #1565c0;">${p.gamma_m_gf.toFixed(3)}</td>
          <td style="text-align: right; font-weight: bold; color: #b71c1c;">${p.gamma_m_kn.toFixed(3)}</td>
        </tr>
      `).join("");

      tablaPruebasHTML = `
        <table class="pdf-data-table">
          <thead>
            <tr>
              <th>Prueba</th>
              <th>M. Suelo (Mm) [g]</th>
              <th>M. Suelo+Paraf [g]</th>
              <th>M. Parafina [g]</th>
              <th>Vol. Total [cm³]</th>
              <th>Vol. Paraf [cm³]</th>
              <th>Vol. Suelo (Vm) [cm³]</th>
              <th>γm [g/cm³]</th>
              <th>γm [kN/m³]</th>
            </tr>
          </thead>
          <tbody>
            ${filas}
            <tr style="background: #eef2ff; font-weight: bold;">
              <td colspan="7" style="text-align: right; padding-right: 10px;">PROMEDIO DE PESO VOLUMÉTRICO DE MASA (γm):</td>
              <td style="text-align: right; color: #1565c0;">${v.rho_humeda.toFixed(3)}</td>
              <td style="text-align: right; color: #b71c1c;">${v.gamma_kn_m3.toFixed(3)}</td>
            </tr>
          </tbody>
        </table>
      `;
    } else {
      const p = v.pruebas[0];
      tablaPruebasHTML = `
        <table class="pdf-data-table">
          <thead>
            <tr>
              <th>Parámetro</th>
              <th>Símbolo</th>
              <th>Valor Obtenido</th>
              <th>Unidad</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Masa del molde / recipiente vacío</td>
              <td>Mm</td>
              <td style="text-align: right;">${p.mm.toFixed(2)}</td>
              <td>g</td>
            </tr>
            <tr>
              <td>Masa recipiente + suelo húmedo</td>
              <td>Mts</td>
              <td style="text-align: right;">${p.mts.toFixed(2)}</td>
              <td>g</td>
            </tr>
            <tr>
              <td>Volumen del molde calibrado</td>
              <td>V</td>
              <td style="text-align: right;">${p.v.toFixed(1)}</td>
              <td>cm³</td>
            </tr>
            <tr style="background: #f8fafc; font-weight: bold;">
              <td>Masa neta del suelo húmedo</td>
              <td>M</td>
              <td style="text-align: right;">${p.masa_suelo.toFixed(2)}</td>
              <td>g</td>
            </tr>
          </tbody>
        </table>
      `;
    }

    contentHTML = `
      <div class="pdf-report-page">
        <div class="pdf-header">
          <div class="pdf-title-main">LABORATORIO DE MECÁNICA DE SUELOS • ING. GEOLÓGICA FIGMM</div>
          <div class="pdf-title-sub">INFORME TÉCNICO: PESO VOLUMÉTRICO Y DENSIDAD</div>
          <div class="pdf-norm-ref">Normas de referencia: ${v.metodo === "parafina" ? "NTP 339.139 (Muestra Parafinada)" : "ASTM D7263 (Molde Calibrado)"} / MTC E110</div>
        </div>

        ${getPlantillaMetadatosHTML()}

        <div class="pdf-section-title">REGISTRO DE ENSAYO Y RESULTADOS</div>
        ${tablaPruebasHTML}

        <div class="pdf-section-title">RESUMEN DE DENSIDAD Y PESOS VOLUMÉTRICOS</div>
        <table class="pdf-data-table">
          <thead>
            <tr>
              <th>Propiedad Física</th>
              <th>Símbolo</th>
              <th>Valor Húmedo</th>
              <th>Valor Seco (w = ${v.humedad !== null ? v.humedad.toFixed(2) + '%' : 'N/A'})</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Densidad de Masa (g/cm³)</td>
              <td>ρ</td>
              <td style="text-align: right; font-weight: bold;">${v.rho_humeda.toFixed(3)}</td>
              <td style="text-align: right; font-weight: bold;">${v.rho_seca ? v.rho_seca.toFixed(3) : '—'}</td>
            </tr>
            <tr>
              <td>Peso Volumétrico (kN/m³)</td>
              <td>γ</td>
              <td style="text-align: right; font-weight: bold; color: #b71c1c;">${v.gamma_kn_m3.toFixed(3)}</td>
              <td style="text-align: right; font-weight: bold; color: #b71c1c;">${v.gamma_seca ? v.gamma_seca.toFixed(3) : '—'}</td>
            </tr>
          </tbody>
        </table>

        ${v.observaciones ? `
          <div class="pdf-section-title">OBSERVACIONES</div>
          <p style="font-size: 8.5pt; margin-bottom: 12px;">${v.observaciones}</p>
        ` : ''}

        ${getPlantillaFirmasHTML()}
      </div>
    `;

  } else if (tipo === "gravedad") {
    const g = GeoState.ensayos.gravedad;
    filename = `Informe_Gravedad_Especifica_${GeoState.proyecto.muestra}.pdf`;

    let filasPruebas = g.pruebas.map(p => `
      <tr>
        <td style="text-align: center;">${p.num}</td>
        <td style="text-align: right;">${p.mpw.toFixed(2)}</td>
        <td style="text-align: right;">${p.ms.toFixed(2)}</td>
        <td style="text-align: right;">${p.mpsw.toFixed(2)}</td>
        <td style="text-align: right;">${p.desalojada.toFixed(2)}</td>
        <td style="text-align: right; font-weight: bold;">${p.gt.toFixed(3)}</td>
        <td style="text-align: right; font-weight: bold; color: #1565c0;">${p.g20.toFixed(3)}</td>
      </tr>
    `).join("");

    contentHTML = `
      <div class="pdf-report-page">
        <div class="pdf-header">
          <div class="pdf-title-main">LABORATORIO DE MECÁNICA DE SUELOS • ING. GEOLÓGICA FIGMM</div>
          <div class="pdf-title-sub">INFORME TÉCNICO: GRAVEDAD ESPECÍFICA DE LOS SÓLIDOS (Gs)</div>
          <div class="pdf-norm-ref">Normas de referencia: ASTM D854 / NTP 339.131 / MTC E107</div>
        </div>

        ${getPlantillaMetadatosHTML()}

        <div style="margin-bottom: 8px; font-size: 8.5pt;">
          <strong>Condiciones del Picnómetro:</strong> Temperatura de ensayo Tt = ${g.temp.toFixed(1)} °C | Densidad del agua ρw,t = ${g.rho_w.toFixed(5)} g/mL | Factor K = ${g.k.toFixed(5)}
        </div>

        <div class="pdf-section-title">REGISTRO DE ENSAYO CON PICNÓMETRO</div>
        <table class="pdf-data-table">
          <thead>
            <tr>
              <th>Prueba</th>
              <th>Mpw,t [g]</th>
              <th>Ms [g]</th>
              <th>Mpws,t [g]</th>
              <th>Vol. Desal. [g]</th>
              <th>Gt (Tt)</th>
              <th>G20°C</th>
            </tr>
          </thead>
          <tbody>
            ${filasPruebas}
            <tr style="background: #eef2ff; font-weight: bold;">
              <td colspan="6" style="text-align: right; padding-right: 10px;">PROMEDIO GRAVEDAD ESPECÍFICA A 20°C (Gs @ 20°C):</td>
              <td style="text-align: right; font-size: 9.5pt; color: #b71c1c;">${g.gs.toFixed(3)}</td>
            </tr>
          </tbody>
        </table>

        ${g.observaciones ? `
          <div class="pdf-section-title">OBSERVACIONES</div>
          <p style="font-size: 8.5pt; margin-bottom: 12px;">${g.observaciones}</p>
        ` : ''}

        ${getPlantillaFirmasHTML()}
      </div>
    `;
  } else if (tipo === "granulometria") {
    generarPDFConsolidadoLab2();
    return;
  } else if (tipo === "atterberg" || tipo === "proctor") {
    const esAtt = tipo === "atterberg";
    filename = `Informe_${esAtt ? "Limites_Atterberg" : "Proctor"}_${GeoState.proyecto.muestra}.pdf`;
    contentHTML = `
      <div class="pdf-report-page">
        <div class="pdf-header">
          <div class="pdf-title-main">LABORATORIO DE MECÁNICA DE SUELOS • ING. GEOLÓGICA FIGMM</div>
          <div class="pdf-title-sub">${esAtt ? "INFORME TÉCNICO: LÍMITES DE ATTERBERG" : "INFORME TÉCNICO: ENSAYO DE COMPACTACIÓN PROCTOR"}</div>
          <div class="pdf-norm-ref">${esAtt ? "Normas de referencia: ASTM D4318 / NTP 339.129 / MTC E110-E111" : "Normas de referencia: ASTM D698 / D1557 • NTP 339.141 / 339.142 • MTC E115-E116"}</div>
        </div>
        ${getPlantillaMetadatosHTML()}
        ${esAtt ? getSeccionPDFAtterberg("") : getSeccionPDFProctor("")}
        ${getPlantillaFirmasHTML()}
      </div>
    `;
  }

  printContainer.innerHTML = contentHTML;
  ejecutarDescargaPDF(filename);
}

// Imagen del gráfico solo si el canvas tiene tamaño (si su vista estuvo oculta no hay bitmap)
function safeChartImage(chart) {
  try {
    if (!chart || !chart.canvas || chart.canvas.width < 20 || chart.canvas.height < 20) return "";
    const url = chart.toBase64Image();
    return url && url.length > 200 ? url : "";
  } catch (e) { return ""; }
}

// Sección PDF de Límites de Atterberg (individual y general)
function getSeccionPDFAtterberg(num) {
  const a = GeoState.ensayos.atterberg;
  if (!a.calculado) return "";
  const titulo = `${num}LÍMITES DE ATTERBERG (ASTM D4318)`;
  if (a.np) {
    return `<div class="pdf-section-title">${titulo}</div>
      <table class="pdf-data-table"><thead><tr><th>LL</th><th>LP</th><th>IP</th><th>LC</th></tr></thead>
      <tbody><tr><td style="text-align:center;font-weight:bold;">NP</td><td style="text-align:center;font-weight:bold;">NP</td><td style="text-align:center;font-weight:bold;">NP</td><td style="text-align:center;font-weight:bold;">NP</td></tr></tbody></table>
      <p style="font-size:8.5pt;">Suelo No Plástico.${a.observaciones ? " " + a.observaciones : ""}</p>
      ${(() => { const c = clasificarSuelo(); return c.ok ? `<p style="font-size:8.5pt;"><strong>SUCS:</strong> ${c.sucs.simbolo} — ${c.sucs.desc} &bull; <strong>AASHTO:</strong> ${c.aashto.texto}</p>` : ""; })()}`;
  }
  const f = v => v === null ? "—" : `${v.toFixed(2)} %`;
  let img = "";
  if (attChartInstance && safeChartImage(attChartInstance)) {
    try {
      img = `<div style="text-align:center;margin:6px 0;background:#fff;border:1px solid #cbd5e1;border-radius:4px;padding:6px;">
        <img src="${safeChartImage(attChartInstance)}" style="max-width:100%;height:auto;max-height:230px;" /></div>`;
    } catch (e) { console.warn("No se pudo exportar el diagrama de fluidez:", e); }
  }
  const filasLL = a.ll_pts.map(p => `<tr><td style="text-align:center;">${p.n}</td><td style="text-align:center;">${p.golpes}</td><td style="text-align:right;">${p.mw.toFixed(2)}</td><td style="text-align:right;">${p.msuelo.toFixed(2)}</td><td style="text-align:right;font-weight:bold;color:#1565c0;">${p.w.toFixed(2)} %</td></tr>`).join("");
  const filasLP = a.lp_pts.map(p => `<tr><td style="text-align:center;">${p.n}</td><td style="text-align:right;">${p.mw.toFixed(2)}</td><td style="text-align:right;">${p.msuelo.toFixed(2)}</td><td style="text-align:right;font-weight:bold;color:#1565c0;">${p.w.toFixed(2)} %</td></tr>`).join("");
  return `
    <div class="pdf-section-title">${titulo}</div>
    <table class="pdf-data-table">
      <thead><tr><th>Límite Líquido (LL)</th><th>Límite Plástico (LP)</th><th>Índice de Plasticidad (IP)</th><th>Límite de Contracción (LC)</th><th>Plasticidad (Casagrande)</th></tr></thead>
      <tbody><tr>
        <td style="text-align:center;font-weight:bold;color:#b71c1c;">${f(a.ll)}</td>
        <td style="text-align:center;font-weight:bold;">${f(a.lp)}</td>
        <td style="text-align:center;font-weight:bold;color:#b71c1c;">${f(a.ip)}</td>
        <td style="text-align:center;">${f(a.lc)}</td>
        <td style="text-align:center;font-weight:bold;color:#1565c0;">${a.clase ? a.clase.grupo : "—"}</td>
      </tr></tbody>
    </table>
    ${(() => { const c = clasificarSuelo(); return c.ok ? `<table class="pdf-data-table"><thead><tr><th>Clasificación SUCS (ASTM D2487)</th><th>Clasificación AASHTO (M 145)</th></tr></thead><tbody><tr><td style="text-align:center;font-weight:bold;color:#1565c0;">${c.sucs.simbolo} — ${c.sucs.desc}</td><td style="text-align:center;font-weight:bold;color:#1565c0;">${c.aashto.texto}</td></tr></tbody></table>` : `<p style="font-size:8pt;color:#b71c1c;margin:3px 0;">Clasificación SUCS / AASHTO: ${c.motivo}</p>`; })()}
    ${a.clase ? `<p style="font-size:8pt;color:#334155;margin:3px 0;"><strong>Plasticidad:</strong> ${a.clase.nombre} • ${a.clase.nivel} (carta de Casagrande)</p>` : ""}
    ${a.m !== null ? `<p style="font-size:8pt;color:#334155;margin:3px 0;"><strong>Línea de fluidez:</strong> w = ${a.m.toFixed(3)}·log₁₀(N) + ${a.b.toFixed(3)} (R² = ${a.r2.toFixed(4)}); LL = w a 25 golpes.</p>` : ""}
    ${filasLL ? `<table class="pdf-data-table"><thead><tr><th>Prueba LL</th><th>N.º golpes</th><th>Masa agua (g)</th><th>Masa suelo seco (g)</th><th>Humedad</th></tr></thead><tbody>${filasLL}</tbody></table>` : ""}
    ${filasLP ? `<table class="pdf-data-table"><thead><tr><th>Prueba LP</th><th>Masa agua (g)</th><th>Masa suelo seco (g)</th><th>Humedad</th></tr></thead><tbody>${filasLP}</tbody></table>` : ""}
    ${img}
    ${a.observaciones ? `<p style="font-size:8.5pt;margin:6px 0;"><strong>Observaciones:</strong> ${a.observaciones}</p>` : ""}
  `;
}

// Sección PDF del Ensayo Proctor (individual y general)
function getSeccionPDFProctor(num) {
  const p = GeoState.ensayos.proctor;
  if (!p.calculado) return "";
  let img = "";
  if (proChartInstance && safeChartImage(proChartInstance)) {
    try {
      img = `<div style="text-align:center;margin:6px 0;background:#fff;border:1px solid #cbd5e1;border-radius:4px;padding:6px;">
        <img src="${safeChartImage(proChartInstance)}" style="max-width:100%;height:auto;max-height:230px;" /></div>`;
    } catch (e) { console.warn("No se pudo exportar la curva Proctor:", e); }
  }
  const filas = p.puntos.map(x => `<tr><td style="text-align:center;">${x.n}</td><td style="text-align:right;">${x.msuelo.toFixed(1)}</td><td style="text-align:right;">${x.rho_h.toFixed(3)}</td><td style="text-align:right;">${x.w.toFixed(2)} %</td><td style="text-align:right;font-weight:bold;color:#1565c0;">${x.rho_d.toFixed(3)}</td></tr>`).join("");
  return `
    <div class="pdf-section-title">${num}ENSAYO DE COMPACTACIÓN PROCTOR (ASTM D698 / D1557)</div>
    <table class="pdf-data-table">
      <thead><tr><th>Máx. Densidad Seca (MDS)</th><th>Humedad Óptima (OCH)</th><th>95 % de la MDS</th><th>γd máx.</th><th>R² del ajuste</th></tr></thead>
      <tbody><tr>
        <td style="text-align:center;font-weight:bold;color:#b71c1c;">${p.mds.toFixed(3)} g/cm³</td>
        <td style="text-align:center;font-weight:bold;color:#b71c1c;">${p.och.toFixed(2)} %</td>
        <td style="text-align:center;">${p.mds95.toFixed(3)} g/cm³</td>
        <td style="text-align:center;">${(p.mds * 9.80665).toFixed(2)} kN/m³</td>
        <td style="text-align:center;">${p.r2.toFixed(4)}</td>
      </tr></tbody>
    </table>
    <p style="font-size:8pt;color:#334155;margin:3px 0;">Molde: V = ${p.vol} cm³ • Peso = ${p.peso_molde} g • Ajuste parabólico: ρd = ${p.a.toFixed(5)}·w² + ${p.b.toFixed(4)}·w + ${p.c.toFixed(4)}</p>
    <table class="pdf-data-table">
      <thead><tr><th>Punto</th><th>Masa suelo húmedo (g)</th><th>Densidad húmeda (g/cm³)</th><th>Humedad</th><th>Densidad seca (g/cm³)</th></tr></thead>
      <tbody>${filas}</tbody>
    </table>
    ${img}
    ${p.observaciones ? `<p style="font-size:8.5pt;margin:6px 0;"><strong>Observaciones:</strong> ${p.observaciones}</p>` : ""}
  `;
}

function generarPDFConsolidado() {
  const printContainer = document.getElementById("print-container");
  const { humedad, volumetrico, gravedad } = GeoState.ensayos;
  const filename = `Informe_General_Laboratorio_1_${GeoState.proyecto.muestra}.pdf`;

  let seccionHumedadHTML = "";
  if (humedad.calculado) {
    let filas = humedad.determinaciones.map(d => `
      <tr>
        <td style="text-align: center;">${d.id}</td>
        <td style="text-align: right;">${d.mr.toFixed(2)}</td>
        <td style="text-align: right;">${d.mh.toFixed(2)}</td>
        <td style="text-align: right;">${d.ms.toFixed(2)}</td>
        <td style="text-align: right;">${d.mw.toFixed(2)}</td>
        <td style="text-align: right;">${d.mss.toFixed(2)}</td>
        <td style="text-align: right; font-weight: bold;">${d.w.toFixed(2)} %</td>
      </tr>
    `).join("");

    seccionHumedadHTML = `
      <div class="pdf-section-title">1. DETERMINACIÓN DEL CONTENIDO DE HUMEDAD (ASTM D2216 / NTP 339.127)</div>
      <table class="pdf-data-table">
        <thead>
          <tr>
            <th>Recipiente</th>
            <th>Mt [g]</th>
            <th>M1 (Húmedo) [g]</th>
            <th>M2 (Seco) [g]</th>
            <th>Mw (Agua) [g]</th>
            <th>Ms (Seco) [g]</th>
            <th>Humedad (w)</th>
          </tr>
        </thead>
        <tbody>
          ${filas}
          <tr style="background: #f1f5f9; font-weight: bold;">
            <td colspan="6" style="text-align: right;">PROMEDIO DE CONTENIDO DE HUMEDAD:</td>
            <td style="text-align: right; color: #b71c1c;">${humedad.promedio.toFixed(2)} %</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  let seccionVolumetricoHTML = "";
  if (volumetrico.calculado) {
    seccionVolumetricoHTML = `
      <div class="pdf-section-title">2. DETERMINACIÓN DE DENSIDAD Y PESO VOLUMÉTRICO (${volumetrico.metodo === "parafina" ? "NTP 339.139 Parafina" : "ASTM D7263 Cilindro"})</div>
      <table class="pdf-data-table">
        <thead>
          <tr>
            <th>Parámetro Húmedo</th>
            <th>Símbolo</th>
            <th>Valor</th>
            <th>Unidad</th>
            <th>Parámetro Seco</th>
            <th>Símbolo</th>
            <th>Valor</th>
            <th>Unidad</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Densidad Natural Húmeda</td>
            <td>ρm</td>
            <td style="text-align: right; font-weight: bold;">${volumetrico.rho_humeda.toFixed(3)}</td>
            <td>g/cm³</td>
            <td>Densidad Seca</td>
            <td>ρd</td>
            <td style="text-align: right; font-weight: bold;">${volumetrico.rho_seca ? volumetrico.rho_seca.toFixed(3) : '—'}</td>
            <td>g/cm³</td>
          </tr>
          <tr>
            <td>Peso Volumétrico Húmedo</td>
            <td>γm</td>
            <td style="text-align: right; font-weight: bold; color: #b71c1c;">${volumetrico.gamma_kn_m3.toFixed(3)}</td>
            <td>kN/m³</td>
            <td>Peso Volumétrico Seco</td>
            <td>γd</td>
            <td style="text-align: right; font-weight: bold; color: #b71c1c;">${volumetrico.gamma_seca ? volumetrico.gamma_seca.toFixed(3) : '—'}</td>
            <td>kN/m³</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  let seccionGravedadHTML = "";
  if (gravedad.calculado) {
    seccionGravedadHTML = `
      <div class="pdf-section-title">3. DETERMINACIÓN DE GRAVEDAD ESPECÍFICA DE SÓLIDOS (ASTM D854 / NTP 339.131)</div>
      <table class="pdf-data-table">
        <thead>
          <tr>
            <th>Temp. Ensayo (Tt)</th>
            <th>Densidad Agua (ρw,t)</th>
            <th>Factor Temp. (K)</th>
            <th>Gt (a Tt)</th>
            <th>Gravedad Específica (Gs @ 20°C)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align: center;">${gravedad.temp.toFixed(1)} °C</td>
            <td style="text-align: center;">${gravedad.rho_w.toFixed(5)} g/mL</td>
            <td style="text-align: center;">${gravedad.k.toFixed(5)}</td>
            <td style="text-align: center; font-weight: bold;">${gravedad.gt.toFixed(3)}</td>
            <td style="text-align: center; font-weight: bold; color: #1565c0; font-size: 9.5pt;">${gravedad.gs.toFixed(3)}</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  const gamma_w = 9.80665;
  let e0Str = "—";
  let nStr = "—";
  let srStr = "—";

  if (volumetrico.calculado && volumetrico.gamma_seca && gravedad.calculado && gravedad.gs) {
    const e0 = (gravedad.gs * gamma_w) / volumetrico.gamma_seca - 1.0;
    if (e0 > 0) {
      e0Str = e0.toFixed(3);
      nStr = `${((e0 / (1.0 + e0)) * 100).toFixed(2)} %`;
      const wEff = volumetrico.humedad !== null ? volumetrico.humedad : (humedad.promedio !== null ? humedad.promedio : null);
      if (wEff !== null) {
        srStr = `${((wEff * gravedad.gs) / e0).toFixed(2)} %`;
      }
    }
  }

  const contentHTML = `
    <div class="pdf-report-page">
      <div class="pdf-header">
        <div class="pdf-title-main">LABORATORIO DE MECÁNICA DE SUELOS • ING. GEOLÓGICA FIGMM</div>
        <div class="pdf-title-sub">INFORME GENERAL DEL LABORATORIO N.º 1</div>
        <div class="pdf-norm-ref">Propiedades Índice y Relaciones Físicas Fundamentales (ASTM D2216 / D854 / NTP 339)</div>
      </div>

      ${getPlantillaMetadatosHTML()}

      <div class="pdf-section-title">CUADRO RESUMEN: SÍNTESIS DE PROPIEDADES FÍSICAS OBTENIDAS</div>
      <table class="pdf-data-table">
        <thead>
          <tr>
            <th>Parámetro Geotécnico</th>
            <th>Símbolo</th>
            <th>Valor Obtenido</th>
            <th>Unidad</th>
            <th>Norma / Método</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Contenido de Humedad Natural</td>
            <td><strong>w</strong></td>
            <td style="text-align: right; font-weight: bold; color: #1565c0;">${humedad.calculado ? humedad.promedio.toFixed(2) : '—'}</td>
            <td>%</td>
            <td>ASTM D2216 / NTP 339.127</td>
          </tr>
          <tr>
            <td>Densidad Natural Húmeda</td>
            <td><strong>ρm</strong></td>
            <td style="text-align: right; font-weight: bold;">${volumetrico.calculado ? volumetrico.rho_humeda.toFixed(3) : '—'}</td>
            <td>g/cm³</td>
            <td>${volumetrico.metodo === "parafina" ? "NTP 339.139 Parafina" : "ASTM D7263"}</td>
          </tr>
          <tr>
            <td>Peso Volumétrico Natural Húmedo</td>
            <td><strong>γm</strong></td>
            <td style="text-align: right; font-weight: bold; color: #b71c1c;">${volumetrico.calculado ? volumetrico.gamma_kn_m3.toFixed(3) : '—'}</td>
            <td>kN/m³</td>
            <td>${volumetrico.metodo === "parafina" ? "NTP 339.139 Parafina" : "ASTM D7263"}</td>
          </tr>
          <tr>
            <td>Densidad Seca</td>
            <td><strong>ρd</strong></td>
            <td style="text-align: right; font-weight: bold;">${(volumetrico.calculado && volumetrico.rho_seca) ? volumetrico.rho_seca.toFixed(3) : '—'}</td>
            <td>g/cm³</td>
            <td>${volumetrico.metodo === "parafina" ? "NTP 339.139 Parafina" : "ASTM D7263"}</td>
          </tr>
          <tr>
            <td>Peso Volumétrico Seco</td>
            <td><strong>γd</strong></td>
            <td style="text-align: right; font-weight: bold; color: #b71c1c;">${(volumetrico.calculado && volumetrico.gamma_seca) ? volumetrico.gamma_seca.toFixed(3) : '—'}</td>
            <td>kN/m³</td>
            <td>${volumetrico.metodo === "parafina" ? "NTP 339.139 Parafina" : "ASTM D7263"}</td>
          </tr>
          <tr>
            <td>Gravedad Específica de Sólidos</td>
            <td><strong>Gs (@ 20°C)</strong></td>
            <td style="text-align: right; font-weight: bold; color: #1565c0;">${gravedad.calculado ? gravedad.gs.toFixed(3) : '—'}</td>
            <td>adimensional</td>
            <td>ASTM D854 / NTP 339.131</td>
          </tr>
          <tr>
            <td>Relación de Vacíos Inicial (Estimada)</td>
            <td><strong>e₀</strong></td>
            <td style="text-align: right; font-weight: bold;">${e0Str}</td>
            <td>adimensional</td>
            <td>Relaciones volumétricas</td>
          </tr>
          <tr>
            <td>Porosidad (Estimada)</td>
            <td><strong>n</strong></td>
            <td style="text-align: right; font-weight: bold;">${nStr}</td>
            <td>%</td>
            <td>Relaciones volumétricas</td>
          </tr>
          <tr>
            <td>Grado de Saturación (Estimado)</td>
            <td><strong>Sr</strong></td>
            <td style="text-align: right; font-weight: bold;">${srStr}</td>
            <td>%</td>
            <td>Relaciones volumétricas</td>
          </tr>
        </tbody>
      </table>

      ${seccionHumedadHTML}
      ${seccionVolumetricoHTML}
      ${seccionGravedadHTML}

      ${getPlantillaFirmasHTML()}
    </div>
  `;

  printContainer.innerHTML = contentHTML;
  ejecutarDescargaPDF(filename);
}

function generarPDFConsolidadoLab2() {
  const printContainer = document.getElementById("print-container");
  const g = GeoState.ensayos.granulometria;
  const filename = `Informe_Granulometria_${GeoState.proyecto.muestra}.pdf`;

  let filasHTML = g.tamices.map(t => `
    <tr>
      <td style="text-align: center; font-weight: bold;">${t.nombre}</td>
      <td style="text-align: center;">${t.abertura > 0 ? t.abertura.toFixed(3) : '—'}</td>
      <td style="text-align: right;">${t.m1 > 0 ? t.m1.toFixed(2) : '—'}</td>
      <td style="text-align: right;">${t.m2 > 0 ? t.m2.toFixed(2) : '—'}</td>
      <td style="text-align: right; font-weight: bold;">${g.modo === "porcentajes" ? '—' : t.corregido.toFixed(2)}</td>
      <td style="text-align: right;">${t.porc_parcial.toFixed(2)} %</td>
      <td style="text-align: right;">${t.porc_acumulado.toFixed(2)} %</td>
      <td style="text-align: right; font-weight: bold; color: #1565c0;">${t.porc_pasa.toFixed(2)} %</td>
    </tr>
  `).join("");

  let chartImgHTML = "";
  if (granuChartInstance) {
    try {
      const dataUrl = safeChartImage(granuChartInstance);
      if (!dataUrl) throw new Error("Gráfico no visible: abra la vista del ensayo para incluirlo.");
      chartImgHTML = `
        <div class="pdf-section-title">CURVA GRANULOMÉTRICA SEMILOGARÍTMICA (ASTM D6913)</div>
        <div style="text-align: center; margin-bottom: 12px; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 4px; padding: 6px;">
          <img src="${dataUrl}" style="max-width: 100%; height: auto; max-height: 200px;" />
        </div>
      `;
    } catch (e) {
      console.warn("No se pudo exportar la imagen de Chart.js:", e);
    }
  }

  const contentHTML = `
    <div class="pdf-report-page">
      <div class="pdf-header">
        <div class="pdf-title-main">LABORATORIO DE MECÁNICA DE SUELOS • ING. GEOLÓGICA FIGMM</div>
        <div class="pdf-title-sub">INFORME TÉCNICO: ANÁLISIS GRANULOMÉTRICO POR TAMIZADO</div>
        <div class="pdf-norm-ref">Normas de referencia: ASTM D6913 / D6913M • NTP 339.128</div>
      </div>

      ${getPlantillaMetadatosHTML()}
      ${getPlantillaEncabezadoGranuHTML()}

      ${g.modo === "porcentajes" ? `<p style="font-size:8.5pt;"><em>Granulometría calculada a partir de porcentajes ingresados directamente (sin masas retenidas).</em></p>` : `
      <div class="pdf-section-title">CONTROL DE MASAS Y PÉRDIDA POR LAVADO EN MALLA N.° 200</div>
      <table class="pdf-data-table">
        <thead>
          <tr>
            <th>Masa Seca Total${g.metodo === "compuesto" ? ` (K = ${g.factor_k.toFixed(4)})` : " (W₁)"}</th>
            <th>Masa Seca Lavada (W₀)</th>
            <th>Pérdida por Lavado</th>
            <th>% Pérdida Finos</th>
            <th>Error de Tamizado (ΔError)</th>
            <th>Criterio Tolerancia</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align: right; font-weight: bold;">${g.masa_total.toFixed(2)} g</td>
            <td style="text-align: right; font-weight: bold;">${g.masa_lavada.toFixed(2)} g</td>
            <td style="text-align: right; font-weight: bold; color: #b71c1c;">${g.perdida_lavado.toFixed(2)} g</td>
            <td style="text-align: right; font-weight: bold; color: #b71c1c;">${g.porc_perdida_lavado.toFixed(2)} %</td>
            <td style="text-align: right; font-weight: bold;">${g.porc_error.toFixed(2)} %</td>
            <td style="text-align: center; color: ${g.porc_error <= 1.0 ? '#16a34a' : '#b71c1c'}; font-weight: bold;">
              ${g.porc_error <= 1.0 ? 'Conforme (≤ 1.0%)' : 'Revisar (> 1.0%)'}
            </td>
          </tr>
        </tbody>
      </table>`}

      ${g.comp ? `
      <div class="pdf-section-title">HOMOGENIZACIÓN PARTE GRUESA / PARTE FINA (MÉTODO COMPUESTO)</div>
      <table class="pdf-data-table">
        <thead><tr><th>Humedad fina / gruesa</th><th>Masa seca gruesa</th><th>Masa seca fina total</th><th>Submuestra fina seca (Mo)</th><th>M-1 platillo grueso</th><th>Pérdida lavado gruesa</th><th>Factor K</th></tr></thead>
        <tbody><tr>
          <td style="text-align:center;">${g.comp.humedad_fina.toFixed(2)} % / ${g.comp.humedad_gruesa !== null ? g.comp.humedad_gruesa.toFixed(2) + " %" : "—"}</td>
          <td style="text-align:right;">${g.comp.masa_seca_gruesa.toFixed(1)} g</td>
          <td style="text-align:right;">${g.comp.masa_seca_fina_total.toFixed(1)} g</td>
          <td style="text-align:right;">${g.comp.masa_seca_submuestra.toFixed(1)} g</td>
          <td style="text-align:right;">${g.comp.platillo_m1.toFixed(1)} g</td>
          <td style="text-align:right;">${g.comp.perdida_gruesa.toFixed(1)} g</td>
          <td style="text-align:center;font-weight:bold;color:#b71c1c;">${g.factor_k.toFixed(4)}</td>
        </tr></tbody>
      </table>` : ""}

      <div class="pdf-section-title">REGISTRO DE TAMIZADO POR SERIE ASTM E11</div>
      <table class="pdf-data-table">
        <thead>
          <tr>
            <th>Tamiz</th>
            <th>Abertura (mm)</th>
            <th>M-1 Gruesa (g)</th>
            <th>M-2 Fina (g)</th>
            <th>Masa única (g)</th>
            <th>% Parcial</th>
            <th>% Acumulado</th>
            <th>% Que Pasa</th>
          </tr>
        </thead>
        <tbody>
          ${filasHTML}
        </tbody>
      </table>

      ${chartImgHTML}

      <div class="pdf-section-title">PARÁMETROS DE GRADACIÓN</div>
      <table class="pdf-data-table">
        <thead>
          <tr>
            <th>% Grava (&gt; N°4)</th>
            <th>% Arena (N°4 a N°200)</th>
            <th>% Finos (&lt; N°200)</th>
            <th>D₁₀ (mm)</th>
            <th>D₃₀ (mm)</th>
            <th>D₆₀ (mm)</th>
            <th>Cu</th>
            <th>Cc</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align: right; font-weight: bold; color: #b71c1c;">${g.grava.toFixed(2)} %</td>
            <td style="text-align: right; font-weight: bold; color: #1565c0;">${g.arena.toFixed(2)} %</td>
            <td style="text-align: right; font-weight: bold; color: #b71c1c;">${g.finos.toFixed(2)} %</td>
            <td style="text-align: right;">${g.d10 ? g.d10.toFixed(3) : '—'}</td>
            <td style="text-align: right;">${g.d30 ? g.d30.toFixed(3) : '—'}</td>
            <td style="text-align: right;">${g.d60 ? g.d60.toFixed(3) : '—'}</td>
            <td style="text-align: right; font-weight: bold;">${g.cu ? g.cu.toFixed(2) : '—'}</td>
            <td style="text-align: right; font-weight: bold;">${g.cc ? g.cc.toFixed(2) : '—'}</td>
          </tr>
        </tbody>
      </table>


      ${g.observaciones ? `
        <div class="pdf-section-title">OBSERVACIONES</div>
        <p style="font-size: 8.5pt; margin-bottom: 12px;">${g.observaciones}</p>
      ` : ''}

      ${getPlantillaFirmasHTML()}
    </div>
  `;

  printContainer.innerHTML = contentHTML;
  ejecutarDescargaPDF(filename);
}

// Evita cortes feos: cada título se mantiene junto a su tabla corta y los gráficos no se parten
function prepararSaltosPDF(root) {
  root.querySelectorAll(".pdf-section-title").forEach(t => {
    const n = t.nextElementSibling;
    if (!n || (t.parentElement && t.parentElement.classList.contains("pdf-keep"))) return;
    if (n.offsetHeight <= 330) {
      const w = document.createElement("div");
      w.className = "pdf-keep";
      t.parentNode.insertBefore(w, t);
      w.appendChild(t);
      w.appendChild(n);
    }
  });
  root.querySelectorAll("img").forEach(img => {
    const p = img.parentElement;
    if (p && p !== root) p.classList.add("pdf-keep");
  });
}

function ejecutarDescargaPDF(nombreArchivo) {
  showToast("Generando documento PDF oficial...");

  const element = document.getElementById("print-container");
  element.style.display = "block";
  prepararSaltosPDF(element);

  const opt = {
    margin: [10, 12, 10, 12],
    filename: nombreArchivo,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'], avoid: ['.pdf-keep', '.pdf-signatures', 'tr'] }
  };

  if (window.html2pdf) {
    html2pdf().set(opt).from(element).save().then(() => {
      element.style.display = "none";
      showToast("¡PDF generado y descargado correctamente!");
    }).catch(err => {
      console.warn("Fallo html2pdf, abriendo diálogo nativo de impresión:", err);
      element.style.display = "none";
      window.print();
    });
  } else {
    element.style.display = "none";
    window.print();
  }
}

// Informe GENERAL de resultados (todos los ensayos calculados en un solo PDF)
function generarPDFGeneral() {
  const { humedad, volumetrico, gravedad, granulometria, atterberg, proctor } = GeoState.ensayos;
  const algo = humedad.calculado || volumetrico.calculado || gravedad.calculado || granulometria.calculado || atterberg.calculado || proctor.calculado;
  if (!algo) {
    alert("Aún no hay resultados.\n\nCalcula al menos un ensayo (Humedad, Peso Volumétrico, Gravedad, Granulometría, Atterberg o Proctor) antes de generar el informe general.");
    return;
  }

  // Relaciones derivadas (e₀, n, Sr)
  const gamma_w = 9.80665;
  let e0Str = "—", nStr = "—", srStr = "—";
  if (volumetrico.calculado && volumetrico.gamma_seca && gravedad.calculado && gravedad.gs) {
    const e0 = (gravedad.gs * gamma_w) / volumetrico.gamma_seca - 1.0;
    if (e0 > 0) {
      e0Str = e0.toFixed(3);
      nStr = `${((e0 / (1.0 + e0)) * 100).toFixed(2)} %`;
      const wEff = volumetrico.humedad !== null ? volumetrico.humedad : (humedad.promedio !== null ? humedad.promedio : null);
      if (wEff !== null) srStr = `${((wEff * gravedad.gs) / e0).toFixed(2)} %`;
    }
  }

  const fisicasHTML = `
    <div class="pdf-section-title">1. PROPIEDADES ÍNDICE Y FÍSICAS</div>
    <table class="pdf-data-table">
      <thead><tr><th>Parámetro</th><th>Símbolo</th><th>Valor</th><th>Unidad</th><th>Norma / Método</th></tr></thead>
      <tbody>
        <tr><td>Contenido de Humedad Natural</td><td><strong>w</strong></td><td style="text-align:right;font-weight:bold;color:#1565c0;">${humedad.calculado ? humedad.promedio.toFixed(2) : '—'}</td><td>%</td><td>ASTM D2216</td></tr>
        <tr><td>Densidad Natural Húmeda</td><td><strong>ρm</strong></td><td style="text-align:right;font-weight:bold;">${volumetrico.calculado ? volumetrico.rho_humeda.toFixed(3) : '—'}</td><td>g/cm³</td><td>ASTM D7263</td></tr>
        <tr><td>Peso Volumétrico Húmedo</td><td><strong>γm</strong></td><td style="text-align:right;font-weight:bold;color:#b71c1c;">${volumetrico.calculado ? volumetrico.gamma_kn_m3.toFixed(3) : '—'}</td><td>kN/m³</td><td>ASTM D7263</td></tr>
        <tr><td>Densidad Seca</td><td><strong>ρd</strong></td><td style="text-align:right;font-weight:bold;">${(volumetrico.calculado && volumetrico.rho_seca) ? volumetrico.rho_seca.toFixed(3) : '—'}</td><td>g/cm³</td><td>ASTM D7263</td></tr>
        <tr><td>Peso Volumétrico Seco</td><td><strong>γd</strong></td><td style="text-align:right;font-weight:bold;color:#b71c1c;">${(volumetrico.calculado && volumetrico.gamma_seca) ? volumetrico.gamma_seca.toFixed(3) : '—'}</td><td>kN/m³</td><td>ASTM D7263</td></tr>
        <tr><td>Gravedad Específica de Sólidos</td><td><strong>Gs</strong></td><td style="text-align:right;font-weight:bold;color:#1565c0;">${(gravedad.calculado && gravedad.gs) ? gravedad.gs.toFixed(3) : '—'}</td><td>—</td><td>ASTM D854</td></tr>
        <tr><td>Relación de Vacíos (estimada)</td><td><strong>e₀</strong></td><td style="text-align:right;">${e0Str}</td><td>—</td><td>Correlación de fases</td></tr>
        <tr><td>Porosidad (estimada)</td><td><strong>n</strong></td><td style="text-align:right;">${nStr}</td><td>%</td><td>Correlación de fases</td></tr>
        <tr><td>Grado de Saturación (estimado)</td><td><strong>Sr</strong></td><td style="text-align:right;">${srStr}</td><td>%</td><td>Correlación de fases</td></tr>
      </tbody>
    </table>
  `;

  let granuHTML = "";
  if (granulometria.calculado) {
    const g = granulometria;
    const kInfo = g.metodo === "compuesto" ? `Factor K = ${g.factor_k.toFixed(4)}` : "";
    granuHTML = `
      ${getPlantillaEncabezadoGranuHTML()}
      <div class="pdf-section-title">2. ANÁLISIS GRANULOMÉTRICO POR TAMIZADO (ASTM D6913)</div>
      <table class="pdf-data-table">
        <thead><tr><th>% Grava</th><th>% Arena</th><th>% Finos</th><th>D10 (mm)</th><th>D30 (mm)</th><th>D60 (mm)</th><th>Cu</th><th>Cc</th></tr></thead>
        <tbody>
          <tr>
            <td style="text-align:center;">${g.grava.toFixed(1)}</td>
            <td style="text-align:center;">${g.arena.toFixed(1)}</td>
            <td style="text-align:center;">${g.finos.toFixed(1)}</td>
            <td style="text-align:center;">${g.d10 ? g.d10.toFixed(3) : '—'}</td>
            <td style="text-align:center;">${g.d30 ? g.d30.toFixed(3) : '—'}</td>
            <td style="text-align:center;">${g.d60 ? g.d60.toFixed(3) : '—'}</td>
            <td style="text-align:center;">${g.cu ? g.cu.toFixed(2) : '—'}</td>
            <td style="text-align:center;">${g.cc ? g.cc.toFixed(2) : '—'}</td>
          </tr>
        </tbody>
      </table>
      <p style="font-size:8pt;color:#555;margin-top:4px;">${kInfo}</p>
    `;
  }

  const contentHTML = `
    <div class="pdf-report-page">
      <div class="pdf-header">
        <div class="pdf-title-main">LABORATORIO DE MECÁNICA DE SUELOS • ING. GEOLÓGICA FIGMM</div>
        <div class="pdf-title-sub">INFORME GENERAL DE RESULTADOS</div>
        <div class="pdf-norm-ref">Resumen integral de ensayos de laboratorio de Mecánica de Suelos</div>
      </div>
      ${getPlantillaMetadatosHTML()}
      ${fisicasHTML}
      ${granuHTML}
      ${getSeccionPDFAtterberg("3. ")}
      ${getSeccionPDFProctor("4. ")}
      <div style="margin-top:28px;">${getPlantillaFirmasHTML()}</div>
    </div>
  `;

  document.getElementById("print-container").innerHTML = contentHTML;
  ejecutarDescargaPDF(`Informe_General_Resultados_${GeoState.proyecto.muestra}.pdf`);
}

// 9. UTILIDADES Y NOTIFICACIONES TOAST
function showToast(mensaje) {
  let toast = document.getElementById("geo-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "geo-toast";
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 500;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      border-left: 4px solid #16a34a;
      z-index: 1000;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.25s ease;
      pointer-events: none;
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = mensaje;
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
  }, 3200);
}
