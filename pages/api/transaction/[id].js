import { apiHandler, usersRepo, omit } from 'helpers/api';
import { prisma} from 'lib/prisma';


export default apiHandler({
    get: getTran
});

async function getTran(req, res) {
    // return users without hashed passwords in the response
  const user_id = req.query.id;
  //const user = usersRepo.getById(req.query.id);


  //if (!user) throw 'User Not Found';

 console.log("God is good");


    const response =  await prisma.transaction.findMany()
      /**   where: {
         senderId:Number(user_id),
         receiverId:Number(user_id)
      
      
    }
      }) 
      */

      
   console.log(JSON.parse(JSON.stringify(response)));

    return res.status(200).json(response);
}
