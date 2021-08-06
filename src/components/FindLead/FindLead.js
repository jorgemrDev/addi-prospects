import React, { useState } from "react";
import { getLeadInformation } from "../../services/crm/crmService";
import ProspectsForm from "../ProspectsForm";

const emptyLead = {
  idNationalNumber: "",
};
const STATUS = {
  IDLE: "IDLE",
  SUBMITTED: "SUBMITTED",
  SUBMITTING: "SUBMITTING",
  COMPLETED: "COMPLETED",
};

export default function FindLead() {
  const [prospect, setProspect] = useState(emptyLead);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [foundLead, setFoundLead] = useState(false);
  const [leadInformation, setLeadInformation] = useState(emptyLead);
  const errors = getErrors(prospect);
  const isValid = Object.keys(errors).length === 0;

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus(STATUS.SUBMITTING);
    setFoundLead(false);
    setLeadInformation(emptyLead);
    if (isValid) {
      let lead = await getLeadInformation(parseInt(prospect.idNationalNumber));
      if (lead && lead[0]) {
        setFoundLead(true);
        setLeadInformation(lead[0]);
      }
      setStatus(STATUS.COMPLETED);
    } else {
      setStatus(STATUS.SUBMITTED);
    }
  }

  function handleChange(e) {
    e.persist(); // persist the event
    setProspect((curLeadIdentification) => {
      return {
        ...curLeadIdentification,
        [e.target.id]: e.target.value,
      };
    });
  }

  function getErrors(prospect) {
    const result = {};
    if (!prospect.idNationalNumber)
      result.idNationalNumber = "National Identification is required";
    return result;
  }

  function clear() {
    setStatus(STATUS.IDLE);
    setFoundLead(false);
    setProspect(emptyLead);
  }

  if (foundLead) {
    return (
      <ProspectsForm prospect={leadInformation} clear={clear}></ProspectsForm>
    );
  }

  return (
    <>
      <h1>Lead Info</h1>
      <div class="container">
        {!isValid && status === STATUS.SUBMITTED && (
          <div role="alert">
            <p>Please fix the following errors:</p>
            <ul>
              {Object.keys(errors).map((key) => {
                return <li key={key}>{errors[key]}</li>;
              })}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <div>
              <label htmlFor="idNationalNumber">Id National Number</label>
              <br />
              <input
                id="idNationalNumber"
                type="text"
                value={prospect.idNationalNumber}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <input type="submit" className="btn btn-primary" value="Find" />
          </div>
        </form>
        {status === STATUS.COMPLETED && !foundLead && (
          <div role="alert">
            <p>Document not found</p>
          </div>
        )}
      </div>
    </>
  );
}
