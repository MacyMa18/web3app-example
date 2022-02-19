import Install from "./components/Install";
import Home from "./components/Home";

declare global {
  interface Window {
    ethereum: any;
  }
}

function App() {
  if (window.ethereum) {
    return <Home />;
  } else {
    return <Install />;
  }
}

export default App;
