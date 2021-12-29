import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';

import { Link } from 'components';
import { userService, alertService } from 'services';

export { AddEdit };
/*
export async function getServerSideProps() {
    data= await prisma.user.findMany({
        select:{
            id:true,
            firstname:true,
            lastname:true,
        }

     })
    return {
        props:{
            data},
     
     }
 }
 */
function AddEdit(props) {
    const user = props?.user;
    const [users, setUsers] = useState(null);
    
        const [value, setValue] = useState();
        const [loading, setLoading] = useState(true);
        const [items, setItems] = useState([
          { label: "Loading ...", value: "" }
        ]);

    useEffect(() => {
        let unmounted = false;
        async function getUsers() {
            const response = await userService.getAll();
            const body = response;
            console.log(response);
            if (!unmounted) {
            setItems(body.map(({lastname,firstname, id }) => ({ label: lastname+" "+firstname, value: id })));
           // console.log(items);
            setLoading(false)
          }
        }
          getUsers();

          return () => {
            unmounted = true;
          };
        }, []);
      
    const router = useRouter();
    
    // form validation rules 
    const validationSchema = Yup.object().shape({
        senderId: Yup.number()
            .required('senderId is required'),
       receiverId: Yup.number()
            .required('receiverId is required'),
        receiverAccountCurrency: Yup.string()
            .required('receiverAccountCurrency is required'),
        senderAccountCurrency: Yup.string()
            .required('receiverAccountCurrency is required'),
        amount: Yup.number()
            .required('amount is required') 
            
    });
    const formOptions = { resolver: yupResolver(validationSchema) };
  
    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(trans) {
          return userService.createTransaction(trans)
        .then(() => {
            alertService.success('Transaction added', { keepAfterRouteChange: true });
            router.push('..');
        })
        .catch(alertService.error);
           
    }

   
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
                <div className="form-group col">
                    <label>Receiver</label>
                    <select  {...register('receiverId')}
                disabled={loading}
                value={value}
                onChange={e => setValue(e.currentTarget.value)}
                >      {items.map(item => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  ))}
            
                </select>
              <div className="invalid-feedback">{errors.receiverId?.message}</div>
                </div>
                <div className="form-group col">
                    <label>Sender Account Currency</label>
                    <select {...register('senderAccountCurrency')}  onChange={e => setValue(e.currentTarget.value)} >
                    <option value="NGN">NGN</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    </select>
                    <div className="invalid-feedback">{errors.senderAccountCurrency?.message}</div>
                </div>
                <div className="form-group col">
                    <label>Receiver Account Currency</label>
                    <select  {...register('receiverAccountCurrency')}  onChange={e => setValue(e.currentTarget.value)}>
                    <option value="NGN">NGN</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    </select>
                    <div className="invalid-feedback">{errors.receiverAccountCurrency?.message}</div>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col">
                    <label>Amount</label>
                    <input name="amount" type="text" {...register('amount')} className={`form-control ${errors.amount ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.amount?.message}</div>
                </div>
                <div className="form-group col">
                    
                    <input name="amount" type="hidden" {...register('senderId')}  value={userService.userValue.id} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                   
                </div>
            </div>
            <div className="form-group">
                <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary mr-2">
                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    Save
                </button>
                <button onClick={() => reset(formOptions.defaultValues)} type="button" disabled={formState.isSubmitting} className="btn btn-secondary">Reset</button>
                <Link href={`/users/${userService.userValue?.id}`} className="btn btn-link">Cancel</Link>
            </div>
        </form>
    );
}