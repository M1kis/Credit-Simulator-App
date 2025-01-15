import React, { useState } from 'react';
import { ToastContainer, toast, Zoom } from 'react-toastify';

import DataTable, { createTheme } from 'react-data-table-component';

const App = () => {
  const [value, setValue] = useState('');
  const [numericValue, setNumericValue] = useState(0);
  const [interestRate, setInterestRate] = useState('');
  const [isInitialCuoteDisabled, setIsInitialCuoteDisabled] = useState(false);
  const [cuoteValue, setCuoteValue] = useState('');

  //TABLA DE DATOS --------------------------------------------------------------------------------------

  //Tema personalizado

  createTheme('tema1', {
    text: {
      primary: '#cbd5e1',
      secondary: '#2aa198',
    },
    background: {
      default: '#64748b',
    },
    context: {
      background: '#cb4b16',
      text: '#FFFFFF',
    },
    divider: {
      default: '#FFFFFF',
    },
    action: {
      button: 'rgba(0,0,0,.54)',
      hover: 'rgba(0,0,0,.08)',
      disabled: 'rgba(0,0,0,.12)',
    },
  }, 'dark');

  const customStyles = {
    cells: {
      style: {
        justifyContent: 'center', // Centra horizontalmente
        textAlign: 'center' as 'center',     // Centra el texto dentro de la celda
      },
    },
    headCells: {
      style: {
        backgroundColor: '#475569',
        justifyContent: 'center', // Centra los encabezados horizontalmente
        textAlign: 'center' as 'center',     // Centra el texto de los encabezados
      },
    },
  };

  const columns = [
    {
      name: 'Mes',
      selector: (row: { month: any; }) => row.month,
    },
    {
      name: 'Abono al capital',
      selector: (row: { capital: any; }) => row.capital,
    },
    {
      name: 'Interes',
      selector: (row: { interest: any; }) => row.interest,
    },
    {
      name: 'Cuota',
      selector: (row: { cuote: any; }) => row.cuote,
    },
    {
      name: 'Saldo a capital',
      selector: (row: { balance: any; }) => row.balance,
    },
  ];

  const [data, setData] = useState([
    {
      id: 1,
      month: '1',
      capital: '$0',
      interest: '$0',
      cuote: '$0',
      balance: '$0',
    },
  ]);

  //TABLA DE DATOS --------------------------------------------------------------------------------------

  const handleCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    const minValueCuote = document.getElementById('min-value-cuote') as HTMLParagraphElement;
    setIsInitialCuoteDisabled(isChecked);

    if (isChecked) {
      minValueCuote.classList.add('hidden');
      setCuoteValue('');
    }
  };

  const calculateCredit = () => {
    const result1 = document.getElementById('result-1') as HTMLParagraphElement;
    const input1 = document.getElementById('input-1') as HTMLInputElement;
    const input2 = document.getElementById('input-2') as HTMLInputElement;
    const initialCuote = document.getElementById('initial-cuote') as HTMLInputElement;
    const minValue = document.getElementById('min-value') as HTMLParagraphElement;
    const cuoteResult = document.getElementById('cuote-result') as HTMLParagraphElement;
    const cuoteInterest = document.getElementById('cuote-interest') as HTMLParagraphElement;
    const cuoteTime = document.getElementById('cuote-time') as HTMLSelectElement;
    const minValueCuote = document.getElementById('min-value-cuote') as HTMLParagraphElement;
    const totalMonths = document.getElementById('total-months') as HTMLParagraphElement;
    const result2 = document.getElementById('result-2') as HTMLDivElement;

    if (input1.value === '' || input2.value === '' || !minValue.classList.contains('hidden') || !minValueCuote.classList.contains('hidden')) {
      toast.error('Error, por favor verifica los campos');
      return;
    } else {
      toast.success('Calculo exitoso!');
      result1.classList.remove('hidden');
      result2.classList.add('hidden');
      cuoteInterest.textContent = `${interestRate} %`;
      totalMonths.textContent = cuoteTime.value;

      let initialCuoteValue = 0;
      if (!isInitialCuoteDisabled) {
        initialCuoteValue = initialCuote.value
          ? parseFloat(initialCuote.value.replace(/[^0-9]/g, ''))
          : 0;
      }

      const creditAmount = numericValue;
      const financedAmount = creditAmount - initialCuoteValue;
      const selectedTerm = parseInt(cuoteTime.value);
      const annualInterestRate = parseFloat(interestRate.replace(',', '.')) / 100;
      const monthlyInterestRate = annualInterestRate / 12;

      const rows = [];
      let remainingBalance = financedAmount;

      for (let i = 1; i <= selectedTerm; i++) {

        const interest = remainingBalance * monthlyInterestRate;

        const cuotaMensual =
          monthlyInterestRate > 0
            ? (financedAmount * monthlyInterestRate) /
            (1 - Math.pow(1 + monthlyInterestRate, -selectedTerm))
            : financedAmount / selectedTerm;

        const capital = cuotaMensual - interest;

        cuoteResult.textContent = `$${cuotaMensual.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;

        remainingBalance -= capital;

        rows.push({
          id: i,
          month: i.toString(),
          capital: `$${capital.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`,
          interest: `$${interest.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`,
          cuote: `$${cuotaMensual.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`,
          balance: `$${remainingBalance.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`,
        });

        if (remainingBalance < 0) remainingBalance = 0;
      }

      setData(rows);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const minValue = document.getElementById('min-value') as HTMLParagraphElement;

    let numericValue = inputValue.replace(/[^0-9]/g, '');

    if (numericValue.startsWith('0')) {
      numericValue = '';
    }

    if (numericValue.length > 9) return;

    if (numericValue && Number(numericValue) < 500000) {
      minValue.classList.remove('hidden');
    } else {
      minValue.classList.add('hidden');
    }

    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    setValue(numericValue ? `$${formattedValue}` : '');
    setNumericValue(numericValue ? Number(numericValue) : 0);
  };

  const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;

    input = input.replace(/[^0-9]/g, '');

    if (input.length > 4) {
      input = input.slice(0, 4);
    }

    setInterestRate(input);
  };

  const handleInterestRateBlur = () => {
    if (interestRate) {
      if (interestRate.includes(',')) {
        return;
      }

      const numericValue = interestRate.replace(/[^0-9]/g, '');

      if (numericValue.length === 4) {
        setInterestRate(`${numericValue.slice(0, 2)},${numericValue.slice(2)}`);
      } else if (numericValue.length === 3) {
        setInterestRate(`${numericValue.slice(0, 2)},${numericValue.slice(2)}0`);
      } else if (numericValue.length === 2) {
        setInterestRate(`${numericValue.slice(0, 2)},00`);
      } else if (numericValue.length === 1) {
        setInterestRate(`${numericValue.slice(0, 1)},00`); // Ajustar correctamente
      }
    }
  };

  const handleCuoteRate = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputCuote = e.target.value;

    let numericCuoteValue = inputCuote.replace(/[^0-9]/g, '');

    if (numericCuoteValue.startsWith('0')) {
      numericCuoteValue = '';
    }

    if (numericCuoteValue.length > 9) return;

    const formattedValue = numericCuoteValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    const creditValue = numericValue;

    const initialCuote = document.getElementById('initial-cuote') as HTMLInputElement;
    const initialCuoteValue = initialCuote.value
      ? parseFloat(initialCuote.value.replace(/[^0-9]/g, ''))
      : 0;

    console.log('Valor cuota inicial:', initialCuoteValue);
    console.log('Monto crédito:', creditValue);

    const minValueCuote = document.getElementById('min-value-cuote') as HTMLParagraphElement;

    if (initialCuoteValue > creditValue) {
      minValueCuote.classList.remove('hidden');
    } else {
      minValueCuote.classList.add('hidden');
    }

    setCuoteValue(numericCuoteValue ? `$${formattedValue}` : '');
  };

  const handlePayments = () => {
    const result2 = document.getElementById('result-2') as HTMLDivElement;
    result2.classList.toggle('hidden');
  };

  return (
    <div className="bg-slate-900 min-h-screen items-center justify-center flex flex-col gap-4 p-4">

      {/* Componente principal */}

      <div className="flex flex-col w-1/2 bg-slate-600 items-center justify-center p-8 rounded-lg">
        <h1 className="text-white text-3xl font-bold">Simulador de crédito</h1>
        <div className="w-full flex gap-4 mt-4">
          <div className="w-full flex flex-col gap-2">
            <h2 className="font-semibold text-slate-300">¿Cuánto necesitas?</h2>
            <input
              id='input-1'
              type="text"
              placeholder="Desde $500.000"
              value={value}
              onChange={handleChange}
              className="w-full rounded-lg p-2"
            />
            <p id="min-value" className="text-red-500 text-sm hidden">
              El valor debe ser mayor a $500.000
            </p>
          </div>
          <div className="w-full flex flex-col gap-2">
            <h2 className="font-semibold text-slate-300">¿A qué plazo?</h2>
            <select name="" id="cuote-time" className="w-full rounded-lg p-2">
              <option value="12">12 Meses</option>
              <option value="24">24 Meses</option>
              <option value="36">36 Meses</option>
              <option value="48">48 Meses</option>
              <option value="60">60 Meses</option>
              <option value="72">72 Meses</option>
            </select>
          </div>
        </div>
        <div className="w-full flex gap-4 mt-4">
          <div className="w-full flex flex-col gap-2">
            <h2 className="font-semibold text-slate-300">Valor de la cuota inicial (20% recomendado)</h2>
            <input
              id="initial-cuote"
              type="text"
              value={cuoteValue}
              placeholder="$0"
              className="w-full rounded-lg p-2"
              onChange={handleCuoteRate}
              disabled={isInitialCuoteDisabled}
            />
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="initial-cuote-checkbox"
                onChange={handleCheckBox}
              />
              <p className="text-slate-400">Sin cuota inicial</p>
            </div>
            <p id="min-value-cuote" className="text-red-500 text-sm hidden">El valor de la cuota inicial no puede ser superior al valor del credito.</p>
          </div>
          <div className="w-full flex flex-col gap-2">
            <h2 className="font-semibold text-slate-300">Tasa de interés (% E.A)</h2>
            <input
              id='input-2'
              type="text"
              value={interestRate}
              onChange={handleInterestRateChange}
              onBlur={handleInterestRateBlur}
              placeholder="Ej. 12,00"
              className="w-full rounded-lg p-2"
            />
          </div>
        </div>
        <div className='w-full flex items-center justify-center pt-4'>
          <button className="bg-blue-400 hover:bg-blue-500 transition duration-300 text-white rounded-lg p-2 w-1/4" onClick={calculateCredit}>Calcular</button>
        </div>
      </div>

      {/* Resultado calculo mensual de credito */}

      <div className='flex w-1/2 bg-slate-500 items-center justify-center p-8 rounded-lg gap-4 hidden' id='result-1'>
        <div className='w-full flex flex-col'>
          <h2 className='text-slate-300'>Cuota mensual (con intereses)</h2>
          <p className='text-xl font-semibold text-white' id='cuote-result'>$0</p>
        </div>
        <div className='w-full flex justify-between items-center'>
          <div className='flex flex-col items-center'>
            <p className='text-slate-300'>Meses</p>
            <p className='text-l font-semibold text-white' id='total-months'>12</p>
          </div>
          <div className='flex flex-col items-center'>
            <p className='text-slate-300'>Tasa de interes</p>
            <p className='text-l font-semibold text-white' id='cuote-interest'>0,00</p>
          </div>
          <button className='bg-blue-400 hover:bg-blue-500 transition duration-300 p-3 rounded-lg text-white' id='button-payments' onClick={handlePayments}>Plan de pagos</button>
        </div>
      </div>

      {/* Componente para tabla de datos */}

      <div className='flex hidden w-1/2 items-center justify-center rounded-lg gap-4 bg-slate-600' id='result-2'>
        <div className='w-full flex rounded-lg'>
          <DataTable
            columns={columns}
            data={data}
            theme="tema1"
            customStyles={customStyles}
          />
        </div>
      </div>

      {/* Componente para mostrar notificaciones */}

      <div>
        {/* Toast Error */}
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          theme="dark"
          transition={Zoom}
        />
      </div>
    </div>
  );
};

export default App;