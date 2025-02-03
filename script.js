window.onload = function (){
    var startBtn = document.getElementById("startBtn");
    var grid = document.getElementById("grid")

    function createStars() {
        for (var i=0; i<50; i++){
            var star = document.createElement("div");

            star.className="star";
            star.style.top= Math.random()*100 + "vh";
            star.style.left = Math.random() * 100 + "vw";
            star.style.width = Math.random() * 5 + 3 + "px";
            star.style.height = star.style.width;
            document.body.appendChild(star);
        }
    }

    function createGrid() {
        grid.innerHTML = "";
        for(var i=0; i<16; i++){
            var tile=document.createElement("div");

            tile.className= "tile";
            tile.innerText= Math.random() < 0.5 ? 2 : 4;
            grid.appendChild(tile);
        }
    }

    startBtn.onclick = function() {
    window.location.href = "game.html";
  }

    createStars();
    createGrid();
}
