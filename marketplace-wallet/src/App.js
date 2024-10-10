import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import './App.css';

function App() {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [ethBalance, setEthBalance] = useState(null);
  const [maticBalance, setMaticBalance] = useState(null);
  const [currentNetwork, setCurrentNetwork] = useState(null);

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

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
      setIsMetaMaskInstalled(true);
      checkIfWalletIsConnected();
      window.ethereum.on('chainChanged', () => window.location.reload()); // Recarga al cambiar de red
    }
  }, [checkIfWalletIsConnected]);

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
    <div className="App" style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', color: '#333', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <header className="App-header" style={{ backgroundColor: '#282c34', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', textAlign: 'center', width: '80%', maxWidth: '600px' }}>
        {isMetaMaskInstalled ? (
          walletAddress ? (
            <>
              <button onClick={disconnectWallet} className="connect-button" style={{ backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
                Desconectar
              </button>
              <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '10px' }}>Dirección: {walletAddress}</div>
              <div className="network-buttons" style={{ display: 'flex', justifyContent: 'space-around' }}>
                <button onClick={switchToEthereum} style={{ backgroundColor: '#3498db', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginRight: '10px' }}>
                  Cambiar a Ethereum
                </button>
                <button onClick={switchToPolygon} style={{ backgroundColor: '#9b59b6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Cambiar a Polygon
                </button>
              </div>
            </>
          ) : (
            <button onClick={connectWallet} className="connect-button" style={{ backgroundColor: '#2ecc71', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
              Conectar a MetaMask
            </button>
          )
        ) : (
          <p style={{ color: '#333', fontWeight: 'bold' }}>Por favor instala MetaMask para utilizar esta aplicación</p>
        )}
      </header>
      <main className="marketplace" style={{ marginTop: '40px', textAlign: 'center', width: '80%', maxWidth: '600px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#4a90e2', marginBottom: '20px' }}>Bienvenido al Marketplace</h1>
        {walletAddress && (
          <>
            {currentNetwork === '0x1' && ethBalance && (
              <div className="wallet-info" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
                <h3 style={{ color: '#333', fontWeight: 'bold', marginBottom: '10px' }}>Activos en la red Ethereum:</h3>
                <ul className="assets-list" style={{ listStyleType: 'none', padding: 0 }}>
                  <li className="asset-item" style={{ padding: '10px 0', borderBottom: '1px solid #ddd' }}>
                    <strong style={{ color: '#4a90e2' }}>Ethereum (ETH)</strong>: {ethBalance}
                  </li>
                </ul>
              </div>
            )}
            {currentNetwork === '0x89' && maticBalance && (
              <div className="wallet-info" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
                <h3 style={{ color: '#333', fontWeight: 'bold', marginBottom: '10px' }}>Activos en la red Polygon:</h3>
                <ul className="assets-list" style={{ listStyleType: 'none', padding: 0 }}>
                  <li className="asset-item" style={{ padding: '10px 0', borderBottom: '1px solid #ddd' }}>
                    <strong style={{ color: '#9b59b6' }}>Polygon (MATIC)</strong>: {maticBalance}
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