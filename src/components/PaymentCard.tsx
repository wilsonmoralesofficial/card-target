import React, { useState } from 'react';
import { CreditCard, Calendar, Lock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

// 1. Definimos la forma de nuestros datos
interface PaymentFormData {
  name: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

// 2. Definimos los estados posibles de la UI
type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';

export default function PaymentCard() {
  // Estado del formulario tipado con la interfaz
  const [formData, setFormData] = useState<PaymentFormData>({
    name: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  // Estado de la transacción tipado con el Union Type
  const [status, setStatus] = useState<PaymentStatus>('idle');

  // --- Lógica de Formateo y Inputs ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Lógica específica para el número de tarjeta
    if (name === 'cardNumber') {
      const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      const matches = v.match(/\d{4,16}/g);
      const match = (matches && matches[0]) || '';
      const parts = [];
      for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
      }
      if (parts.length) {
        formattedValue = parts.join(' ');
      } else {
        formattedValue = value;
      }
    }

    // Lógica específica para la fecha de expiración
    if (name === 'expiry') {
      let v = value.replace(/\D/g, '').slice(0, 4);
      if (v.length >= 3) {
        formattedValue = `${v.slice(0, 2)}/${v.slice(2)}`;
      } else {
        formattedValue = v;
      }
    }

    // Actualización segura del estado
    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  // --- Simulación de Transacción ---
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('processing');

    // Simulamos la promesa del backend
    new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Validación simulada: CVC "000" fuerza un error
        if (formData.cvc === '000') {
          reject(new Error('Tarjeta declinada'));
        } else {
          resolve();
        }
      }, 2500);
    })
      .then(() => {
        setStatus('success');
      })
      .catch(() => {
        setStatus('error');
      });
  };

  const resetForm = () => {
    setFormData({ name: '', cardNumber: '', expiry: '', cvc: '' });
    setStatus('idle');
  };

  // --- Renderizado de Éxito ---
  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-auto mt-10 border border-green-100">
        <CheckCircle size={64} className="text-green-500 mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold text-gray-800">¡Pago Exitoso!</h2>
        <p className="text-gray-500 mt-2 text-center">
          Tu transacción ha sido procesada correctamente.
        </p>
        <button
          onClick={resetForm}
          className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
        >
          Hacer otro pago
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl shadow-2xl border border-gray-100">
      
      {/* --- Visualización de la Tarjeta (Preview) --- */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white mb-8 relative overflow-hidden shadow-lg transform transition-transform hover:scale-105 duration-300">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
        
        <div className="flex justify-between items-start mb-8">
          <div className="text-xs opacity-80">Debit / Credit</div>
          <CreditCard size={24} />
        </div>
        
        <div className="text-2xl font-mono tracking-widest mb-4 h-8">
          {formData.cardNumber || '•••• •••• •••• ••••'}
        </div>
        
        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs opacity-70 mb-1">Titular</div>
            <div className="font-semibold uppercase text-sm tracking-wide">
              {formData.name || 'NOMBRE APELLIDO'}
            </div>
          </div>
          <div>
            <div className="text-xs opacity-70 mb-1">Expira</div>
            <div className="font-semibold text-sm">
              {formData.expiry || 'MM/YY'}
            </div>
          </div>
        </div>
      </div>

      {/* --- Formulario --- */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre en la tarjeta
          </label>
          <input
            type="text"
            name="name"
            placeholder="Juan Pérez"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled={status === 'processing'}
          />
        </div>

        {/* Número de Tarjeta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de tarjeta
          </label>
          <div className="relative">
            <CreditCard
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
            <input
              type="text"
              name="cardNumber"
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              value={formData.cardNumber}
              onChange={handleInputChange}
              required
              disabled={status === 'processing'}
            />
          </div>
        </div>

        {/* Grid para Expiración y CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiración
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
              <input
                type="text"
                name="expiry"
                placeholder="MM/YY"
                maxLength={5}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                value={formData.expiry}
                onChange={handleInputChange}
                required
                disabled={status === 'processing'}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVC
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
              <input
                type="text"
                name="cvc"
                placeholder="123"
                maxLength={3}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                value={formData.cvc}
                onChange={handleInputChange}
                required
                disabled={status === 'processing'}
              />
            </div>
          </div>
        </div>

        {/* Mensaje de Error */}
        {status === 'error' && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm animate-pulse">
            <XCircle size={16} />
            <span>Hubo un error procesando el pago. Revisa los datos.</span>
          </div>
        )}

        {/* Botón de Acción */}
        <button
          type="submit"
          disabled={status === 'processing'}
          className={`w-full py-3 rounded-lg font-bold text-white shadow-md transition-all 
            ${
              status === 'processing'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform active:scale-95'
            }`}
        >
          {status === 'processing' ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" size={20} /> Procesando...
            </span>
          ) : (
            'Pagar Ahora $150.00'
          )}
        </button>
      </form>
    </div>
  );
}