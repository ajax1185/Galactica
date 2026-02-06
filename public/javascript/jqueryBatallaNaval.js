var id;
var idY;
var valores = [];
var valoresRandom = [];
var valoresAcertados = [];
var cumplidos = [
  "Buen tiro!",
  "Gran trabajo!",
  "WOW!",
  "Increible!",
  "Naaaaaaaa ! ",
  "Eres asombroso!",
  "Magnifico !",
  "Excelente trabajo!",
];
var inicio = false;
var numerosUnicos = new Set();
var valorActualSet;
var cantidadAcertada = 0;
// var existe = false;

$(document).ready(function () {
  while (numerosUnicos.size < 20) {
    // Ejemplo: generar 10 números únicos
    numerosUnicos.add(Math.floor(Math.random() * 53) + 1); // Rango 1-100
  }
  cantidadAcertada = [...numerosUnicos].length;
  // console.log([...numerosUnicos]);
  $("h1#contador").text([...numerosUnicos].length);
  $("h2#mensaje").text("Continua el juego");
  if (!inicio) {
    llenaValores();
  }

  $("div#id-y").on("click", function () {
    var id = $(this).attr("data-y");
    // const guatona = new Audio("mp3/bomba.mp3");
    // guatona.play();
    // $(`[data-y=${id}]`).css("background-color", "white");
    console.log(
      "largo random " +
        valoresRandom.length +
        " largo acertados " +
        valoresAcertados.length,
    );

    if (valoresRandom.length === valoresAcertados.length) {
      $("h2#mensaje").text("A acertado a todos los barcos ! es un marica");
    } else {
      var resultado = validaValor(id);
      // existe = false;
      if (resultado > 0) {
        // existe = validarSiExiste(id);

        var ingreso = validarSiExiste(id);
        if (valoresAcertados.length > 0) {
          if (ingreso === false) {
            console.log("El valor insertado es " + id);
            $(`[data-y=${resultado}]`).css("background-color", "green");
            // var ingreso = validarSiExiste(id);
            $("h1#contador").text((cantidadAcertada = cantidadAcertada - 1));
            console.log(valoresAcertados);
            console.log("Ingreso " + ingreso);
            const bombazo = new Audio("mp3/bomba.mp3");
            bombazo.play();
          }
        } else {
          const cumplido = Math.floor(Math.random() * cumplidos.length) + 1;
          $("h2#cumplido").text(cumplidos[cumplido]);
          valoresAcertados.push(resultado);
          const bombazo = new Audio("mp3/bomba.mp3");
          bombazo.play();
          $(`[data-y=${resultado}]`).css("background-color", "green");
        }
      } else {
        const nope = new Audio("mp3/nope.mp3");
        nope.play();
        $(`[data-y=${id}]`).css("background-color", "red");
      }
    }
  });
});

function llenaValores() {
  var itemValues = [];
  $("[data-y]").each(function () {
    itemValues.push($(this).data("y"));
  });

  for (var i = 0; i < 20; i++) {
    valorActualSet = [...numerosUnicos][i];
    valoresRandom.push(itemValues[valorActualSet]);
    const element = itemValues[valorActualSet];
  }
}

function validaValor(index) {
  for (var i = 0; i < valoresRandom.length; i++) {
    const valor = valoresRandom[i];
    if (parseInt(valor) === parseInt(index)) {
      return valor;
    }
  }
}

function validarSiExiste(index) {
  for (var i = 0; i < valoresAcertados.length; i++) {
    const valorIngresado = valoresAcertados[i];
    if (parseInt(valorIngresado) === parseInt(index)) {
      console.log(
        "TRUE: Valor ingresado " + valorIngresado + " index " + index,
      );
      return true;
    }
  }
  mostrarCumplido();
  valoresAcertados.push(index);
  const cumplido = Math.floor(Math.random() * cumplidos.length) + 1;
  $("h2#cumplido").text(cumplidos[cumplido]);
  if (valoresRandom.length === valoresAcertados.length) {
    $("h2#mensaje").text("A acertado a todos los barcos ! es un marica");
  }
  // console.log("FALSE: Valor ingresado " + valorIngresado + " index " + index);
  return false;
}

$("button#clickEmpezarBatalla").on("click", function () {
  $("h1#contador").css("visibility", "visible");
  $("h2#mensaje").css("visibility", "visible");
  var musicaPirata = new Audio("mp3/pirata.mp3");
  // musicaPirata.play();
  $("#clickEmpezarBatalla").animate(
    {
      left: "250px",
      opacity: "0.5",
      height: "150px",
      width: "150px",
    },
    1000,
    function () {
      // Callback function: executed after the first animation is complete
      $(this).animate(
        {
          opacity: "0",
        },
        "slow",
      );
    },
  );

  $(".container-y")
    .css({ opacity: 0, visibility: "visible" })
    .animate({ opacity: 1 }, 5000);
});

function mostrarCumplido() {
  const jhin = new Audio("mp3/jhin.mp3");
  jhin.play();
  setTimeout(function () {
    console.log("Entró al cumplido");
    $("h2#cumplido")
      .animate({
        height: "auto",
        width: "auto",
        opacity: "20px",
        left: "500px",
        // top: "300px",
      })

      .fadeIn(500)
      .fadeOut(500)
      .css("background", "#000")
      .css("visibility", "visible"); // Uses jQuery's fadeOut method
  }, 500);
}
