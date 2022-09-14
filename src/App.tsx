import './App.css';
import axios  from "axios"
import { useEffect } from 'react';
import { CryptoInfo } from './assets/types/backend.type';
function App() {
  const axiosInstance = axios.create({
    baseURL:process.env.REACT_APP_BACKEND_URL,
    timeout:3000,
  })
  async function handleGetTickers (){
    try {
      const result = await axiosInstance.get<CryptoInfo[]>(`/crypto-ticker?tokens=BTC,ETH&tokens=XRP`)
      console.log("result", result.data)
    } catch (error) {
      console.log("error", error)
    }
  }
  useEffect(() => {
    handleGetTickers()
  }, [])
  
  return (
    <div className="App">
      app
    </div>
  );
}

export default App;
