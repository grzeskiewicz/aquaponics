import "./Sensor.css";
import React from "react";
import moment from "moment";
import { request, API_URL,API_URL2,fetchWithFallback } from "./APIConnection";
import { LineChart } from "@mui/x-charts";

class Govee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDisabled: false,
      info: "",
      goveeReadsToday: "",
      showGoveeTable:false
    };

    this.getGoveeReadsToday = this.getGoveeReadsToday.bind(this);
    this.toggleShowGoveeTable=this.toggleShowGoveeTable.bind(this);
  }

  componentDidMount() {
    this.getGoveeReadsToday();
  }



  getGoveeReadsToday() {
    fetchWithFallback(request(`${API_URL}/getgoveereadstoday`, "GET"),request(`${API_URL2}/getgoveereadstoday`, "GET"))
     // .then((res) => res.json())
      .then((result) => {
        console.log(result);
        this.setState({ goveeReadsToday: result });
      })
      .catch((error) => {
        console.log(error);
        console.log("Problem z pobraniem danych z db!");
      });
  }

  renderGoveeReadsToday() {
    const goveeReadsToday = this.state.goveeReadsToday;
    return goveeReadsToday.map((record, index) => {
      // console.log(record);
      return (
        <div className="goveeRecord">
          <div>{moment(record.date).format("HH:mm")}</div>
          <div>{Number(record.temperature).toFixed(1)}</div>
          <div>{Number(record.humidity)}</div>

        </div>
      );
    });
  }

  everyNth = (arr, nth) => arr.filter((e, i) => i % nth === nth - 1);

  toggleShowGoveeTable() {this.setState({showGoveeTable:!this.state.showGoveeTable})}


  render() {
    let records;
    let goveeReadsToday, x, y,yW;
    if (this.state.goveeReadsToday !== "") records = this.renderGoveeReadsToday();
    if (this.state.goveeReadsToday !== "") {
      goveeReadsToday = this.state.goveeReadsToday;
      const every2nd = this.everyNth(goveeReadsToday, 2);

      x = every2nd.map((a) => moment(a.date).format("HH:mm"));
      y = every2nd.map((a) => Number(a.temperature).toFixed(1));
      yW= every2nd.map((a) => Number(a.humidity));
    }

    console.log(goveeReadsToday);

    return (
      <div className="Govee">
        <div className="GoveeInfoWrapper">
        </div>

        <div className="goveeTable">
        <button onClick={this.toggleShowGoveeTable}>{this.state.showGoveeTable ? "Zwiń":"Pokaż" }</button>
          <div className="head">
            <div>Czas</div>
            <div>Temp.[&deg;C]</div>
            <div>Wilgotność</div>
          </div>
          {this.state.showGoveeTable ? records: ''}
        </div>
        {this.state.goveeReadsToday !== "" ? <LineChart xAxis={[{ scaleType: "point", data: x, label: "Czas" }]} series={[{ data: y, label: "Temperatura szklarnia", curve: "linear", color: "lightblue" }]} width={1000} height={600} /> : ""}
        {this.state.goveeReadsToday !== "" ? <LineChart xAxis={[{ scaleType: "point", data: x, label: "Czas" }]} series={[{ data: yW, label: "Wilgotność", curve: "linear", color:"lightpink" }]} width={1000} height={600} /> : ""}

      </div>
    );
  }
}

export default Govee;
