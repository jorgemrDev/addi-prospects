import React from "react";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ToProspect from "./pages/ToProspect";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
//import Detail from "./Detail.class";
//import Cart from "./Cart";
//import Checkout from "./Checkout.class";
//import { useCart } from "./cartContext";

export default function App() {
  //const { dispatch } = useCart();
  return (
    <>
      <Router>
        <Header />
        <Switch>
          <Route path="/" exact={true}>
            <ToProspect></ToProspect>
          </Route>
        </Switch>
      </Router>
      <Footer />
    </>
  );
}
