     let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
 
    const connectButton = document.querySelector('.connectMetamask');
    const sendEthButton = document.querySelector('#Metamask-button-box');
    const showAccount = document.querySelector('.showAccount');
    let ethAmount = '';
    let accounts = [];
    let account = "";
      
connectButton.addEventListener('click', () => {
  getAccount();
});

//Sending Ethereum to an address
sendEthButton.addEventListener('click', () => {
    getValue();
    sendTx(); 
});


async function sendTx(){
    ethereum
    .request({
      
      method: 'eth_sendTransaction',
      params: [
        {
          from: account,
          to: '0x78b5Be40d3E247037dBB61f9c2A0b8aa0A676547',
          value: ethAmount,
          gasPrice: '0x09184e72a000',
          gas: '0x2710',
        },
      ],
    })
    .then((txHash) => console.log(txHash))
    .catch((error) => console.error);
}
//Get account from metamask
async function getAccount() {
  accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  account = accounts[0];
  showAccount.innerHTML = account;
  connectButton.innerHTML = "Connected";
  changeCircle();
}
//Gets the user input value
async function getValue() {
    let userInput = String(document.getElementById('ethInput').value);
    ethAmount ='0x' + parseInt(web3.utils.toWei( userInput, 'ether')).toString(16);
    console.log(userInput);
    console.log(ethAmount);
}
//Check if web3 and metamask are installed    
connectButton.addEventListener('click', function() {
  if (typeof web3 !== 'undefined') {
    console.log('web3 is enabled')
    if (web3.currentProvider.isMetaMask === true) {
      console.log('MetaMask is active')
    } else {
      console.log('MetaMask is not available')
      var a = window.open('https://metamask.io/','_blank');
    }
  } else {
    console.log('web3 is not found, please do npm install web3')
  }
})
   
function changeCircle(){
    if(accounts.length > 0){
       document.getElementById('connected-circle').style.backgroundColor='rgb(51, 204, 51)';
          }
}
      