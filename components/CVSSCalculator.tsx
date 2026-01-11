import React, { useState, useEffect } from 'react';
import { Calculator, Save, RotateCcw } from 'lucide-react';
import { Card, Input, Button, ResultDisplay } from './UI';
import { CalculatorProps } from '../types';

export const CVSSCalculator: React.FC<CalculatorProps> = ({ onSave }) => {
  const [xValue, setXValue] = useState<string>('');
  const [pValue, setPValue] = useState<string>('3'); // Default 3%
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xValue, pValue]);

  const calculate = () => {
    const x = parseFloat(xValue);
    const p = parseFloat(pValue);

    if (isNaN(x) || isNaN(p) || p >= 100) {
      setResult(null);
      return;
    }

    // Formula: Y = x / (1 - p)
    // p is entered as percentage, so we divide by 100 first
    const pDecimal = p / 100;
    const y = x / (1 - pDecimal);
    setResult(y);
  };

  const handleSave = () => {
    if (result === null) return;
    onSave({
      type: 'CVSS',
      title: 'Correct Value (CVSS)',
      inputs: { 'X (Input)': parseFloat(xValue), 'P (Percentage)': parseFloat(pValue) },
      result: result
    });
  };

  const handleReset = () => {
    setXValue('');
    setPValue('3');
    setResult(null);
  };

  return (
    <Card 
      title="CVSS Calculator" 
      description="Correct Value to Send over Strip"
      icon={<Calculator className="w-6 h-6" />}
    >
      <div className="space-y-4 flex-1">
        <Input
          id="cvss-x"
          label="Input Value (X)"
          type="number"
          value={xValue}
          onChange={(e) => setXValue(e.target.value)}
          placeholder="Enter amount..."
        />
        <Input
          id="cvss-p"
          label="Percentage (P)"
          type="number"
          value={pValue}
          onChange={(e) => setPValue(e.target.value)}
          suffix="%"
          placeholder="3"
        />
      </div>

      {result !== null && (
        <ResultDisplay 
          label="Calculated Value (Y)" 
          value={result.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })} 
          type="neutral"
        />
      )}

      <div className="mt-6 flex gap-3">
        <Button variant="outline" onClick={handleReset} className="flex-1">
          <RotateCcw className="w-4 h-4 mr-2" /> Reset
        </Button>
        <Button onClick={handleSave} disabled={result === null} className="flex-1">
          <Save className="w-4 h-4 mr-2" /> Save
        </Button>
      </div>
    </Card>
  );
};