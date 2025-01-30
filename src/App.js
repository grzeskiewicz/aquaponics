import "./App.css";
import Sensor from "./Sensor";

function App() {
  return (
    <div className="App">
      <header><div>AKWAPONIKA</div></header>
      <Sensor name="TEMPERATURE SENSOR" port="80" socketIP="192.168.1.28"></Sensor>
    </div>
  );
}

export default App;
