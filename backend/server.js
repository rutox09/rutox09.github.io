// ---------- NAV ----------

function openSection(id){

  document.getElementById("lobby").style.display = "none";

  document.querySelectorAll(".section").forEach(section=>{
    section.style.display = "none";
  });

  document.getElementById(id).style.display = "block";
}

function goHome(){

  document.querySelectorAll(".section").forEach(section=>{
    section.style.display = "none";
  });

  document.getElementById("lobby").style.display = "grid";
}

// ---------- CONTADOR ----------

let contador = 0;

function actualizarContador(){

  document.getElementById("counterNumber").innerText = contador;
}

function sumarUno(){

  contador += 1;

  actualizarContador();
}

function sumarCustom(){

  const cantidad =
    parseInt(document.getElementById("customAmount").value) || 0;

  contador += cantidad;

  actualizarContador();
}

function restarCustom(){

  const cantidad =
    parseInt(document.getElementById("customAmount").value) || 0;

  contador -= cantidad;

  actualizarContador();
}

function reiniciarContador(){

  contador = 0;

  actualizarContador();
}
