import React from "react";

export default function AboutUs() {
  return (
    <>
      <div>
        <h1>About US Page</h1>
      </div>
      <div class="container">
        <div>
          <p>Site created using React</p>
        </div>
        <div>
          <p>
            <a
              href="https://festive-benz-7ad17f.netlify.app/ "
              target="_blank"
              rel="noreferrer"
            >
              deployed site
            </a>
          </p>
          <p>
            Prospects application For the fake API calls i created async
            functions (located at ./services folder) that reads from json files
            (all located on ./data folder, there are a file for every sevice
            crm, judicial records, national registry) for tests you can use this
            document numbers:
            <br />
            - 80913296: happy path, this user doesnt have judicial records and
            the data CRM database is same as on national registry
            <br />
            - 80913297: this user have judicial records
            <br />
            - 80913298: this user have a different birthdate on crm than on
            national registry
            <br />
            - 80913299: for this user all data on CRM is different than on
            national registry
            <br />
            NOTE: in all cases including happy path can be raised the non
            prospect qualification score validation as that value is random
            <br />
            you can use that documents to test or feel free to modify the data
            on the json files
          </p>
        </div>
      </div>
    </>
  );
}
