import './App.css';
import 'primeflex/primeflex.css';
import 'primereact/resources/themes/vela-orange/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import React from 'react';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import About from './pages/About';
import Home from './pages/Home';

export default class App extends React.Component{
  constructor(props) {
    super(props);
    this.items = [
      {
        label: 'Menu',
        items: [
          {
            label: 'Home',
            icon: 'pi pi-home',
            command: ()=>{ window.location="/"; }
          },
          {
            label: 'About',
            icon: 'pi pi-info',
            command: ()=>{ window.location="/about"; }
          }
        ]
      }
    ];
  }

render() {
  return (
    <div className="p-p-4 app-bkg">
      <div className="app-inner-bkg">
        <div className="header-menu">
          <Menu model={this.items} popup ref={el => this.menu = el} id="popup_menu" />
          <Button icon="pi pi-bars" className="p-button-rounded p-button-secondary p-button-outlined" onClick={(event) => this.menu.toggle(event)} aria-controls="popup_menu" aria-haspopup/>
        </div>
        <Router>
            <Switch>
              <Route exact path="/about">
                <About name="you" />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
        </Router>
      </div>
    </div>
    );
  }

}
