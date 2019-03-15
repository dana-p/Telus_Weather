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

  handleChange = e => {
    var city =
      e.target.value.charAt(0).toUpperCase() +
      e.target.value.slice(1).toLowerCase();
    this.setState({
      city: city
    });
  };

  handleSubmit = e => {
    var self = this;
    e.preventDefault();

    if (self.state.city !== "")
      axios
        .get(`/api/weather/city/${self.state.city}`)
        .then(res => {
          self.setState({
            weather: `Weather in ${self.state.city} is ${
              res.data.summary
            } with a temperature of ${res.data.temperature}°C.`
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
        <form className="form-group" onClick={this.handleSubmit}>
          <input
            type="text"
            value={this.state.city}
            onChange={this.handleChange}
            className="form-control"
          />
          <br />
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
        <div>The weather in {this.state.city} ...</div>
        <div>{this.state.weather}</div>
      </div>
    );
  }
}

export default App;
