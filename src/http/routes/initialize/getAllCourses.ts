import { Course } from "../../../models/Course";
import { User } from "../../../models/User";
import { CourseResponse } from "../courses/postCourse";
 
export default async function getAllCourses(user: User){
    const table = "courses";
 
    const results = (await User.relatedQuery(table)
      .for(user.id)
      .orderBy("subject", "ASC")) as Course[];
  
    return results as CourseResponse[];
}
