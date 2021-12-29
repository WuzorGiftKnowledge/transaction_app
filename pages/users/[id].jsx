import { useState, useEffect } from 'react';

import { Link, Spinner } from 'components';
import { Layout } from 'components/users';
import { userService, alertService } from '../../services';
import { PrismaClient } from '@prisma/client'
import { useForm } from 'react-hook-form';



export async function getServerSideProps({ params }) {
   return {
        props: { id: params.id }
    }
}


function Index({id}) {
    const [users, setUsers] = useState(null);
   
    useEffect(() => {
       userService.getTransactionById(id).then(x => setUsers(x)) .catch(alertService.error)  
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
            <h1>Transactions</h1>
            <Link href="/users/add_transaction" className="btn btn-sm btn-success mb-2">Add Transaction</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '30%' }}>Sender</th>
                        <th style={{ width: '30%' }}>Receiver</th>
                        <th style={{ width: '30%' }}>Amount</th>
                        <th style={{ width: '30%' }}>Currency</th>
                        <th style={{ width: '30%' }}>Status</th>
                       
                    </tr>
                </thead>
                <tbody>
                {console.log(users)}
                {users && users.map(user =>
                
                        <tr key={user.id}>
                           
                           
                            <td>    {user.senderId &&  (user.senderId==userService.userValue.id)? 'You' : ((user.senderId==null)? '---' :user.sender.firstname)}      </td>
                           
                            <td>{user.receiverId && (user.receiverId==userService.userValue.id)? 'You' : ((user.receiverId==null)? '---' :user.receiver.firstname)}</td>
                            <td>{user.amount}</td>
                            <td>{user.currency}</td>
                            <td>{ (user.status == true) ? 'Successful' : 'Failed'}</td>
                            
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
