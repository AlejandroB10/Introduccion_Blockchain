const SHA256 = require("../node_modules/crypto-js/sha256");

const DIFFICULTY = 3;
const MINE_RATE = 3000;

class Block {
  //Constructor de la clase recibe los parametros despues de realizar el proceso de minado
  constructor(time, previousHash, hash, data, nonce, difficulty) {
    this.time = time;
    this.previousHash = previousHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce; //Hace referencia al numero de vultas que hara el algoritmo hasta que encontremos un valor
    this.difficulty = difficulty;
  }

  static get genesisi() {
    const time = new Date("2009-03-01").getTime();
    return new this(
      time,
      undefined,
      "genesis hash",
      "Genesis Block",
      0,
      DIFFICULTY // Hace referencia a una forma de gestionar el algoritmo de minado, ya que si mucho bloques se minan
      //continuamente la dificultat sube y de esta manera se relentizamos la generacion de nuevos bloques y en caso contrario baja la dificultat
      //De esta manera se balancea la creacion de bloques y no se satura la red
    );
  }

  //Método que se encarga de minar un nuevo bloque
  static mine (previousBlock, data){
    //Guardamos los valores del hash y la dificultat del bloque anterior
    const {hash: previousHash} = previousBlock;
    let {difficulty} = previousBlock;

    let hash;
    let time; //El tiempo varia en funcion de los hashes que se van creado
    let nonce = 0; 

    do {
        time = Date.now();
        nonce+=1;
        //Si el timepo de creacion mas el delay entre bloque y bloque es mayor que el tiempo que hemos creado
        //es decir, se ha minado mas rapido, por lo tanto incrementamos la dificultat en caso contrario lo diminuimos
        difficulty = previousBlock.time + MINE_RATE > time ? difficulty + 1 : difficulty - 1 ;
        hash = SHA256 (previousHash + time + data + nonce + difficulty).toString();//Cuando un valor cambie el hash sera totalmente diferente

    } 
    //Cogemos el hash y miramos desde el primer caracter hasta el número que indica la dificultat, en caso de que no tenga
    //tantos ceros el hash como 0 haya en la dificultat ex --> 0000 empieza asi el hash. difficulty: 3 no  se cumple la condicion
    while(hash.substring(0, difficulty) !== "0".repeat(difficulty))

    //Devolvemos un nuevo bloque
    return new this(time, previousHash, hash, data, nonce, difficulty);
  }

  toString() {
    const { time, previousHash, hash, data, nonce, difficulty } = this;
    return `Block -
            time: ${time}
            previousBlockHash: ${previousHash}
            hash: ${hash}
            data: ${data}
            nonce: ${nonce}
            difficulty: ${difficulty}
            -------------------------------------`;
  }
}
module.exports = Block;