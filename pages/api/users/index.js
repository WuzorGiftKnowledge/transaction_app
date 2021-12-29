import { apiHandler, usersRepo, omit } from 'helpers/api';
import { userService } from 'services';
import { BehaviorSubject } from 'rxjs';
import { prisma} from '../../../lib/prisma';

export default apiHandler({
    get: getUsers
});

async function getUsers(req, res) {
    // return users without hashed passwords in the response
   const user_id = req.body;
  

 

 console.log("God is good"+user_id);


    const response =  await prisma.user.findMany();
       

      
   console.log(response);

    return res.status(200).json(response);
}
