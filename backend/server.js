const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '..')));
app.use(express.json());

let votaciones = [];

app.get('/api/votaciones', (req, res) => {
    res.json(votaciones);
});

app.post('/api/votaciones', (req, res) => {

    const { titulo, opciones } = req.body;

    const nueva = {
        id: Date.now(),
        titulo,
        opciones: opciones.map(op => ({
            nombre: op,
            votos: 0
        }))
    };

    votaciones.push(nueva);

    res.json(nueva);
});

app.post('/api/votar/:id/:opcion', (req, res) => {

    const id = Number(req.params.id);
    const opcion = Number(req.params.opcion);

    const votacion = votaciones.find(v => v.id === id);

    if (!votacion) {
        return res.status(404).json({
            error: 'No encontrada'
        });
    }

    votacion.opciones[opcion].votos++;

    res.json(votacion);
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
// AÑADIR AL FINAL DEL JS

/* SONIDOS */

function playVoteSound(){
document.getElementById("voteSound").play()
}

function playDeleteSound(){
document.getElementById("deleteSound").play()
}

document.querySelectorAll("button").forEach(btn=>{
btn.addEventListener("mouseenter",()=>{
document.getElementById("hoverSound").play()
})
})

/* MODIFICAR vote() */

playVoteSound()

/* MODIFICAR deleteVote() */

playDeleteSound()

/* EASTER EGGS */

let typed=""

document.addEventListener("keydown",(e)=>{

typed += e.key.toLowerCase()

if(typed.includes("joker")){
document.body.classList.add("chaos-mode")

setTimeout(()=>{
document.body.classList.remove("chaos-mode")
},8000)

typed=""
}

if(typed.includes("bruce")){
document.body.classList.toggle("bruce-mode")
typed=""
}

if(typed.length > 30){
typed=""
}

})

/* ALFRED AI */

document.getElementById("alfredInput")
.addEventListener("keypress",function(e){

if(e.key==="Enter"){

const input=this.value.toLowerCase()

let response=""

if(input.includes("hello")){
response="Good evening, Mr. Wayne."
}

else if(input.includes("joker")){
response="The Joker has been detected in Gotham."
}

else if(input.includes("batman")){
response="Batman is currently protecting Gotham."
}

else if(input.includes("weather")){
response="Heavy rain expected tonight."
}

else{
response="I am analyzing your request."
}

document.getElementById("alfredMessages").innerHTML +=
"<br><br>> "+response

this.value=""

}

})

/* CRONOMETRO */

let stopwatch = document.createElement("div")

stopwatch.innerHTML=`
<div style="
position:fixed;
top:20px;
right:20px;
background:#000000cc;
padding:15px 25px;
border-radius:15px;
border:1px solid #d9a300;
font-size:28px;
z-index:999;
">
<span id="timer">00:00:00</span>
</div>
`

document.body.appendChild(stopwatch)

let sec=0

setInterval(()=>{

sec++

let h=Math.floor(sec/3600)
let m=Math.floor((sec%3600)/60)
let s=sec%60

document.getElementById("timer").innerText=
String(h).padStart(2,"0")+":"+
String(m).padStart(2,"0")+":"+
String(s).padStart(2,"0")

},1000)

/* MAPA */

let map=document.createElement("div")

map.innerHTML=`
<div style="
position:fixed;
left:20px;
bottom:20px;
width:200px;
height:130px;
background:url('https://i.imgur.com/FK8R4Kf.jpeg');
background-size:cover;
border:2px solid #d9a300;
border-radius:15px;
box-shadow:0 0 20px #d9a30055;
z-index:999;
"></div>
`

document.body.appendChild(map)
