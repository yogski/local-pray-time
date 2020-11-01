import React, { Component } from 'react';
import APIClient from './../api'
import { BlockLoading } from 'react-loadingg';
import Countdown from 'react-countdown';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.request = new APIClient();
    this.prayTimes = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
    this.state = {
      is_loading : false,
      is_error : false,
      next_pray_time : null,
      next_pray_date : null,
      current_pray_time : null,
      error_message : null
    }

    this.getNextPrayDate = this.getNextPrayDate.bind(this);
  }

  async init() {
    try {
      this.setState({is_loading : true});

      // get external data
      const ip = await this.request.getIP();
      const geo = await this.request.getGeolocationFromIP(ip.ip);
      const prayTime = await this.request.getPrayTime(geo.latitude, geo.longitude);

      // set state
      this.setState({
        is_loading : false,
        next_pray_time : this.getNextPrayName(prayTime),
        next_pray_date : this.getNextPrayDate(prayTime),
        current_pray_time : this.getCurrentPrayTime(prayTime),
        ...ip,
        ...geo,
        ...prayTime
      }, () => console.log(this.state));
    } catch (error) {
      this.setState({
        is_error : true,
        error_message : error
      })
    }
  }

  /*
    @params: prayTime object
  */
  getNextPrayName(prayTime) {
    const currentTime = new Date();
    const compareTimes = this.prayTimes.map((time) => {
      return (Number(prayTime[time].split(':')[0])*60+Number(prayTime[time].split(':')[1]) > currentTime.getHours()*60+currentTime.getMinutes());
    });
    const indexNextPrayTime = compareTimes.indexOf(true);
    return indexNextPrayTime > -1 ? this.prayTimes[indexNextPrayTime] : null;
  }

  getNextPrayIndex(prayTime) {
    const currentTime = new Date();
    const compareTimes = this.prayTimes.map((time) => {
      return (Number(prayTime[time].split(':')[0])*60+Number(prayTime[time].split(':')[1]) > currentTime.getHours()*60+currentTime.getMinutes());
    });
    return compareTimes.indexOf(true);
  }

  getNextPrayDate(prayTime) {
    const currentTime = new Date();
    const nextPrayTime = this.getNextPrayName(prayTime);
    if (nextPrayTime) {
      const nextTime = prayTime[nextPrayTime].split(':');
      currentTime.setHours(nextTime[0]);
      currentTime.setMinutes(nextTime[1]);
      return currentTime.getTime();
    } else {
      return null;
    }
  }

  getCurrentPrayTime(prayTime) {
    const idx = this.getNextPrayIndex(prayTime);
    if (idx === 0) {
      return null;
    } else {
      return this.prayTimes[idx-1];
    }
  }

  renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      this.forceUpdate();
    } else {
      // Render a countdown
      return <span>{hours} jam {minutes} menit {seconds} detik</span>;
    }
  };

  componentDidMount() {
    this.init();
  }

  render() {
    const loading = this.state.is_loading;
    const errorFound = this.state.is_error;

    if (loading) {
      return (
      <div className="loader">
        <BlockLoading />
        <p>Receiving data ...</p>
      </div>
      )
    }

    if (errorFound) {
      return (
        <div>
          {alert(this.state.error_message)}
        </div>
      )
    }

    return(
      <div>
        {/* title & date */}
        <div className="p-grid p-align-center p-mt-6">
          <div className="p-col-12 display-title">
            Jadwal Sholat Hari Ini 
          </div>
          <div className="p-col-12 display-value">
            <b><i className="pi pi-calendar" style={{'fontSize': '2rem'}}></i> {this.state.date_masehi} (UTC{parseInt(this.state.time_offset) >= 0 ? `+${this.state.time_offset}` : `-${this.state.time_offset}`})</b>
          </div>
        </div>
        {/* location */}
        <div className="p-grid p-align-center p-mt-6">
          <div className="p-col-12 display-title">
            Lokasi Terdeteksi
          </div>
          <div className="p-col-12 display-value">
            <b><i className="pi pi-map-marker" style={{'fontSize': '2rem'}}></i> {this.state.city}, {this.state.country}</b>
          </div>
        </div>
        {/* pray times */}
        <div className="p-grid p-align-center p-mt-4">
          <div 
            className={`p-col p-d-flex p-flex-column p-mx-sm-3 ${this.state.current_pray_time === 'subuh' ? 'highlight-current-pray' : ''}`}
          >
            <div className="display-title"> Subuh </div>
            <div className="display-value">{this.state['subuh']}</div>
          </div>
          <div
            className={`p-col p-d-flex p-flex-column p-mx-sm-3 ${this.state.current_pray_time === 'dzuhur' ? 'highlight-current-pray' : ''}`}
          >
            <div className="display-title"> Dzuhur </div>
            <div className="display-value">{this.state['dzuhur']}</div>
          </div>
          <div
            className={`p-col p-d-flex p-flex-column p-mx-sm-3 ${this.state.current_pray_time === 'ashar' ? 'highlight-current-pray' : ''}`}
          >
            <div className="display-title"> Ashar </div>
            <div className="display-value">{this.state['ashar']}</div>
          </div>
          <div 
            className={`p-col p-d-flex p-flex-column p-mx-sm-3 ${this.state.current_pray_time === 'maghrib' ? 'highlight-current-pray' : ''}`}
          >
            <div className="display-title"> Maghrib </div>
            <div className="display-value">{this.state['maghrib']}</div>
          </div>
          <div 
            className={`p-col p-d-flex p-flex-column p-mx-sm-3 ${this.state.current_pray_time === 'isya' ? 'highlight-current-pray' : ''}`}
          >
            <div className="display-title"> Isya </div>
            <div className="display-value">{this.state['isya']}</div>
          </div>
        </div>
        {/* countdown */}
        <div className="p-grid p-align-center p-mt-4">
          <div className="p-col-12"> 
          <Countdown
            date={this.state.next_pray_date}
            renderer={this.renderer}
          />
          </div>
        </div>
        <div className="stars"></div>
      </div>
    );
  }
}