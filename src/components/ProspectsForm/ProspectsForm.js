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
  const [errors, setErrors] = useState({
    nationalRegistry: {},
    validations: {},
  });

  const isValid =
    Object.keys(errors.nationalRegistry).length === 0 &&
    Object.keys(errors.validations).length === 0;

  function getErrors(
    nationalRegistryData,
    judicialRecords,
    prospectQualification
  ) {
    const result = {};
    result.nationalRegistry = {};
    result.validations = {};
    if (nationalRegistryData.firstName !== prospect.firstName)
      result.nationalRegistry.firstName =
        "First Name different from the National Registry";
    if (nationalRegistryData.lastName !== prospect.lastName)
      result.nationalRegistry.lastName =
        "Last Name different from the National Registry";
    if (nationalRegistryData.birthdate !== prospect.birthdate)
      result.nationalRegistry.birthdate =
        "Birthdate different from the National Registry";

    if (
      judicialRecords &&
      judicialRecords[0] &&
      judicialRecords[0].records &&
      judicialRecords[0].records.length > 0
    ) {
      result.validations.judicialRecords = "Have judicial records";
    }

    if (prospectQualification && prospectQualification <= 60) {
      result.validations.prospectQualification = `The prospect qualification is not greater 60 points as required. Is: ${prospectQualification}`;
    }
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

    let prospectQualification = await getProspectQualification(
      nationalRegistryInfo[0]
    );

    let errors = getErrors(
      nationalRegistryInfo[0],
      judicialRecords,
      prospectQualification
    );

    if (
      Object.keys(errors.nationalRegistry).length > 0 ||
      Object.keys(errors.validations).length > 0
    ) {
      setErrors(errors);
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
            {Object.keys(errors.validations).map((key) => {
              return <li key={key}>{errors.validations[key]}</li>;
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
          <p role="alert">
            {status === STATUS.SUBMITTED && errors.nationalRegistry.firstName}
          </p>
        </div>

        <div>
          <label htmlFor="last-name">Last Name</label>
          <p htmlFor="last-name"> {prospect.lastName} </p>
          <br />
          <p role="alert">
            {status === STATUS.SUBMITTED && errors.nationalRegistry.lastName}
          </p>
        </div>

        <div>
          <label htmlFor="birthdate">Birthdate</label>
          <p htmlFor="birthdate"> {prospect.birthdate} </p>
          <br />
          <p role="alert">
            {status === STATUS.SUBMITTED && errors.nationalRegistry.birthdate}
          </p>
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
