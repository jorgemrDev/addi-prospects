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

export default function ProspectsForm({ prospect }) {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [errors, setErrors] = useState({});
  const [validations, setValidations] = useState({});
  const isValid =
    Object.keys(errors).length === 0 && Object.keys(validations).length === 0;

  function getErrors(nationalRegistryData) {
    const result = {};
    if (nationalRegistryData.nationalIdNumber !== prospect.nationalIdNumber)
      result.nationalIdNumber =
        "National Identification is different from the National Registry";
    if (nationalRegistryData.birthdate !== prospect.birthdate)
      result.birthdate = "Birthdate different from the National Registry";
    return result;
  }

  async function convertToProspect() {
    await putToProspect(parseInt(prospect.nationalIdNumber));
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
    if (judicialRecords && judicialRecords[0] && judicialRecords[0].records) {
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
    return <h1>Succesfully converted to Prospect!</h1>;
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
          <label htmlFor="idNationalNumber">Id National Number</label>
          <p htmlFor="idNationalNumber"> {prospect.nationalIdNumber} </p>
          <br />
          <p role="alert">
            {status === STATUS.SUBMITTED && errors.nationalIdNumber}
          </p>
        </div>

        <div>
          <label htmlFor="idNationalNumber">First Name</label>
          <p htmlFor="idNationalNumber"> {prospect.firstName} </p>
          <br />
        </div>

        <div>
          <label htmlFor="idNationalNumber">Last Name</label>
          <p htmlFor="idNationalNumber"> {prospect.lastName} </p>
          <br />
        </div>

        <div>
          <label htmlFor="idNationalNumber">Birthdate</label>
          <p htmlFor="idNationalNumber"> {prospect.birthdate} </p>
          <br />
          <p role="alert">{errors.birthdate}</p>
        </div>

        <div>
          <label htmlFor="idNationalNumber">Email</label>
          <p htmlFor="idNationalNumber"> {prospect.email} </p>
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
      </form>
    </>
  );
}
