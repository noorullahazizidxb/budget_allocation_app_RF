import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Budget = () => {
    const { budget,currency, expenses, dispatch } = useContext(AppContext);
    const [edit_flag, setEdit_Flag] = useState(false);
    const totalExpenses = expenses.reduce((total, item) => {
        return (total += item.cost);
    }, 0);
    const [tot_expanse, setTot_Expanse] = useState(totalExpenses);
  

    const [newBudget, setNewBudget] = useState(0);
    const handleBudgetChange = (event) => {
        setNewBudget('');
        if (newBudget >= totalExpenses && newBudget <= 20000) {
            
            setNewBudget(event.target.value);
            dispatch({
                type: 'SET_BUDGET',
                payload: newBudget,
            });
        }

        else if (newBudget < totalExpenses) {
            
            dispatch({
                type: 'SET_BUDGET',
                payload: totalExpenses,
            });
            setNewBudget(totalExpenses)
            toast.error(`sorry your budget can not be less than Spent so far which is ${totalExpenses}!`, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
        else {
            setNewBudget(20000)
            dispatch({
                type: 'SET_BUDGET',
                payload: budget,
            });

            toast.error(`sorry you cant put more then 20000!`, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    }



    return (
        <div className='container  alert alert-secondary  '>
            <div className='container' style={{ paddingRight: '2%', width: '100%' }}> Budget:{currency} {edit_flag ?
                (
                    <input type="number" step="10"
                        style={{ width: '60%' }}
                        className="py-1 px-0  w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                        placeholder='Edit the budget'
                        value={(tot_expanse > newBudget) ? tot_expanse : parseInt(newBudget)}
                        onChange={handleBudgetChange}
                        onKeyDown={handleBudgetChange}
                        onKeyUp={handleBudgetChange}
                        onClick={handleBudgetChange}
                        onMouseOut={() => { setEdit_Flag(false) }}

                    />) : (
                    <span
                        onDoubleClick={() => setEdit_Flag(true)}
                        onFocus={() => setEdit_Flag(true)}
                        onMouseOver={() => setEdit_Flag(true)}
                        onMouseEnter={() => setEdit_Flag(true)}
                        onFocusCapture={() => setEdit_Flag(true)}

                        style={{ padding: '5%', width: '400px' }}
                    >{newBudget}</span>
                )
            }


            </div>
            <ToastContainer
                position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                limit={3}
                draggable
                pauseOnHover
                theme="dark"
            />
        </div >
    );
};
export default Budget;
