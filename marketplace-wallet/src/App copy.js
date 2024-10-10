import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import './App.css';

function App() {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [ethBalance, setEthBalance] = useState(null);

  const checkIfWalletIsConnected = useCallback(async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const account = accounts[0];
          setWalletAddress(account);
          fetchEthBalance(account);
        }
      }
    } catch (error) {
      console.error("Error al verificar la conexión de MetaMask:", error);
    }
  }, []);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
      setIsMetaMaskInstalled(true);
      checkIfWalletIsConnected();
    }
  }, [checkIfWalletIsConnected]);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        setWalletAddress(account);
        fetchEthBalance(account);
      } else {
        alert('Por favor instala MetaMask para continuar');
      }
    } catch (error) {
      console.error("Error al conectar con MetaMask:", error);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setEthBalance(null);
  };

  const fetchEthBalance = async (account) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(account);
      const etherBalance = ethers.formatEther(balance);
      setEthBalance(etherBalance);
    } catch (error) {
      console.error("Error obteniendo el balance de ETH:", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {isMetaMaskInstalled ? (
          walletAddress ? (
            <>
              <button onClick={disconnectWallet} className="connect-button">
                Desconectar
              </button>
              <span className="wallet-address">{walletAddress}</span>
            </>
          ) : (
            <button onClick={connectWallet} className="connect-button">
              Conectar a MetaMask
            </button>
          )
        ) : (
          <p>Por favor instala MetaMask para utilizar esta aplicación</p>
        )}
      </header>
      <main className="marketplace">
        <h1>Bienvenido al Marketplace</h1>
        {walletAddress && ethBalance && (
          <div className="wallet-info">
            <h3>Activos en tu Wallet:</h3>
            <ul className="assets-list">
              <li className="asset-item">
                <strong>Ethereum</strong>: {ethBalance}
              </li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;