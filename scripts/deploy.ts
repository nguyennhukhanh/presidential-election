import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const PresidentialElection = await ethers.getContractFactory("PresidentialElection");
  const election = await PresidentialElection.deploy();

  console.log("PresidentialElection deployed to:", election.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
