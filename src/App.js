import React, { useContext, useEffect } from 'react';


import 'bootstrap/dist/css/bootstrap.min.css';

//Code to import Budget.js
import Budget from './components/Budget';

// Add code to import the other components here under


import { AppProvider } from './context/AppContext';
import ExpenseTotal from './components/ExpenseTotal';
import ExpenseList from './components/ExpenseList';
import AllocationForm from './components/AllocationForm';
import RemainingBudget from './components/Remaining';
import CurrencyDropDown from './components/CurrencyDropDown';
import ExpenseItem from './components/ExpenseItem';
import './index.css';
import './app.scss';

const App = () => {
    // code for swithing the dark theme
    const [darkMode, setDarkMode] = React.useState(false);
    
    
    return (
        <AppProvider>
            <div className='container'>
                <h1 className='mt-3  text-3xl font-bold'>Company's Budget Allocation</h1>
                <div className='row  mt-3'>
                    {
                        /* Add Budget component here */
                        <>
                            <div className='col-sm'>
                                <Budget />
                            </div>



                        </>
                    }

                    {
                        /* Add Remaining component here*/
                        <div className='col-sm'>
                            <RemainingBudget />
                        </div>


                    }

                    {
                        /* Add ExpenseTotal component here */
                        <>
                            <div className='col-sm'>
                                <ExpenseTotal />
                            </div>

                            <div className='col-sm'>
                                <CurrencyDropDown />
                            </div>
                        </>

                    }

                    {
                        /* Add ExpenseList component here */
                        <div className='row mt-3'>
                            <h3 className='mt-3 text-2xl font-bold'>Allocation</h3>
                            <div className='row '>
                                <div className='col-sm'>
                                    <ExpenseList />
                                </div>
                            </div>
                        </div>
                    }



                    {
                        /* Add AllocationForm component here under */

                        <div className='container row py-1 px-3'>
                            <div>
                            <h3 className='mb-3 text-2xl font-bold'>Change allocation</h3>
                            </div>
                            <div className='col-sm'>
                                <AllocationForm />
                            </div>
                         </div> 
     
                    }





                </div>
            </div>
        </AppProvider >
    );
};
export default App;


// src/App.js
// import React from 'react';
// import ThemeSwitcher from './components/ThemeSwitcher';

// function App() {
//   return (
//     <div className="flex justify-center items-center h-screen">
//       <ThemeSwitcher />
//     </div>
//   );
// }