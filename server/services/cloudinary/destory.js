import base from "./options.js";

export default async function destroy(public_id) {
  const test = await base.destroy(public_id, (result) => {
    console.log("destroy 1: ", result);
  });
  console.log("destroy 2: ", test);

  return test;
}
