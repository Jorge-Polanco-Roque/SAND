import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import './App.css';

function App() {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [ethBalance, setEthBalance] = useState(null);
  const [maticBalance, setMaticBalance] = useState(null);
  const [currentNetwork, setCurrentNetwork] = useState(null);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
      setIsMetaMaskInstalled(true);
      checkIfWalletIsConnected();
      window.ethereum.on('chainChanged', () => window.location.reload()); // Recarga al cambiar de red
    }
  }, []);

  const checkIfWalletIsConnected = useCallback(async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });

        if (accounts.length > 0) {
          const account = accounts[0];
          setWalletAddress(account);
          setCurrentNetwork(chainId);
          if (chainId === '0x1') {
            await fetchEthBalance(account);
          } else if (chainId === '0x89') {
            await fetchMaticBalance(account);
          }
        }
      }
    } catch (error) {
      console.error("Error al verificar la conexión de MetaMask:", error);
    }
  }, []);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });

        setWalletAddress(account);
        setCurrentNetwork(chainId);

        if (chainId === '0x1') {
          await fetchEthBalance(account);
        } else if (chainId === '0x89') {
          await fetchMaticBalance(account);
        }
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
    setMaticBalance(null);
    setCurrentNetwork(null);
  };

  const fetchEthBalance = async (account) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(account);
      setEthBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error("Error obteniendo el balance de ETH:", error);
    }
  };

  const fetchMaticBalance = async (account) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(account);
      setMaticBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error("Error obteniendo el balance de MATIC:", error);
    }
  };

  const switchToEthereum = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }], // Mainnet de Ethereum
      });
      window.location.reload();
    } catch (error) {
      console.error("Error al cambiar a la red de Ethereum:", error);
    }
  };

  const switchToPolygon = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }], // Mainnet de Polygon (MATIC)
      });
      window.location.reload();
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x89',
                chainName: 'Polygon Mainnet',
                rpcUrls: ['https://rpc-mainnet.matic.network/'],
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://polygonscan.com/'],
              },
            ],
          });
          window.location.reload();
        } catch (addError) {
          console.error("Error al agregar la red Polygon:", addError);
        }
      } else {
        console.error("Error al cambiar a la red Polygon:", error);
      }
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
              <span className="wallet-address">Dirección: {walletAddress}</span>
              <div className="network-buttons">
                <button onClick={switchToEthereum}>Cambiar a Ethereum</button>
                <button onClick={switchToPolygon}>Cambiar a Polygon</button>
              </div>
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
        {walletAddress && (
          <>
            {currentNetwork === '0x1' && ethBalance && (
              <div className="wallet-info">
                <h3>Activos en la red Ethereum:</h3>
                <ul className="assets-list">
                  <li className="asset-item">
                    <strong>Ethereum (ETH)</strong>: {ethBalance}
                  </li>
                </ul>
              </div>
            )}
            {currentNetwork === '0x89' && maticBalance && (
              <div className="wallet-info">
                <h3>Activos en la red Polygon:</h3>
                <ul className="assets-list">
                  <li className="asset-item">
                    <strong>Polygon (MATIC)</strong>: {maticBalance}
                  </li>
                </ul>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
