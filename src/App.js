import React, { Component } from 'react';
import './style.css';
import TrainRow from './TrainRow.js';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.css';
import '../node_modules/font-awesome/css/font-awesome.min.css'; 
import moment from 'moment';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
    Stations: [{stationName:"", stationShortCode:""},],
    isLoaded: false,
    toggle: true,
    active: "nav-link active",
    Notactive: "nav-link",
    shearchTerm: "Ahonpää",
    name : '',
    Text : 'tekstiä',
    ListHeaderElement:"Saapuu",
 }

  this.performSearch('')
  }

  componentDidMount() {

    fetch('https://rata.digitraffic.fi/api/v1/metadata/stations')
    .then(res => res.json())
    .then(json => {
      this.setState({
        isLoaded: true,
        Stations: json,
      })
    });
  }

  performSearch(shearchTerm){

    this.state.shearchTerm = shearchTerm

    /*Returns stations code based on the station's name*/ 

    let stationCode = this.state.Stations.filter(item => item.stationName.toLowerCase() == shearchTerm.toLowerCase());

    if (stationCode === undefined || stationCode.length == 0) {

    stationCode = this.state.Stations;

    }

    let ariving = "?arriving_trains=20&include_nonstopping=false"

    let departing = "?departing_trains=20&include_nonstopping=false"

    let toggleUrl = departing

    /*Changenses the Url of the shearch*/

    if (this.state.toggle === true) {

    toggleUrl = ariving

    } else {

    toggleUrl = departing

    }

    const urlString = "https://rata.digitraffic.fi/api/v1/live-trains/station/" + stationCode[0].stationShortCode + toggleUrl

    $.ajax({
      url: urlString,
      success: (searchResults) => {

        console.log("Fetced data successfully")

        const results = searchResults

        var trainRows = []

        results.forEach((train) => {

          /*Gets names of the start and end stop*/

          let station = this.state.Stations.filter(item => item.stationShortCode === train.timeTableRows[0].stationShortCode)

          let laststation = this.state.Stations.filter(item => item.stationShortCode === train.timeTableRows.slice(-1)[0].stationShortCode)
          

          if (this.state.toggle === false){

          laststation = this.state.Stations.filter(item => item.stationShortCode === train.timeTableRows[0].stationShortCode)

          station = this.state.Stations.filter(item => item.stationShortCode === train.timeTableRows.slice(-1)[0].stationShortCode)

          }
          /*Gets time*/

          let searchedStation = train.timeTableRows.filter(item => item.stationShortCode == stationCode[0].stationShortCode)

          let originalTime = new Date(searchedStation[0].scheduledTime)

          let scheduledTime = moment(searchedStation[0].scheduledTime).format('HH:mm')

          /*Checks if liveEstimate is found. 
           If found estimatedTime = LiveEstimateTime. 
           If not estimatetime = null*/

          let estimatedTime = searchedStation[0].hasOwnProperty('liveEstimateTime') 
            ? moment(searchedStation[0].liveEstimateTime).format('HH:mm')
            : null

          var cancelled = searchedStation[0].cancelled

          const trainRow = <TrainRow train={train} name={station[0].stationName} laststation={laststation[0].stationName} time={scheduledTime} originalTime={originalTime} cancelled={cancelled} estimatedTime={estimatedTime} />
          trainRows.push(trainRow)
        })
        let aika = trainRows[0].props.originalTime

        trainRows.sort(function compare(date1,date2){
          return date1.props.originalTime.getTime() - date2.props.originalTime.getTime();
        })
        this.setState({rows: trainRows})
      },
      error: (xhr, status, err) => {
        console.error("failed to fetch data")
      }
    })
  }
  searchchangeHandler(event) {
  const boundObject = this
  let shearchTerm = event.target.value
  boundObject.performSearch(shearchTerm)
  }
  ArrivingTabnavbar(event){
  const boundObject = this
  this.state.toggle = true
  let shearchTerm = this.state.shearchTerm
  if (this.state.toggle === true) {
    this.state.active = "nav-link active"
    this.state.Notactive ="nav-link"
  }
  this.state.ListHeaderElement = "Sapuu"
  boundObject.performSearch(shearchTerm)
  }

  DepartingTabnavbar(event){
  const boundObject = this
  this.state.toggle = false
  let shearchTerm = this.state.shearchTerm

  if (this.state.toggle === false) {
    this.state.active = "nav-link"
    this.state.Notactive ="nav-link active"
  }
  this.state.ListHeaderElement = "Lähtee"
  boundObject.performSearch(shearchTerm)
  }

  render() {

    return (
      <div className="App">

      <div className="header">
      <div className="nav-container">
        Aseman junatiedot
       </div> 
      </div>
      <div className="container">

      <div className="search md-4">
      <h4>Hae aseman nimellä</h4>
      <form>
      <input className="form-control" id="create-course-form" onChange={this.searchchangeHandler.bind(this)}/>
      <i className="fa fa-times" value="resetform"></i>
      </form>
      </div>

      <div className="List">
      <ul className="nav nav-tabs">
      <li className="nav-item">
      <a className={this.state.active} href="#" onClick={this.ArrivingTabnavbar.bind(this)}>Saapuvat</a>
      </li>
      <li className="nav-item">
      <a className={this.state.Notactive} href="#" onClick={this.DepartingTabnavbar.bind(this)}>Lähtevät</a>
      </li>
      </ul>
      <table>
               <tbody>
                 <tr className="header_tr">
                 <td>
                 <p>Juna</p>
                 </td>
                 <td> 
                 <p>Lähtöasema</p>
                 </td>
                 <td> 
                 <p>Pääteasema</p>
                 </td>
                 <td> 
                 <p>{this.state.ListHeaderElement}</p>
                 </td>
                 </tr>
            
      {this.state.rows}
      
      </tbody>
             </table>
      </div>
      </div>
      </div>
    );
  }
}

export default App;