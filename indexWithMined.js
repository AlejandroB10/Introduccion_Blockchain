const Block = require("./src_with_mined/block");
const Blockchain = require("./src_with_mined/blockchain");

//Creamos un nuevo objeto blockchain
const blockcahin = new Blockchain();

for (let index = 0; index < 10; index++) {
  const block = blockcahin.addBlock(`Block ${index}`);
  console.log(block.toString());
}
