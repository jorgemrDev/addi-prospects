import React from "react";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ToProspect from "./pages/ToProspect";
import Contact from "./pages/Contact";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

export default function App() {
  return (
    <>
      <Router>
        <Header />
        <Switch>
          <Route path="/" exact={true}>
            <ToProspect></ToProspect>
          </Route>
          <Route path="/contact" exact={true}>
            <Contact></Contact>
          </Route>
          <Route path="/about" exact={true}>
            <ToProspect></ToProspect>
          </Route>
        </Switch>
      </Router>
      <Footer />
    </>
  );
}
