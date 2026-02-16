import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Navigation from './components/Navigation';
import Card from './components/Card';
import Sort from './components/Sort'
import SeatChart from './components/SeatChart'
import config from './config.json';
import TicketMasterABI from './abis/TicketMaster.json';

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [ticketMaster, setTicketMaster] = useState(null);
  const [occasions, setOccasions] = useState([]);

  const [occasion, setOccasion] = useState({});
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    const loadBlockchainData = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
      const network = await provider.getNetwork();
      const contractAddress = config[network.chainId].TicketMaster.address;
      console.log(contractAddress)
      const ticketMaster = new ethers.Contract(contractAddress, TicketMasterABI, provider);
      setTicketMaster(ticketMaster);

      const totalOccasions = await ticketMaster.totalOccasions();
      const occasions = [];
      for (let i = 1; i <= totalOccasions; i++) {
        occasions.push(await ticketMaster.getOccasion(i));
      }
      setOccasions(occasions);

      console.log(occasions);


      // refresh account
      window.ethereum.on('accountsChanged', async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.getAddress(accounts[0]);
        setAccount(account);
      })
    }
    loadBlockchainData();
  }, [])

  return (
    <div>
      <header>
        <Navigation account={account} setAccount={setAccount}></Navigation>
        <h2 className='header__title'><strong>Event</strong> Tickets</h2>
      </header>

      <Sort />

      <div className='cards'>
        {occasions.map((occasion, idx) => (
          <Card
            occasion={occasion}
            setOccasion={setOccasion}
            id= {idx+1}
            ticketMaster={ticketMaster}
            provider={provider}
            toggle={toggle}
            setToggle={setToggle}
            key={idx}
          />
        ))}
      </div>
      {toggle && (
        <SeatChart
          occasion={occasion}
          ticketMaster={ticketMaster}
          provider={provider}
          setToggle={setToggle}
        />
      )}
    </div>
  )
}

export default App
