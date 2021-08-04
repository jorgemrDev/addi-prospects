import React from "react";
import { Link, NavLink } from "react-router-dom";

const activeStyle = {
  color: "purple",
};

export default function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">
              <img alt="ADDI Prospects Application" src="/images/logo.jpeg" />
            </Link>
          </li>
          <li>
            <NavLink activeStyle={activeStyle} to="/contact">
              Contact
            </NavLink>
          </li>
          <li>
            <NavLink activeStyle={activeStyle} to="/about">
              About Us
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
