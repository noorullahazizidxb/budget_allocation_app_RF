
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CurrencyDropDown = () => {
    const {dispatch,currency } = useContext(AppContext);
    const [sym,setSym] = React.useState();
    
    const value = [{
        id:1,
        name:'Dollar',
        symbol:'$'
    },
    {
        id:2,
        name:'Pound',
        symbol:'£'
    },
    {
        id:3,
        name:'Euro',
        symbol:'€'
    },{
        id:4,
        name:'Rupee',
        symbol:'₹'
    }];

    const changeCurrency = (e) => {
        setSym();
        

        dispatch({
            type: 'CHG_CURRENCY',
            payload: e.target.value
        });

    }
  
    return (

        <div  >
                <select id="select-2" onChange={changeCurrency}  className="alert text-1xl block w-full bg-green-200 border-green-500 rounded-md text-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400" placeholder='Currency'>
                   {value.map((item)=>(
                       <option id={item.id}  key={item.id}  value={item.symbol}>{item.symbol} {item.name}</option>

                   ))}
                  
                </select>
              
            
           
        </div>

    );
};
export default CurrencyDropDown;