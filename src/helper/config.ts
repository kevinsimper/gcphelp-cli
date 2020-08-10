import Conf from "conf";

// const schema = {
//   user: {
//     type: "string",
//     default: "0",
//   },
// };
const config = new Conf({});

export function getAuthuser() {
  return config.get("authuser");
}
export function setAuthuser(id: string) {
  return config.set("authuser", id);
}
