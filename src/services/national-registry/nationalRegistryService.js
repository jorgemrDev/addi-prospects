import data from "../../data/national-registry/data.json";

export async function getPerson(nationalIdNumber) {
  const response = data.filter(
    (person) => person.nationalIdNumber === nationalIdNumber
  );
  return response;
}

// export async function getProduct(id) {
//   const response = await fetch(baseUrl + "products/" + id);
//   if (response.ok) return response.json();
//   throw response;
// }
