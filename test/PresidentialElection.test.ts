import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("PresidentialElection", function () {
  async function deployElectionFixture() {
    const [operator, voter1, voter2] = await ethers.getSigners();

    const PresidentialElection = await ethers.getContractFactory("PresidentialElection");
    const election = await PresidentialElection.deploy();

    // No need to call election.deployed() if deploy() already returns a deployed contract
    // await election.deployed();

    return { election, operator, voter1, voter2 };
  }

  it("should deploy with the correct operator", async function () {
    const { election, operator } = await loadFixture(deployElectionFixture);
    expect(await election.operator()).to.equal(operator.address);
  });

  it("should add a candidate", async function () {
    const { election } = await loadFixture(deployElectionFixture);
    await election.addCandidate("Candidate 1");
    const candidate = await election.getCandidate(1);
    expect(candidate.name).to.equal("Candidate 1");
    expect(candidate.voteCount).to.equal(0);
  });

  it("should allow a user to vote", async function () {
    const { election, voter1 } = await loadFixture(deployElectionFixture);
    await election.addCandidate("Candidate 1");

    await election.connect(voter1).vote(1);
    const candidate = await election.getCandidate(1);
    expect(candidate.voteCount).to.equal(1);
    expect(await election.totalVotes()).to.equal(1);
  });

  it("should not allow double voting", async function () {
    const { election, voter1 } = await loadFixture(deployElectionFixture);
    await election.addCandidate("Candidate 1");

    await election.connect(voter1).vote(1);

    await expect(election.connect(voter1).vote(1)).to.be.revertedWith("You have already voted");
  });

  it("should not allow voting for a non-existent candidate", async function () {
    const { election, voter1 } = await loadFixture(deployElectionFixture);
    await expect(election.connect(voter1).vote(1)).to.be.revertedWith("Invalid candidate ID");
  });
});
