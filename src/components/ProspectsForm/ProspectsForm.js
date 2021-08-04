import React, { useState } from "react";
import { getPerson } from "../../services/national-registry/nationalRegistryService";
import { getJudicialRecords } from "../../services/judicialRecords/judicialRecordsService";
import { getProspectQualification } from "../../services/prospectQualification/prospectQualificationService";
import { putToProspect } from "../../services/crm/crmService";
import "./ProspectsForm.css";

const STATUS = {
  IDLE: "IDLE",
  SUBMITTED: "SUBMITTED",
  SUBMITTING: "SUBMITTING",
  COMPLETED: "COMPLETED",
};

export default function ProspectsForm({ prospect, clear }) {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [errors, setErrors] = useState({});
  const [validations, setValidations] = useState({});
  const isValid =
    Object.keys(errors).length === 0 && Object.keys(validations).length === 0;

  function getErrors(nationalRegistryData) {
    const result = {};
    if (nationalRegistryData.firstName !== prospect.firstName)
      result.firstName = "First Name different from the National Registry";
    if (nationalRegistryData.lastName !== prospect.lastName)
      result.lastName = "Last Name different from the National Registry";
    if (nationalRegistryData.birthdate !== prospect.birthdate)
      result.birthdate = "Birthdate different from the National Registry";
    return result;
  }

  async function convertToProspect() {
    await putToProspect(parseInt(prospect.nationalIdNumber));
  }

  function backto() {
    clear();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus(STATUS.SUBMITTING);
    //exectue two first validations on paralell
    const [nationalRegistryInfo, judicialRecords] = await Promise.all([
      getPerson(parseInt(prospect.nationalIdNumber)),
      getJudicialRecords(parseInt(prospect.nationalIdNumber)),
    ]);

    let errors = getErrors(nationalRegistryInfo[0]);
    let validations = {};
    if (
      judicialRecords &&
      judicialRecords[0] &&
      judicialRecords[0].records &&
      judicialRecords[0].records.length > 0
    ) {
      validations.judicialRecords = "Have judicial records";
    }

    let prospectQualification = await getProspectQualification(
      nationalRegistryInfo[0]
    );

    if (prospectQualification && prospectQualification <= 60) {
      validations.prospectQualification = `The prospect qualification is not greater 60 points as required. Is: ${prospectQualification}`;
    }

    if (Object.keys(errors).length > 0 || Object.keys(validations).length > 0) {
      setErrors(errors);
      setValidations(validations);
      setStatus(STATUS.SUBMITTED);
    } else {
      await convertToProspect();
      setStatus(STATUS.COMPLETED);
    }
  }

  if (status === STATUS.COMPLETED) {
    return (
      <>
        <h1>Succesfully converted to Prospect!</h1>
        <div>
          <input
            className="btn btn-primary"
            value="Back To Find Lead"
            onClick={backto}
          />
        </div>{" "}
      </>
    );
  }

  return (
    <>
      <h1>Prospect Info</h1>
      {!isValid && (
        <div role="alert">
          <p>The lead cant not be converted to prospect due to:</p>
          <ul>
            {Object.keys(validations).map((key) => {
              return <li key={key}>{validations[key]}</li>;
            })}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="national-id-number">Id National Number</label>
          <p id="national-id-number"> {prospect.nationalIdNumber} </p>
        </div>

        <div>
          <label htmlFor="first-name">First Name</label>
          <p htmlFor="first-name"> {prospect.firstName} </p>
          <br />
          <p role="alert">{status === STATUS.SUBMITTED && errors.firstName}</p>
        </div>

        <div>
          <label htmlFor="last-name">Last Name</label>
          <p htmlFor="last-name"> {prospect.lastName} </p>
          <br />
          <p role="alert">{status === STATUS.SUBMITTED && errors.lastName}</p>
        </div>

        <div>
          <label htmlFor="birthdate">Birthdate</label>
          <p htmlFor="birthdate"> {prospect.birthdate} </p>
          <br />
          <p role="alert">{status === STATUS.SUBMITTED && errors.birthdate}</p>
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <p htmlFor="email"> {prospect.email} </p>
          <br />
        </div>

        <div>
          <input
            type="submit"
            className="btn btn-primary"
            value="Convert to Prospect"
            disabled={status === STATUS.SUBMITTING}
          />
        </div>
        <div>
          <input
            className="btn btn-primary"
            value="Back To Find Lead"
            onClick={backto}
          />
        </div>
      </form>
    </>
  );
}
