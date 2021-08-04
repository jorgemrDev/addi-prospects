import React from "react";
import FindLead from "../FindLead";
import renderer from "react-test-renderer";

test("Render Loading correctly", () => {
  const component = renderer.create(<FindLead></FindLead>);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
