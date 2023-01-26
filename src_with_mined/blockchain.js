const Block = require("./block");

class Blockchain {
  constructor() {
    this.chain = [Block.genesisi]; // Cuando cremos una blockchain ya tendra inicializada con el bloque genesis por defecto
  }

  addBlock(data) {
    //Cogemos el ultimo bolque creado
    const previousBlock = this.chain[this.chain.length - 1];
    //Minamos un nuevo bloque
    const block = Block.mine(previousBlock, data);
    //Añadimos el bloque en la cadena
    this.chain.push(block);
    return block;
  }
}
module.exports = Blockchain;
