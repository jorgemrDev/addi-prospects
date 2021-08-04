import data from "../../data/crm/data.json";

export async function getLeadInformation(nationalIdNumber) {
  const response = data.filter(
    (person) => person.nationalIdNumber === nationalIdNumber
  );
  return response;
}

export async function putToProspect(nationalIdNumber) {
  const lead = data.filter(
    (person) => person.nationalIdNumber === nationalIdNumber
  );
  lead[0].isProspect = true;
  return lead[0];
}
