import QRCode from "qrcode.react";

function App() {
  return (
    <div>
      <h1>Meu QR Code</h1>
      <QRCode value="https://www.youtube.com/watch?v=yT22ylhonfs" />
    </div>
  );
}

export default App;