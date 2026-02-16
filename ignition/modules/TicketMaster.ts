import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TicketMasterModule = buildModule("TicketMasterModule", (m) => {

  const name = m.getParameter("name", "TicketMaster");
  const symbol = m.getParameter("symbol", "TM");

  const ticketMaster = m.contract("TicketMaster", [name, symbol], {
    
  });

  return { ticketMaster };
});

export default TicketMasterModule;