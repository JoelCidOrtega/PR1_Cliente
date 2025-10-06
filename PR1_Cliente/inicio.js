function empezar() {
  let nombre = document.getElementById('nombre');
  if (nombre.value !== "") {
    alert("¡Hola " + nombre.value + "! Buena suerte en el concurso.");
    window.location.href = "/preguntas.html";
  } else {
    alert("Por favor, escribe tu nombre.");
  }
}

let preguntasMezcladas = [];
let yaRespondido = false;

if (window.location.pathname.endsWith('/preguntas.html')) {
  fetch('preguntas.json')
    .then(respuesta => respuesta.json())
    .then(datos => {
      preguntasMezcladas = datos.preguntas.sort(() => Math.random() - 0.5);
      let formulario = document.getElementById('formulario-preguntas');

      for (let i = 0; i < 2; i++) {
        let pregunta = preguntasMezcladas[i];
        let bloque = document.createElement('div');
        bloque.innerHTML = `<h3>${pregunta.pregunta}</h3>`;
        for (let j in pregunta.opciones) {
          bloque.innerHTML += `<label><input type="radio" name="p${i}" value="${j}"> ${pregunta.opciones[j]}</label><br>`;
        }
        formulario.appendChild(bloque);
      }

      let boton = document.createElement('button');
      boton.type = "button";
      boton.textContent = "Enviar";
      formulario.appendChild(boton);

      boton.onclick = function () {
        if (yaRespondido) return;

        for (let i = 0; i < 2; i++) {
          let seleccion = document.querySelector(`input[name="p${i}"]:checked`);
          if (!seleccion) {
            alert("Responde todas las preguntas");
            return;
          }
          if (parseInt(seleccion.value) !== preguntasMezcladas[i].respuesta_correcta) {
            alert("Fallaste alguna pregunta");
            return;
          }
        }

        for (let i = 0; i < 2; i++) {
          document.querySelectorAll(`input[name="p${i}"]`).forEach(op => op.disabled = true);
        }

        yaRespondido = true;
        boton.style.display = "none";

        for (let i = 2; i < 4; i++) {
          let pregunta = preguntasMezcladas[i];
          let bloque = document.createElement('div');
          bloque.innerHTML = `<h3>${pregunta.pregunta}</h3>`;
          for (let j in pregunta.opciones) {
            bloque.innerHTML += `<label><input type="radio" name="p${i}" value="${j}"> ${pregunta.opciones[j]}</label><br>`;
          }
          formulario.appendChild(bloque);
        }

        let botonFinal = document.createElement('button');
        botonFinal.type = "button";
        botonFinal.textContent = "Validar";
        formulario.appendChild(botonFinal);

        botonFinal.onclick = function () {
          for (let i = 2; i < 4; i++) {
            let seleccion = document.querySelector(`input[name="p${i}"]:checked`);
            if (!seleccion) {
              alert("Responde todas las preguntas");
              return;
            }
            if (parseInt(seleccion.value) !== preguntasMezcladas[i].respuesta_correcta) {
              alert("Fallaste alguna de las preguntas");
              botonFinal.disabled = true;
              return;
            }
          }

          alert("¡Todas las respuestas son correctas!");
          for (let i = 2; i < 4; i++) {
            document.querySelectorAll(`input[name="p${i}"]`).forEach(op => op.disabled = true);
          }
          botonFinal.style.display = "none";
        };
      };
    });
}
