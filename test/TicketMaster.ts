import { expect} from "chai";
import { ethers } from "hardhat";
import { TicketMaster } from "../typechain-types";

describe("TicketMaster", () => {
    let ticketMaster: TicketMaster;
    beforeEach(async() => {
        const TicketMaster = await ethers.getContractFactory("TicketMaster");
        ticketMaster = await TicketMaster.deploy("TicketMaster", "TM");
    })
    describe("Deployment", () => {
        it("Sets the name", async() => {
            expect(await ticketMaster.name()).to.equal("TicketMaster");
        })
        it("Sets the symbol", async() => {
            expect(await ticketMaster.symbol()).to.equal("TM");
        })
    })
})