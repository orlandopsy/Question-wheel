let username = "";
let score = 0;
let questionsAsked = 0;
let gameQuestions = [];
const maxQuestions = 10;

const ruleta = document.getElementById("ruleta");
const spinAudio = document.getElementById("spinAudio");

// ===============================
// ❓ Banco de 20 preguntas
// ===============================
const allQuestions = [
  { pregunta: "¿Capital de Francia?", opciones: ["A) Madrid", "B) París", "C) Roma", "D) Berlín"], correcta: "B" },
  { pregunta: "¿Quién inventó la WWW?", opciones: ["A) Tim Berners-Lee", "B) Bill Gates", "C) Steve Jobs", "D) Linus Torvalds"], correcta: "A" },
  { pregunta: "¿Lenguaje usado para diseñar páginas web?", opciones: ["A) HTML", "B) C++", "C) Python", "D) Java"], correcta: "A" },
  { pregunta: "¿Qué significa CPU?", opciones: ["A) Central Process Unit", "B) Central Processing Unit", "C) Computer Personal Unit", "D) Control Processing User"], correcta: "B" },
  { pregunta: "¿Quién pintó la Mona Lisa?", opciones: ["A) Miguel Ángel", "B) Van Gogh", "C) Leonardo da Vinci", "D) Picasso"], correcta: "C" },
  { pregunta: "¿Cuántos continentes hay?", opciones: ["A) 5", "B) 6", "C) 7", "D) 8"], correcta: "C" },
  { pregunta: "¿Sistema operativo de código abierto?", opciones: ["A) Windows", "B) macOS", "C) Linux", "D) MS-DOS"], correcta: "C" },
  { pregunta: "¿Fundador de Microsoft?", opciones: ["A) Bill Gates", "B) Steve Jobs", "C) Elon Musk", "D) Mark Zuckerberg"], correcta: "A" },
  { pregunta: "¿Planeta más grande del sistema solar?", opciones: ["A) Marte", "B) Saturno", "C) Júpiter", "D) Neptuno"], correcta: "C" },
  { pregunta: "¿Cuál es el río más largo del mundo?", opciones: ["A) Amazonas", "B) Nilo", "C) Yangtsé", "D) Misisipi"], correcta: "A" },
  { pregunta: "¿Memoria volátil en una computadora?", opciones: ["A) ROM", "B) SSD", "C) RAM", "D) HDD"], correcta: "C" },
  { pregunta: "¿Primer presidente de Estados Unidos?", opciones: ["A) George Washington", "B) Lincoln", "C) Jefferson", "D) Adams"], correcta: "A" },
  { pregunta: "¿Qué mide un barómetro?", opciones: ["A) Presión atmosférica", "B) Temperatura", "C) Humedad", "D) Velocidad"], correcta: "A" },
  { pregunta: "¿Extensión de archivos JavaScript?", opciones: ["A) .java", "B) .js", "C) .jsx", "D) .script"], correcta: "B" },
  { pregunta: "¿Quién propuso la teoría de la relatividad?", opciones: ["A) Newton", "B) Einstein", "C) Galileo", "D) Tesla"], correcta: "B" },
  { pregunta: "¿Qué significa HTML?", opciones: ["A) Hyper Text Markup Language", "B) Home Tool Markup Language", "C) Hyperlinks Text Main Language", "D) Ninguna"], correcta: "A" },
  { pregunta: "¿País con mayor población?", opciones: ["A) India", "B) Estados Unidos", "C) China", "D) Rusia"], correcta: "C" },
  { pregunta: "¿Protocolo seguro en la web?", opciones: ["A) HTTP", "B) HTTPS", "C) FTP", "D) TCP"], correcta: "B" },
  { pregunta: "¿Autor de 'Cien años de soledad'?", opciones: ["A) Mario Vargas Llosa", "B) Gabriel García Márquez", "C) Pablo Neruda", "D) Jorge Luis Borges"], correcta: "B" },
  { pregunta: "¿Qué es un algoritmo?", opciones: ["A) Una receta de pasos", "B) Un lenguaje de programación", "C) Una app", "D) Un hardware"], correcta: "A" }
];

// ===============================
// 🎮 Iniciar juego
// ===============================
function startGame() {
  const userInput = document.getElementById("user").value.trim();
  if (!userInput) {
    alert("Por favor ingresa un nombre de usuario.");
    return;
  }
  username = userInput;
  score = 0;
  questionsAsked = 0;

  // elegir 10 preguntas al azar
  gameQuestions = [...allQuestions]
    .sort(() => Math.random() - 0.5)
    .slice(0, maxQuestions);

  document.getElementById("login").style.display = "none";
  document.getElementById("game").style.display = "block";

  mostrarPregunta();
}

// ===============================
// 🎡 Girar la ruleta
// ===============================
function girarRuleta() {
  if (questionsAsked >= maxQuestions) {
    alert("Ya respondiste las 10 preguntas.");
    return;
  }

  let angulo = Math.floor(Math.random() * 360) + 1080; // mínimo 3 vueltas
  ruleta.style.transform = `rotate(${angulo}deg)`;

  spinAudio.currentTime = 0;
  spinAudio.play();

  setTimeout(() => {
    mostrarPregunta();
  }, 3000);
}

// ===============================
// ❓ Mostrar pregunta actual
// ===============================
function mostrarPregunta() {
  if (questionsAsked >= gameQuestions.length) {
    alert(`¡Juego terminado! Tu puntaje es: ${score}`);
    saveScore();
    updateRanking();
    return;
  }

  const q = gameQuestions[questionsAsked];
  document.getElementById("pregunta").textContent = q.pregunta;

  const opcionesDiv = document.getElementById("opciones");
  opcionesDiv.innerHTML = "";
  q.opciones.forEach((op, i) => {
    let btn = document.createElement("button");
    btn.textContent = op;
    btn.onclick = () => validarRespuesta(q.correcta, String.fromCharCode(65 + i));
    opcionesDiv.appendChild(btn);
  });
}

// ===============================
// ✅ Validar respuesta
// ===============================
function validarRespuesta(correcta, seleccionada) {
  if (seleccionada === correcta) {
    score += 10;
  }
  questionsAsked++;
  mostrarPregunta();
}

// ===============================
// 🏆 Ranking con localStorage
// ===============================
function loadRanking() {
  return JSON.parse(localStorage.getItem("ranking")) || [];
}

function saveRanking(list) {
  localStorage.setItem("ranking", JSON.stringify(list));
}

function saveScore() {
  const list = loadRanking();
  const i = list.findIndex(x => x.user === username);

  if (i >= 0) {
    if (score > list[i].score) {
      list[i].score = score;
      list[i].questions = questionsAsked;
    }
  } else {
    list.push({ user: username, score, questions: questionsAsked });
  }

  list.sort((a, b) => b.score - a.score);
  saveRanking(list);
}

function updateRanking() {
  const list = loadRanking().slice(0, 10);
  const rankList = document.getElementById("ranking");
  rankList.innerHTML = "";
  list.forEach((r, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${r.user} — ${r.score} pts en ${r.questions} preguntas`;
    rankList.appendChild(li);
  });
}
