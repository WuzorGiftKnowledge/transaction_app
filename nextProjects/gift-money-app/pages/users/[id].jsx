import { useState, useEffect } from 'react';

import { Link, Spinner } from 'components';
import { Layout } from 'components/users';
import { userService, alertService } from '../../services';
import { PrismaClient } from '@prisma/client'



export async function getServerSideProp({ params }) {
    const prisma = new PrismaClient()
    const user_id=params.id;
    let data = await userService.getAll();
    data=data.json();
    console.log(data);
  if(!data){
      return{

        notFound:true,
      }
  }
return {
  props: {data},
};
};


function Index(props) {
    const [users, setUsers] = useState(null);
    const {data}=props;
    console.log(data);
    useEffect(() => {
       // userService.getTransactionById(id).then(x => setUsers(x)) .catch(alertService.error)  
  //    const data=Array.from(props.data);
  const {data}=props;
       setUsers(props.data);
       console.log(JSON.stringify(data));
    }, []);

    function deleteUser(id) {
        setUsers(users.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));
        userService.delete(id).then(() => {
            setUsers(users => users.filter(x => x.id !== id));
        });
    }

    return (
        <Layout>
            <h1>Users</h1>
            <Link href="/users/add" className="btn btn-sm btn-success mb-2">Add User</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '30%' }}>First Name</th>
                        <th style={{ width: '30%' }}>Last Name</th>
                        <th style={{ width: '30%' }}>Username</th>
                        <th style={{ width: '30%' }}>Address</th>
                        <th style={{ width: '30%' }}>Status</th>
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                {users && users.map(user =>
                        <tr key={user.id}>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.username}</td>
                            <td>{user.address}</td>
                            <td>{user.status}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link href={`/users/edit/${user.id}`} className="btn btn-sm btn-primary mr-1">Edit</Link>
                                <button onClick={() => deleteUser(user.id)} className="btn btn-sm btn-danger btn-delete-user" disabled={user.isDeleting}>
                                    {user.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
                                </button>
                            </td>
                        </tr>
                    )}
                    {!users &&
                        <tr>
                            <td colSpan="4">
                                <Spinner />
                            </td>
                        </tr>
                    }
                    {users && !users.length &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="p-2">No Users To Display</div>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </Layout>
    );
}
export default Index;
//export async function getServerSideProps({ params }) {
  //  return {
  //      props: { id: params.id }
   // }
//}

