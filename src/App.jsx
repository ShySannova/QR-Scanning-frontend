import { useState } from "react";
import Html5QrcodePlugin from "./components/Html5QrcodePlugin";
import ResultContainerPlugin from "./components/ResultContainerPlugin";
import { AuthProvider } from "./context/AuthContext";



const App = (props) => {
  
  const [decodedResults, setDecodedResults] = useState([]);
    const onNewScanResult = (decodedText, decodedResult) => {
        setDecodedResults(prev => [...prev, decodedResult]);
    };
  
  return (
    <AuthProvider>

      <div className="App">
        <h1>QR Code Scanning Web App</h1>
        <main className="main">

          <Html5QrcodePlugin
              fps={10}
              qrbox={250}
              disableFlip={false}
              qrCodeSuccessCallback={onNewScanResult}
              />
               <ResultContainerPlugin results={decodedResults} />
        </main>
      </div>
    </AuthProvider>
  );
};

export default App