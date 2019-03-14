import React, { Component } from "react";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      city: "",
      weather: ""
    };
  }

  componentDidMount() {
    // 测试 devServer 的代理功能
    // fetch('/api/category')
    //     .then(resp => resp.json())
    //     .then(res => console.log('here here', res));
  }

  handleChange = e => {
    this.setState({
      city: e.target.value
    });
  };

  handleSubmit = () => {
    var self = this;
    axios
      .get(`/api/weather/city/${self.state.city}`)
      .then(res => {
        // const persons = res.data;
        console.log(res.data);
        self.setState({
          weather: `Weather in ${self.state.city} is ${
            res.data.summary
          } with a temperature of ${res.data.temperature} °F.`
        });
      })
      .catch(function(error) {
        self.setState({
          weather: `ERROR! Could not process the city of ${
            self.state.city
          }. If you believe this is an error, please try again.`
        });
      });
  };

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Search for a city below to get the weather!</h2>
        </div>
        <br />
        <div className="form-group">
          <input
            type="text"
            value={this.state.city}
            onChange={this.handleChange}
            className="form-control"
          />
          <br />
          <button className="btn btn-primary" onClick={this.handleSubmit}>
            Submit
          </button>
        </div>
        <div>The weather in {this.state.city} ...</div>
        <div>{this.state.weather}</div>
      </div>
    );
  }
}

export default App;
