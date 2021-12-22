import { apiHandler, usersRepo, omit } from 'helpers/api';



export default apiHandler({
    get: getTran
});

async function getTran(req, res) {
    // return users without hashed passwords in the response
  const user_id = req.query.id;
  //const user = usersRepo.getById(req.query.id);


  //if (!user) throw 'User Not Found';

 console.log("God is good");


    const response =  await prisma.user.findUnique({
        where: {
          id:user_id,
       include:{

         transactions:{
           where:{
            
                receiverId:user_id
              },
             

         },
       },
    }
      })

      
   console.log(response);

    return res.status(200).json(response);
}
