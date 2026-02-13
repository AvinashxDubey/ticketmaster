import { expect } from "chai";
import { ethers } from "hardhat";
import { TicketMaster } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

const NAME = "TicketMaster"
const SYMBOL = "TM"

const OCCASION_NAME = "ETH Texas"
const OCCASION_COST = ethers.parseUnits("1", "ether");
const OCCASION_MAX_TICKETS = 100
const OCCASION_DATE = "Apr 27"
const OCCASION_TIME = "10:00AM CST"
const OCCASION_LOCATION = "Austin, Texas"

describe("TicketMaster", () => {
    let ticketMaster: TicketMaster;
    let deployer: HardhatEthersSigner, buyer: HardhatEthersSigner;

    beforeEach(async () => {
        [deployer, buyer] = await ethers.getSigners();

        const TicketMaster = await ethers.getContractFactory(NAME);
        ticketMaster = await TicketMaster.connect(deployer).deploy(NAME, SYMBOL);

        const transaction = await ticketMaster.connect(deployer).addOcassion(
            OCCASION_NAME,
            OCCASION_COST,
            OCCASION_MAX_TICKETS,
            OCCASION_DATE,
            OCCASION_TIME,
            OCCASION_LOCATION
        );

        await transaction.wait();
    })

    describe("Deployment", () => {
        it("Sets the name", async () => {
            expect(await ticketMaster.name()).to.equal("TicketMaster");
        })

        it("Sets the symbol", async () => {
            expect(await ticketMaster.symbol()).to.equal("TM");
        })

        it("Sets the owner", async () => {
            expect(await ticketMaster.owner());
        })
    })

    describe("Occasions", () => {
        it("Returns occasion attributes", async () => {
            const occasion = await ticketMaster.getOccasion(1);
            expect(occasion.id).to.equal(1);
            expect(occasion.name).to.equal(OCCASION_NAME)
            expect(occasion.cost).to.equal(OCCASION_COST)
            expect(occasion.tickets).to.equal(OCCASION_MAX_TICKETS)
            expect(occasion.date).to.equal(OCCASION_DATE)
            expect(occasion.time).to.equal(OCCASION_TIME)
            expect(occasion.location).to.equal(OCCASION_LOCATION)
        })

        it("Update occasion count", async () => {
            const occasionCount = await ticketMaster.totalOccasions();
            expect(occasionCount).to.equal(1);
        })
    })

    describe("Minting", () => {
        const ID = 1;
        const SEAT = 50;
        const AMOUNT = ethers.parseUnits("1", "ether");

        beforeEach(async () => {
            const transaction = await ticketMaster.connect(buyer).mint(ID, SEAT, { value: AMOUNT })
            await transaction.wait();
        })

        it("Updates ticket count", async () => {
            const occasion = await ticketMaster.getOccasion(ID);
            expect(occasion.tickets).to.equal(OCCASION_MAX_TICKETS - 1);
        })

        it("Updates ticket buying status", async () => {
            const status = await ticketMaster.hasBoughtSeat(1, buyer);
            expect(status).to.equal(true);
        })

        it("Updates seat ownership", async () => {
            const owner = await ticketMaster.seatTaken(ID, SEAT)
            expect(owner).to.equal(buyer);
        })

        it("Updates overall seating status", async () => {
            const seats = await ticketMaster.getSeatsTaken(ID);
            expect(seats.length).to.equal(1);
            expect(seats[0]).to.equal(SEAT);
        })

        it("Updates the contract balance", async () => {
            const balance = await ethers.provider.getBalance(ticketMaster.target);
            expect(balance).to.equal(AMOUNT);
        })
    })

    describe("Withdrawal", () => {
        const ID = 1;
        const SEAT = 50;
        const AMOUNT = ethers.parseUnits("1", "ether");
        let balanceBefore: bigint;

        beforeEach(async () => {
            let transaction = await ticketMaster.connect(buyer).mint(ID, SEAT, { value: AMOUNT })
            await transaction.wait();

            balanceBefore = await ethers.provider.getBalance(deployer);
            transaction = await ticketMaster.withdraw();
            await transaction.wait();
        })

        it("Updates the owner balance", async () => {
            const balanceAfter = await ethers.provider.getBalance(deployer);
            expect(balanceAfter).to.be.greaterThan(balanceBefore);
        })

        it("Updates the contract balance", async () => {
            const balance = await ethers.provider.getBalance(ticketMaster.target);
            expect(balance).to.equal(0);
        })
    })
})