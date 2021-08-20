var canvas, ctx, ALTURA, LARGURA, frames = 0,
maxPulos = 3, velocidade = 7 , estadoAtual,

//maxPulos = ,  << Muda O Tanto Maximo De Pulos
//velocidade = , << Muda A Velocidade Do Personagem

estados = {
  jogar: 0,
  jogando: 1,
  perdeu: 2
},

chao = {
  y: 500,
  //y: ,  << Determina O Local Do Chão
  altura: 50,
  //altura: ,  << Determina A Altura Do Chão
  cor: "#ffdf70",
  //cor: "",  << Cor Do Chão
  
  desenha: function() {
    ctx.fillStyle = this.cor;
    ctx.fillRect(0, this.y, LARGURA, this.altura);
  }
},

bloco = {
  x: 50,
  y: 0,
  altura: 50,
  //altura: ,  << Altura Do Bloco
  largura: 50,
  //largura: ,  << Largura Do Bloco
  cor: "#80d423",
  //cor: "",  << Cor Do Bloco 
  gravidade: 1.6,
  //gravidade: ,  << Gravidade Do Bloco
  velocidade: 0,
  forcaDoPulo: 25.6,
  //forcaDoPulo: ,  << Força Do Pulo Do Bloco
  qntPulos: 0,
  
  atualiza: function() {
    this.velocidade += this.gravidade;
    this.y += this.velocidade;
    
    if (this.y > chao.y - this.altura && estadoAtual != estados.perdeu) {
      this.y = chao.y - this.altura;
      this.qntPulos = 0;
      this.velocidade = 0;
    }
  },
  
  pula: function() {
    if (this.qntPulos < maxPulos) {
    this.velocidade = -this.forcaDoPulo;
    this.qntPulos++;
    }
  },
  
  reset: function() {
    bloco.velocidade = 0;
    bloco.y = 0;
  },
  
  desenha: function(){
    ctx.fillStyle = this.cor;
    ctx.fillRect(this.x, this.y, this.altura, this.largura);
  }
},

obstaculos = {
  _obs:[],
  cores: ["#e72bb9", "#d22f2f", "#8932e1", "#15cb19", "#dec820"],
  //cores: [],  << Cores Aleatórias Dos Obstáculos
  tempoInsere: 0,
  
  insere: function() {
    this._obs.push({
      x: LARGURA,
     // largura: 30 + Math.floor(21 * Math.random()),
     largura: 50,
     // largura: ,  << Determina A Largura Dos Obstáculos
      altura: 20.5 + Math.floor(120 * Math.random()),
      //altura:  << Determina  Altura Dos Obstáculos
      cor: this.cores[Math.floor(5 * Math.random())]
    });
    
  this.tempoInsere = 50;  
  //this.tempoInsere = ;  << Determina Distância Dos Obstáculos
    
  },
  
  atualiza: function() {
    if (this.tempoInsere == 0)
    this.insere();
    else
this.tempoInsere--;

    for (var i = 0, tam = this._obs.length; i < tam; i++) {
      var obs = this._obs[i];
      
      obs.x -= velocidade;
      
      if (bloco.x < obs.x + obs.largura && bloco.x + bloco.largura >= obs.x && bloco.y + bloco.altura >= chao.y - obs.altura) {
        estadoAtual = estados.perdeu;
      }
      
     else if (obs.x <= -obs.largura) {
        this._obs.splice(i, 1);
        tam--;
        i--;
      }
    }
  },
  
  limpa: function() {
    this._obs = [];
  },
  
  desenha: function() {
    for (var i = 0, tam = this._obs.length; i < tam; i++) {
      var obs = this._obs[i];
      ctx.fillStyle = obs.cor;
      ctx.fillRect(obs.x, chao.y - obs.altura, obs.largura, obs.altura);
    }
  }
};


function clique(event) {
  if (estadoAtual == estados.jogando)
  bloco.pula();
  
  else if (estadoAtual == estados.jogar) {
    estadoAtual = estados.jogando;
  }
    
    else if (estadoAtual == estados.perdeu && bloco.y >= 3 * ALTURA) {
      //bloco.y >=  << Tempo Que Demora Para Poder Jogar Depois De Perder
    estadoAtual = estados.jogando;
      estadoAtual = estados.jogar;
      obstaculos.limpa();
      bloco.reset();
    }
}

function main() {
  ALTURA = window.innerHeight;
  LARGURA = window.innerWidth

if (LARGURA >= 100) {
  LARGURA = 425;
  ALTURA = 550;
}

//if  << Determina O Tamanho Da Canvas

canvas = document.createElement("canvas");
canvas.width = LARGURA;
canvas.height = ALTURA;
canvas.style.border = "1px solid #000";

ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
//document.addEventListener("mousedown", clique);
document.addEventListener("click", clique);

estadoAtual = estados.jogar;
roda();

}

function roda() {
  atualiza();
  desenha();
  
  window.requestAnimationFrame(roda);
  
}

function atualiza() {
  frames++;
  
  bloco.atualiza();
  
  if (estadoAtual == estados.jogando) 
  obstaculos.atualiza();
}
function desenha() {
  
  ctx.fillStyle = "#50beff";
  ctx.fillRect(0, 0, LARGURA, ALTURA);
  
  if (estadoAtual == estados.jogar) {
    ctx.fillStyle = "green";
    ctx.fillRect(LARGURA / 2 - 50, ALTURA / 2 - 50,  100, 100)
  }
  
  else if (estadoAtual == estados.perdeu) {
        ctx.fillStyle = "red";
    ctx.fillRect(LARGURA / 2 - 50, ALTURA / 2 - 50,  100, 100)
  }
  
  else if (estadoAtual == estados.jogando) 
  obstaculos.desenha();
  
  chao.desenha();
  bloco.desenha();
}



main();
//main();  << Inicializa O Jogo