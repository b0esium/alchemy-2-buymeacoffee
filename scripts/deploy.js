// deployed to Sepolia at 0x1C9b609b6D0D3e3D3C97644296CaD0dD6709e678

async function main() {
  const [owner, tipper, tipper2, tipper3] = await ethers.getSigners();

  const BuyMeACoffee = await ethers.deployContract("BuyMeACoffee", owner);
  const buyMeACoffee = await BuyMeACoffee.waitForDeployment();
  console.log("BuyMeACoffee deployed to: ", buyMeACoffee.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
