document.addEventListener("DOMContentLoaded", function () {
  const audio = new Audio("mp3/mortal.mp3");
  audio.play();
  const myDiv = document.getElementById("juego-1");
  const style = document.createElement("style");

  const mouseOver = (event) => {
    // myDiv.style.opacity = 0.5;
    myDiv.classList.add("juego-1-move");
    myDiv.createElement;
  };

  const mouseOut = (event) => {
    // myDiv.style.opacity = 1;
    myDiv.classList.remove("juego-1-move");
  };

  myDiv.addEventListener("mouseover", mouseOver);
  myDiv.addEventListener("click", mouseOut);
});
