import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Link } from 'components';
import { userService, alertService } from 'services';

export { AddEdit };
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
function AddEdit(props, {data}) {
    const user = props?.user;
  
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
        return  createTransaction(trans)
           
    }

    function createTransaction(trans) {
        return userService.createTransaction(trans)
            .then(() => {
                alertService.success('Transaction added', { keepAfterRouteChange: true });
                router.push('.');
            })
            .catch(alertService.error);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
                <div className="form-group col">
                    <label>Reeivere</label>
                    <input name="receiverId" type="text" {...register('receiverId')} className={`form-control ${errors.receiverId ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.receiverId?.message}</div>
                </div>
                <div className="form-group col">
                    <label>Sender Account Currency</label>
                    <select value="EUR"  {...register('senderAccountCurrency')} >
                    <option value="NGN">NGN</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    </select>
                    <div className="invalid-feedback">{errors.lastName?.message}</div>
                </div>
                <div className="form-group col">
                    <label>Receiver Account Currency</label>
                    <select value="EUR" {...register('receiverAccountCurrency')}>
                    <option value="NGN">NGN</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    </select>
                    <div className="invalid-feedback">{errors.lastName?.message}</div>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col">
                    <label>Amount</label>
                    <input name="username" type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.email?.message}</div>
                </div>
              
            </div>
            <div className="form-group">
                <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary mr-2">
                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    Save
                </button>
                <button onClick={() => reset(formOptions.defaultValues)} type="button" disabled={formState.isSubmitting} className="btn btn-secondary">Reset</button>
                <Link href="/users" className="btn btn-link">Cancel</Link>
            </div>
        </form>
    );
}