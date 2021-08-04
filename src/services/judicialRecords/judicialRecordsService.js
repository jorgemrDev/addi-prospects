import data from "../../data/judicial/data.json";

export async function getJudicialRecords(nationalIdNumber) {
  const response = data.filter(
    (person) => person.nationalIdNumber === nationalIdNumber
  );
  return response;
}
