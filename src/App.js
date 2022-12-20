import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);









function Landing({currentBlockNumber, setCurrentState}){
  return (<div className='App'>Past 5 Blocks
    <ul>
      <button className='btn' onClick={() => {
        setCurrentState(['individual block', currentBlockNumber])
      }}>{currentBlockNumber}</button>
      <button className='btn' onClick={() => {
        setCurrentState(['individual block', currentBlockNumber -1])
      }}>{currentBlockNumber -1}</button>
      <button className='btn' onClick={() => {
        setCurrentState(['individual block', currentBlockNumber -2])
      }}>{currentBlockNumber -2}</button>
      <button className='btn' onClick={() => {
        setCurrentState(['individual block', currentBlockNumber -3])
      }}>{currentBlockNumber -3}</button>
      <button className='btn' onClick={() => {
        setCurrentState(['individual block', currentBlockNumber -4])
      }}>{currentBlockNumber -4}</button>
    </ul>
  </div>);
}

function IndividialBlock({setCurrentState, setSingleTx, setLookUpTx, blockNumber, blockHash, blockTimestamp, blockNonce, blockTx}){
  return (<div className='App'>
    <button className='btn' onClick={() =>{
      setCurrentState(['landing', ''])
    }}>Home</button>
    <div className='App'>Block Number: {blockNumber} </div>
    <div className='App'>Block Hash: {blockHash} </div>
    <div className='App'>Block Nonce: {blockNonce} </div>
    <div className='App'>Block Timestamp: {blockTimestamp} </div>
    <div className='App'>Block Tx: {blockTx.map(tx => (
      <ul key={tx}>
        <button className='btn' onClick={() =>{
          setSingleTx(false);
          setLookUpTx(tx);
          setCurrentState(['singleTx', tx])
        }}>{tx}</button>
      </ul>
    ))} </div>
  </div>);
}


function SingleTx({setCurrentState, txBlockNumber, txBlockHash, transactionHash, txFrom, txTo, txGasUsed, txCumulativeGasPrice, txContractAddress}){
  return(<div className='App'>
    <div className='App'>Tx Block Number: {txBlockNumber} </div>
    <div className='App'>Tx Block Hash: {txBlockHash} </div>
    <div className='App'>Tx Hash: {transactionHash} </div>
    <div className='App'>From: {txFrom} </div>
    <div className='App'>To: {txTo} </div>
    <div className='App'>Gas Used: {txGasUsed} </div>
    <div className='App'>Gas Price: {txCumulativeGasPrice} </div>
    <div className='App'>Contract Address: {txContractAddress} </div>
    <button className='btn' onClick={() =>{
      setCurrentState(['landing', ''])
    }}>Home</button>
  </div>)
}


function App() {
  const [currentState, setCurrentState] = useState(['landing', '']);
  const [currentBlockNumber, setCurrentBlockNumber] = useState();
  const [blockHash, setBlockHash] = useState();
  const [blockTimestamp, setBlockTimestamp] = useState();
  const [blockNonce, setBlockNonce] = useState();
  const [blockTx, setBlockTx] = useState([]);
  const [singTx, setSingleTx] = useState(true);
  const [lookUpTx, setLookUpTx] = useState("");
  const [tx, setTx] = useState();
  const[txBlockHash, setTxBlockHash] = useState();
  const[txTo, setTxTo] = useState();
  const[txFrom, setTxFrom] = useState();
  const[txBlockNumber, setTxBlockNumber] = useState();
  const[txGasUsed, setTxGasUsed] = useState();
  const[txCumulativeGasPrice, setTxCumulativeGasPrice] = useState();
  const[txContractAddress, setTxContractAddress] = useState();
  const[transactionHash, setTransactionHash] = useState();

  //set the block items
  useEffect(() => {
    async function getBlockNumber() {
      
      setCurrentBlockNumber(await alchemy.core.getBlockNumber());
    }

    async function getBlockInfo(){
      let _block = await alchemy.core.getBlock(currentBlockNumber)
      
      setBlockNonce(_block.nonce);
      setBlockHash(_block.hash);
      setBlockTimestamp(_block.timestamp);
      setBlockTx([..._block.transactions]);
    }


    getBlockNumber();
    getBlockInfo();
    
  });

  //set Tx values
  useEffect(() =>{
    async function getTx(){
      let t = await alchemy.core.getTransactionReceipt(lookUpTx);
      setTxBlockHash(t.blockHash);
      setTransactionHash(t.transactionHash);
      setTxBlockNumber(t.blockNumber);
      setTxContractAddress(t.contractAddress);
      setTxCumulativeGasPrice(parseInt(t.cumulativeGasUsed._hex), 16);
      setTxFrom(t.from);
      setTxGasUsed(parseInt(t.gasUsed._hex, 16));
      setTxTo(t.to);
    }
    getTx();
  })
  if(currentState[0] == 'landing'){
    return (<div className='App'>
      <Landing currentBlockNumber={currentBlockNumber} setCurrentState={setCurrentState} />
    </div>);
  }
  else if(currentState[0] == 'individual block'){
    return (<div className='App'>
      <IndividialBlock 
        setCurrentState={setCurrentState}
        setSingleTx={setSingleTx}
        setLookUpTx={setLookUpTx}
        blockNumber={currentState[1]}
        blockHash={blockHash}
        blockTimestamp={blockTimestamp}
        blockNonce={blockNonce}
        blockTx={blockTx}
      />
    </div>);
    
  }else if(currentState[0] == 'singleTx'){
    return <div className='App'>
      <SingleTx 
        setCurrentState={setCurrentState}
        txBlockNumber={txBlockNumber}
        txBlockHash={txBlockHash}
        transactionHash={transactionHash}
        txFrom={txFrom}
        txTo={txTo}
        txGasUsed={txGasUsed}
        txCumulativeGasPrice={txCumulativeGasPrice}
        txContractAddress={txContractAddress}
      />
    </div>
  }
}




export default App;
