import React, { useState, ChangeEvent, useEffect } from 'react';
import { IConverterState, IHexValidationResult } from '../models/index';

export const Converter: React.FC = () => {
  const [state, setState] = useState<IConverterState>({
    hex: '',
    rgb: '',
    error: '',
  });

  const isValidHex = (hex: string): boolean => {
    return /^#[0-9A-F]{6}$/i.test(hex);
  };

  const hexToRgb = (hex: string): string | null => {
    if (!isValidHex(hex)) return null;
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
  };

  const getContrastYIQ = (hex: string): string => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? 'black' : 'white';
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setState(prevState => ({
      ...prevState,
      hex: value,
    }));

    if (value.length === 7) {
      const validationResult: IHexValidationResult = {
        isValid: isValidHex(value),
        rgb: hexToRgb(value),
      };

      if (validationResult.isValid && validationResult.rgb) {
        setState({
          hex: value,
          rgb: `rgb: ${validationResult.rgb}`,
          error: '',
        });
        document.body.style.backgroundColor = value;
      } else {
        setState(prevState => ({
          ...prevState,
          error: 'Ошибка!',
          rgb: '',
        }));
      }
    } else {
      setState(prevState => ({
        ...prevState,
        rgb: '',
        error: '',
      }));
    }
  };

  useEffect(() => {
    if (state.hex.length === 7 && isValidHex(state.hex)) {
      const textColor = getContrastYIQ(state.hex);
      document.documentElement.style.setProperty('--text-color', textColor);
    }
  }, [state.hex]);

  return (
    <div className="App">
      <input
        type="text"
        value={state.hex}
        onChange={handleChange}
        maxLength={7}
      />
      {state.rgb && (
        <div className="output__RGB" style={{ color: 'var(--text-color)', borderColor: 'var(--text-color)' }}>
          {state.rgb}
        </div>
      )}
      <div className="error">
        {state.error}
      </div>
    </div>
  );
};
