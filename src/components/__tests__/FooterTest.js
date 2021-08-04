import React from "react";
import Footer from "../Footer";
import renderer from "react-test-renderer";

test("Render Footer correctly", () => {
  const component = renderer.create(<Footer></Footer>);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
