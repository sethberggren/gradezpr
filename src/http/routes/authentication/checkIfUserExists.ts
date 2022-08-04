import { User } from "../../../models/User";

export default async function checkIfUserExists(
    email: string
  ): Promise<"Exists" | "Does Not Exist"> {
    const results = await User.query().select("email").where("email", email);
  
    if (results.length !== 0) {
      return "Exists";
    } else {
      return "Does Not Exist";
    }
  }