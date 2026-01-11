import React, { useState, useEffect } from 'react';
import { TrendingDown, Save, RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, Input, Button, ResultDisplay } from './UI';
import { CalculatorProps } from '../types';

export const VRLCalculator: React.FC<CalculatorProps> = ({ onSave }) => {
  const [purchaseValue, setPurchaseValue] = useState<string>('');
  const [marketValue, setMarketValue] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [status, setStatus] = useState<'safe' | 'exit' | null>(null);

  useEffect(() => {
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchaseValue, marketValue]);

  const calculate = () => {
    const pv = parseFloat(purchaseValue);
    const mv = parseFloat(marketValue);

    if (isNaN(pv) || isNaN(mv) || mv === 0) {
      setResult(null);
      setStatus(null);
      return;
    }

    // Formula: f' = ((purchase / market) - 1) * 100
    const fPrime = ((pv / mv) - 1) * 100;
    setResult(fPrime);

    // Logic: <= 10% is Safe, > 10% is Exit
    if (fPrime <= 10) {
      setStatus('safe');
    } else {
      setStatus('exit');
    }
  };

  const handleSave = () => {
    if (result === null) return;
    onSave({
      type: 'VRL',
      title: 'Value to Recover Loss (VRL)',
      inputs: { 'Purchase Value': parseFloat(purchaseValue), 'Market Value': parseFloat(marketValue) },
      result: result,
      message: status === 'safe' ? 'Safe to recover' : 'Recommend exit'
    });
  };

  const handleReset = () => {
    setPurchaseValue('');
    setMarketValue('');
    setResult(null);
    setStatus(null);
  };

  return (
    <Card 
      title="VRL Calculator" 
      description="Value to Recover Loss"
      icon={<TrendingDown className="w-6 h-6" />}
    >
      <div className="space-y-4 flex-1">
        <Input
          id="vrl-purchase"
          label="Purchase Value"
          type="number"
          value={purchaseValue}
          onChange={(e) => setPurchaseValue(e.target.value)}
          placeholder="e.g. 1000"
        />
        <Input
          id="vrl-market"
          label="Market Value"
          type="number"
          value={marketValue}
          onChange={(e) => setMarketValue(e.target.value)}
          placeholder="e.g. 900"
        />
      </div>

      {result !== null && (
        <ResultDisplay 
          label="Recovery Index (f')" 
          value={`${result.toFixed(2)}%`}
          message={
            status === 'safe' 
              ? <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4"/> You are safe, you can recover your loss.</span>
              : <span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> Value &gt; 10%. We recommend to exit.</span>
          }
          type={status === 'safe' ? 'success' : 'danger'}
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