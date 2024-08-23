async function main() {
    // Obtén el contrato a desplegar
    const Token = await ethers.getContractFactory("Token");
  
    // Despliega el contrato
    const token = await Token.deploy();
  
    // Espera a que el despliegue se complete
    await token.deployed();
  
    // Muestra la dirección del contrato desplegado
    console.log("Contract deployed to:", token.address);
  }
  
  // Ejecución de la función principal
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  