import React from "react";
import ProspectsForm from "../ProspectsForm";
import renderer from "react-test-renderer";

const emptyLead = {
  idNationalNumber: "",
};

test("Render ProspectsForm correctly", () => {
  const component = renderer.create(
    <ProspectsForm prospect={emptyLead}></ProspectsForm>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
