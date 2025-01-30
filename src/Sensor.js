import "./Sensor.css";
import React from "react";
import moment from "moment";
import { pingCheck, request, API_URL } from "./APIConnection";
import { LineChart } from "@mui/x-charts";

class Sensor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "checking",
      isDisabled: false,
      info: "",
      sensorReadsToday: "",
    };

    this.getSocketInfo = this.getSocketInfo.bind(this);
    this.turnSocketON = this.turnSocketON.bind(this);
    this.turnSocketOFF = this.turnSocketOFF.bind(this);
    this.getSensorReadsToday = this.getSensorReadsToday.bind(this);
  }

  componentDidMount() {
    this.getSocketInfo();
    this.getSensorReadsToday();
  }

  turnSocketON() {
    if (window.confirm("Włączyć gniazdo?")) {
      fetch(request(`${API_URL}/turnon`, "POST", { ip: this.props.socketIP }))
        .then((res) => res.json())
        .then((result) => {
          setTimeout(() => {
            this.checkStatus();
            this.getSocketInfo();
          }, "500");
        })
        .catch((error) => {
          alert("Problem z uruchomieniem gniazda!");
          return error;
        });
    }
  }

  turnSocketOFF() {
    if (window.confirm("Wyłączyć gniazdo?")) {
      fetch(request(`${API_URL}/turnoff`, "POST", { ip: this.props.socketIP }))
        .then((res) => res.json())
        .then((result) => {
          setTimeout(() => {
            this.checkStatus();
            this.getSocketInfo();
          }, "500");
        })
        .catch((error) => {
          alert("Problem z wyłączeniem gniazda!");
          return error;
        });
    }
  }

  getSocketInfo() {
    fetch(request(`${API_URL}/getsocketinfo`, "POST", { ip: this.props.socketIP }))
      .then((res) => res.json())
      .then((result) => {
        //  console.log(result.data.Status);
        this.setState({ info: result.data.Status });
      })
      .catch((error) => {
        console.log("Problem z pobraniem statusu gniazda!");
        return error;
      });
  }

  async checkStatus() {
    this.setState({ status: await pingCheck(this.props.socketIP, this.props.port) });
  }

  getSensorReadsToday() {
    fetch(request(`${API_URL}/getsensorreadstoday`, "GET"))
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        this.setState({ sensorReadsToday: result });
      })
      .catch((error) => {
        console.log("Problem z pobraniem danych z db!");
      });
  }

  renderSensorReadsToday() {
    const sensorReadsToday = this.state.sensorReadsToday;
    return sensorReadsToday.map((record, index) => {
      // console.log(record);
      return (
        <div className="temperatureRecord">
          <div>{moment(record.date).format("HH:mm")}</div>
          <div>{Number(record.temperature).toFixed(1)}</div>
        </div>
      );
    });
  }

  everyNth = (arr, nth) => arr.filter((e, i) => i % nth === nth - 1);

  render() {
    let records;
    let sensorReadsToday, x, y;
    if (this.state.sensorReadsToday !== "") records = this.renderSensorReadsToday();
    if (this.state.sensorReadsToday !== "") {
      sensorReadsToday = this.state.sensorReadsToday;
      const every2nd = this.everyNth(sensorReadsToday, 2);

      x = every2nd.map((a) => moment(a.date).format("HH:mm"));
      y = every2nd.map((a) => Number(a.temperature).toFixed(1));
    }

    console.log(sensorReadsToday);

    return (
      <div className="Sensor">
        <div className="SensorInfoWrapper">
          <fieldset className="SensorInfo">
            <legend>{this.props.name}</legend>
            <p>SONOFF POWER STATUS: {this.state.info !== "" && this.state.info.DeviceName !== "" ? "ON" : "OFF"}</p>
            <button onClick={this.turnSocketOFF}>OFF</button>
            <button onClick={this.turnSocketON}>ON</button>
          </fieldset>
        </div>

        <div className="temperaturesTable">
          <div className="head">
            <div>Czas</div>
            <div>Temp.[&deg;C]</div>
          </div>
          {records}
        </div>
        {this.state.sensorReadsToday !== "" ? <LineChart className="chart" xAxis={[{ scaleType: "point", data: x, label: "Czas" }]} series={[{ data: y, label: "Temperatura", curve: "linear" }]} width={1000} height={600} /> : ""}
      </div>
    );
  }
}

export default Sensor;
