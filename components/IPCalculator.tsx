import React, { useState, useEffect } from 'react';
import { Percent, Save, RotateCcw } from 'lucide-react';
import { Card, Input, Button, ResultDisplay } from './UI';
import { CalculatorProps } from '../types';

export const IPCalculator: React.FC<CalculatorProps> = ({ onSave }) => {
  const [xValue, setXValue] = useState<string>('');
  const [yValue, setYValue] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xValue, yValue]);

  const calculate = () => {
    const x = parseFloat(xValue);
    const y = parseFloat(yValue);

    if (isNaN(x) || isNaN(y) || x === 0) {
      setResult(null);
      return;
    }

    // Formula: f = (Y / X) * 100
    const f = (y / x) * 100;
    setResult(f);
  };

  const handleSave = () => {
    if (result === null) return;
    onSave({
      type: 'IP',
      title: 'Inverse Percentage (IP)',
      inputs: { 'X (Base)': parseFloat(xValue), 'Y (Part)': parseFloat(yValue) },
      result: result
    });
  };

  const handleReset = () => {
    setXValue('');
    setYValue('');
    setResult(null);
  };

  return (
    <Card 
      title="IP Calculator" 
      description="Inverse Percentage Calculation"
      icon={<Percent className="w-6 h-6" />}
    >
      <div className="space-y-4 flex-1">
        <Input
          id="ip-y"
          label="Value Y (Part)"
          type="number"
          value={yValue}
          onChange={(e) => setYValue(e.target.value)}
          placeholder="Enter part value..."
        />
        <Input
          id="ip-x"
          label="Value X (Base)"
          type="number"
          value={xValue}
          onChange={(e) => setXValue(e.target.value)}
          placeholder="Enter base value..."
        />
      </div>

      {result !== null && (
        <ResultDisplay 
          label="Percentage (f)" 
          value={`${result.toFixed(2)}%`}
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