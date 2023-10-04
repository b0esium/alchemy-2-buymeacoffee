async function getBalance(address) {
  const balanceBigInt = await ethers.provider.getBalance(address);
  return ethers.formatEther(balanceBigInt);
}

async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(
      `At ${timestamp}, ${tipper} said "${message}" from address ${tipperAddress}`
    );
  }
}

async function main() {
  const [owner, tipper, tipper2, tipper3] = await ethers.getSigners();

  const BuyMeACoffee = await ethers.deployContract("BuyMeACoffee", owner);
  const buyMeACoffee = await BuyMeACoffee.waitForDeployment();
  console.log("BuyMeACoffee deployed to: ", buyMeACoffee.target);

  const addresses = [owner.address, tipper.address, buyMeACoffee.target];
  console.log("== start ==");
  await printBalances(addresses);

  const tip = { value: ethers.parseEther("1") };
  await buyMeACoffee.connect(tipper).buyCoffee("Lana", "Hello!", tip);
  await buyMeACoffee.connect(tipper2).buyCoffee("Del", "Hello!", tip);
  await buyMeACoffee.connect(tipper3).buyCoffee("Rey", "Hello!", tip);

  console.log("== bought coffee ==");
  await printBalances(addresses);

  await buyMeACoffee.connect(owner).withdrawTips();
  console.log("== withdrew tips ==");
  await printBalances(addresses);

  console.log("== memos ==");
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
