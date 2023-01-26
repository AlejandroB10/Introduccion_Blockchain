const SHA256 = require("crypto-js/sha256");
const Block = require("./block");

class Blockchain {
  constructor() {
    this.chain = []; //Array de objetos bloques donde se guardan todos los datos de la clase
    this.height = -1; //Longitud de la Blockchain
    this.initializedChain();
  }

  async initializedChain() {
    //Miramos si la cadena aun no ha sido creada
    if (this.height === -1) {
      //Creamos un objeto Bloque
      const block = new Block({ data: "Genesis Block" });
      //Llamamos al método que se encarga de añadir el bloque a la cadena
      await this.addBlock(block);
    }
  }

  addBlock(block) {
    let self = this;
    //Ya que la funcion se llama de forma asincrona devolvemos una promesa
    return new Promise(async (resolve, reject) => {
      block.height = self.chain.length; // La altura del bloque se inicializa a la longitud de la cadea
      block.time = new Date().getTime().toString(); //Guardamos el tiempo en el se añade el bloque en la cadena
      //Comprobamos si en la cadena ya hay bloques
      if (self.chain.length > 0) {
        //Inicializamos el hash anterior, accediendo a la cadena anterior y posteriormente a su hash
        block.previousBlockHash = self.chain[self.chain.length - 1].hash;
      }
      //Gaurdamos en un array los errores que ocurren en la blockchain, en caso de exista uno dejara de ser valido
      let errors = await self.validateChain();
      //Comprobamos si ha habido error
      if (errors.length > 0) {
        //Devolvemos la promesa con un error
        reject(new Error("The chain is not valid: ", errors));
      }
      //Inicializamos el hash
      block.hash = SHA256(JSON.stringify(block)).toString();

      //Si no ha habido errores a la hora de inicializar el bloque.
      //Añadimos el bloque a la cadena
      self.chain.push(block);

      resolve(block);
    });
  }

  validateChain() {
    const self = this;
    const errors = [];
    //Como dentro de la promesa llamaremos a otra funcion asincrona utilizamos el async
    return new Promise(async (resolve, reject) => {
      //Mapeamos la cadena, para acceder a cada bloque
      self.chain.map(async (block) => {
        try {
          //Comprobamos si se trata de un bloque valido
          let isValid = await block.validate();
          //En caso de que no sea valido
          if (!isValid) {
            errors.push(new Error(`The block ${block.height} is not valid`));
          }
        } catch (err) {
          errors.push(err);
        }
      });
      resolve(errors);
    });
  }

  print() {
    let self = this;
    for (const block of self.chain) {
      console.log(block.toString());
    }
  }
}

module.exports = Blockchain;
