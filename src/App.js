import "./App.css";
import Sensor from "./Sensor";
import Govee from "./Govee";

function App() {
  return (
    <div className="App">
      <header><div>AKWAPONIKA</div></header>
      <Sensor name="TEMPERATURE SENSOR" port="80" socketIP="192.168.1.28"></Sensor>
      <Govee name="GOVEE"></Govee>

    </div>
  );
}

export default App;
