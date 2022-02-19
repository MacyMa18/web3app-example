import { useEffect, useState } from "react";
import { ethers } from "ethers";
import WalletBalance from "./WalletBalance";

import MuxinFirstNFT from "../../artifacts/contracts/MyNFT.sol/MuxinFirstNFT.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(
  contractAddress,
  MuxinFirstNFT.abi,
  signer
);

const Home = () => {
  const [totalMinted, setTotalMinted] = useState(0);

  useEffect(() => {
    getCount();
  }, []);

  const getCount = async () => {
    const count = await contract.count();
    setTotalMinted(parseInt(count));
  };
  return (
    <div>
      <WalletBalance />
      <h1>Muxin First NFT Collection</h1>
      {Array(totalMinted + 1)
        .fill(0)
        .map((_, i) => {
          return (
            <div key={i}>
              <NFTImage tokenId={i} getCount={getCount} />
            </div>
          );
        })}
    </div>
  );
};

interface NFTProps {
  tokenId: number;
  getCount: () => void;
}

const NFTImage = (props: NFTProps) => {
  const { tokenId, getCount } = props;
  const contentId = "QmYdoCeWfvgZVwyEJfFM537qWnM21qoWU64ihBZx9nLcyx";
  const metadataURI = `QmcnfeMqtLyk7TMW6RRpK2H8dCun8KDJy1PC3soKUKD7QU/${tokenId}.json`;
  const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;

  const [isMinted, setIsMinted] = useState(false);

  useEffect(() => {
    getMintedStatus();
  }, [isMinted]);

  const getMintedStatus = async () => {
    const result = await contract.isContentOwned(metadataURI);
    setIsMinted(result);
  };

  const mintToken = async () => {
    const connection = contract.connect(signer);
    const addr = connection.address;
    const result = await contract.payToMint(addr, metadataURI, {
      value: ethers.utils.parseEther("0.05"),
    });

    await result.wait();
    getMintedStatus();
    getCount();
  };

  const getURI = async () => {
    const uri = await contract.tokenURI(tokenId);
    alert(uri);
  };

  return (
    <div>
      <img
        src={
          isMinted
            ? imageURI
            : "https://gateway.pinata.cloud/ipfs/QmQVfNAkbLMvz8qgs3hcZ65WzLDDP4CTnKJfSvda7WUXPz"
        }
        alt=""
      />
      <div>
        <h5>ID #{tokenId}</h5>
        {!isMinted ? (
          <button onClick={mintToken}>Mint</button>
        ) : (
          <button onClick={getURI}>Taken! show URI</button>
        )}
      </div>
    </div>
  );
};

export default Home;
