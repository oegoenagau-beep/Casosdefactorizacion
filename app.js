"use strict";
// ---------- Datos: 8 casos de factorización ----------
const CASOS = [
 {n:"Factor Común",f:"ab + ac = a(b + c)",
  pasos:["Halla el MCD de los coeficientes.","Toma las letras comunes con su menor exponente.","Divide cada término entre ese factor común."],
  ej:["6x² + 9x = 3x(2x + 3)"],
  ex:[["6x² + 9x","3x(2x+3)","Factor común: 3x"],["4a³b − 8a²b²","4a²b(a-2b)","MCD 4, a², b"]]},
 {n:"Diferencia de Cuadrados",f:"a² − b² = (a + b)(a − b)",
  pasos:["Extrae la raíz cuadrada de cada término.","Escribe el producto de la suma por la diferencia."],
  ej:["x² − 49 = (x + 7)(x − 7)"],
  ex:[["x² − 49","(x+7)(x-7)","√x²=x, √49=7"],["25y² − 16","(5y+4)(5y-4)","√25y²=5y, √16=4"]]},
 {n:"Trinomio Cuadrado Perfecto",f:"a² ± 2ab + b² = (a ± b)²",
  pasos:["Verifica que dos términos sean cuadrados perfectos.","Comprueba que el término central sea el doble producto de las raíces.","Escribe el binomio al cuadrado."],
  ej:["x² + 10x + 25 = (x + 5)²"],
  ex:[["x² + 10x + 25","(x+5)^2","2·x·5 = 10x"],["9a² − 12a + 4","(3a-2)^2","2·3a·2 = 12a"]]},
 {n:"Suma y Diferencia de Cubos",f:"a³ ± b³ = (a ± b)(a² ∓ ab + b²)",
  pasos:["Extrae la raíz cúbica de cada término.","Aplica la fórmula: binomio × trinomio con signos alternados."],
  ej:["x³ + 27 = (x + 3)(x² − 3x + 9)"],
  ex:[["x³ + 27","(x+3)(x^2-3x+9)","∛27 = 3"],["8m³ − 1","(2m-1)(4m^2+2m+1)","∛8m³ = 2m"]]},
 {n:"Trinomio x² + bx + c",f:"x² + bx + c = (x + p)(x + q), p+q=b, p·q=c",
  pasos:["Busca dos números que multipliquen c.","Que además sumen b.","Escribe (x + p)(x + q)."],
  ej:["x² + 7x + 12 = (x + 3)(x + 4)"],
  ex:[["x² + 7x + 12","(x+3)(x+4)","3·4=12, 3+4=7"],["x² − x − 20","(x-5)(x+4)","−5·4=−20, −5+4=−1"]]},
 {n:"Trinomio ax² + bx + c",f:"Descomposición del término central",
  pasos:["Multiplica a·c.","Busca dos números que multipliquen a·c y sumen b.","Separa bx en esos dos términos y factoriza por agrupación."],
  ej:["2x² + 7x + 3 = (2x + 1)(x + 3)"],
  ex:[["2x² + 7x + 3","(2x+1)(x+3)","a·c=6 → 1 y 6"],["6x² − 5x − 4","(3x-4)(2x+1)","a·c=−24 → −8 y 3"]]},
 {n:"Factorización por Agrupación",f:"ax + ay + bx + by = (a + b)(x + y)",
  pasos:["Agrupa términos con factor común.","Saca factor común en cada grupo.","Saca el binomio común."],
  ej:["x³ + 2x² + 3x + 6 = (x + 2)(x² + 3)"],
  ex:[["ax + ay + bx + by","(a+b)(x+y)","Agrupa ax+ay y bx+by"],["x³ + 2x² + 3x + 6","(x+2)(x^2+3)","x²(x+2) + 3(x+2)"]]},
 {n:"Factorización Mixta",f:"Combina varios casos",
  pasos:["Saca primero el factor común.","Identifica el caso del factor restante.","Factoriza hasta que no se pueda más."],
  ej:["2x² − 32 = 2(x + 4)(x − 4)"],
  ex:[["2x² − 32","2(x+4)(x-4)","Común 2, luego dif. de cuadrados"],["3x³ − 12x","3x(x+2)(x-2)","Común 3x, luego dif. de cuadrados"]]}
];

// ---------- Estado (localStorage) ----------
let S = {xp:0, hechos:{}, tema:"claro"};
try { Object.assign(S, JSON.parse(localStorage.getItem("factor_s")||"{}")); } catch(e){}
const guardar = () => { try{localStorage.setItem("factor_s",JSON.stringify(S));}catch(e){} };
const $ = s => document.querySelector(s), app = $("#app");

function cabecera(){
  $("#xp").textContent = S.xp+" XP";
  $("#nivel").textContent = "Nivel "+(1+Math.floor(S.xp/100));
  document.documentElement.dataset.tema = S.tema;
}

// ---------- Verificación local ----------
function normalizar(t){
  t = t.toLowerCase().replace(/[−–]/g,"-").replace(/²/g,"^2").replace(/³/g,"^3")
       .replace(/\*\*/g,"^").replace(/[\s*·]/g,"");
  const i = t.indexOf("("), pre = i<0 ? t : t.slice(0,i), resto = i<0 ? "" : t.slice(i);
  const grupos = [];
  (resto.match(/\([^()]*\)(\^\d+)?/g)||[]).forEach(g=>{
    const m = g.match(/\(([^()]*)\)(?:\^(\d+))?/), veces = +(m[2]||1);
    let inter = m[1]; if(!/^[+-]/.test(inter)) inter="+"+inter;
    const g2 = (inter.match(/[+-][^+-]+/g)||[]).sort().join("");
    for(let k=0;k<veces;k++) grupos.push(g2);
  });
  return pre+"|"+grupos.sort().join("|");
}
const esCorrecta = (a,b) => normalizar(a)===normalizar(b);

// ---------- Vistas ----------
function inicio(){
  app.innerHTML = `<h2>Elige un caso</h2><div class="grid">`+CASOS.map((c,i)=>{
    const h = S.hechos[i]||0, p = Math.round(h/c.ex.length*100);
    return `<button class="card caso" data-i="${i}"><span>Caso ${i+1}</span><b>${c.n}</b>
      <div class="barra"><i style="width:${p}%"></i></div><span>${h}/${c.ex.length} ejercicios</span></button>`;
  }).join("")+`</div>`;
  app.querySelectorAll(".caso").forEach(b=>b.onclick=()=>caso(+b.dataset.i,"teoria"));
}

function caso(i,tab){
  const c = CASOS[i];
  const tabs = [["teoria","Teoría"],["ejemplos","Ejemplos"],["ejercicios","Ejercicios"]];
  let cuerpo = "";
  if(tab==="teoria") cuerpo = `<div class="formula">${c.f}</div><ol>${c.pasos.map(p=>`<li>${p}</li>`).join("")}</ol>`;
  if(tab==="ejemplos") cuerpo = c.ej.map(e=>`<div class="formula">${e}</div>`).join("");
  if(tab==="ejercicios") cuerpo = c.ex.map((e,k)=>`<div class="card" style="margin-bottom:12px">
      <b>${k+1}. Factoriza: ${e[0]}</b>
      <input type="text" id="r${k}" placeholder="Ej: (x+2)(x-3)  · usa ^ para potencias" autocomplete="off">
      <button class="btn" data-k="${k}">Comprobar</button>
      <button class="btn sec" data-p="${k}">Pista</button>
      <div class="fb" id="f${k}"></div></div>`).join("");
  app.innerHTML = `<button class="btn sec" id="volver">← Casos</button>
    <h2>Caso ${i+1}: ${c.n}</h2>
    <div class="tabs">${tabs.map(t=>`<button class="${t[0]===tab?"on":""}" data-t="${t[0]}">${t[1]}</button>`).join("")}</div>
    <div class="card">${cuerpo}</div>`;
  $("#volver").onclick = inicio;
  app.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>caso(i,b.dataset.t));
  app.querySelectorAll("[data-k]").forEach(b=>b.onclick=()=>{
    const k=+b.dataset.k, v=$("#r"+k).value.trim(), fb=$("#f"+k);
    if(!v){fb.className="fb bad";fb.textContent="Escribe tu respuesta.";return;}
    if(esCorrecta(v,c.ex[k][1])){
      fb.className="fb ok"; fb.textContent="¡Correcto! +10 XP";
      const clave=i+"-"+k; S.ya=S.ya||{};
      if(!S.ya[clave]){S.ya[clave]=1;S.xp+=10;S.hechos[i]=(S.hechos[i]||0)+1;guardar();cabecera();}
    } else { fb.className="fb bad"; fb.textContent="Aún no. Revisa los pasos e inténtalo de nuevo."; }
  });
  app.querySelectorAll("[data-p]").forEach(b=>b.onclick=()=>{
    const k=+b.dataset.p; $("#f"+k).className="fb pista"; $("#f"+k).textContent="Pista: "+c.ex[k][2];
  });
}

$("#tema").onclick = () => { S.tema = S.tema==="claro"?"oscuro":"claro"; guardar(); cabecera(); };
cabecera(); inicio();
