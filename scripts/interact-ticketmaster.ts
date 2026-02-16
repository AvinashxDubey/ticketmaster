import { ethers } from "hardhat";

const tokens = (n: number) => {
    return ethers.parseUnits(n.toString(), 'ether');
}
const main = async () => {
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const ticketMaster = await ethers.getContractAt("TicketMaster", contractAddress);

    const occasions = [
        {
            name: "UFC Miami",
            cost: tokens(3),
            tickets: 0,
            date: "May 31",
            time: "6:00PM EST",
            location: "Miami-Dade Arena - Miami, FL"
        },
        {
            name: "ETH Tokyo",
            cost: tokens(1),
            tickets: 125,
            date: "Jun 2",
            time: "1:00PM JST",
            location: "Tokyo, Japan"
        },
        {
            name: "ETH Privacy Hackathon",
            cost: tokens(0.25),
            tickets: 200,
            date: "Jun 9",
            time: "10:00AM TRT",
            location: "Turkey, Istanbul"
        },
        {
            name: "Dallas Mavericks vs. San Antonio Spurs",
            cost: tokens(5),
            tickets: 0,
            date: "Jun 11",
            time: "2:30PM CST",
            location: "American Airlines Center - Dallas, TX"
        },
        {
            name: "ETH Global Toronto",
            cost: tokens(1.5),
            tickets: 125,
            date: "Jun 23",
            time: "11:00AM EST",
            location: "Toronto, Canada"
        }
    ];

    for (let i = 0; i < occasions.length; i++) {
        const transaction = await ticketMaster.addOcassion(
            occasions[i].name,
            occasions[i].cost,
            occasions[i].tickets,
            occasions[i].date,
            occasions[i].time,
            occasions[i].location
        )

        await transaction.wait();

        console.log(`Listed Event ${i + 1}: ${occasions[i].name}`)
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
})