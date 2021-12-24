import { apiHandler, usersRepo, omit } from 'helpers/api';
import { userService } from 'services';
import { BehaviorSubject } from 'rxjs';

export default apiHandler({
    get: getUsers
});

async function getUsers(req, res) {
    // return users without hashed passwords in the response
   const user_id = req.body;
  

 

 console.log("God is good"+user_id);


    const response =  await prisma.user.findUnique({
        where: {
          id:10
        },
       include:{

         transactions:{
           where:{
            
                receiverId:10
              },
             

         },
       },
        
      })

      
   console.log(response);

    return res.status(200).json(response);
}
