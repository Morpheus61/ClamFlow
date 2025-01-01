import React, { useState } from 'react';
import { Check, X, AlertTriangle } from 'lucide-react';
import { useNotification } from '../../../hooks/useNotification';
import { db } from '../../../db';

interface PackagingQCProps {
  lotNumber: string;
}

export default function PackagingQC({ lotNumber }: PackagingQCProps) {
  const [checklist, setChecklist] = useState([
    { id: '1', label: 'Package Integrity', passed: null, notes: '' },
    { id: '2', label: 'Label Accuracy', passed: null, notes: '' },
    { id: '3', label: 'Weight Verification', passed: null, notes: '' },
    { id: '4', label: 'Product Temperature', passed: null, notes: '' },
    { id: '5', label: 'QR Code Readability', passed: null, notes: '' },
    { id: '6', label: 'Product Grade Verification', passed: null, notes: '' }
  ]);

  const [selectedBoxes, setSelectedBoxes] = useState<string[]>([]);
  const { addNotification } = useNotification();

  const handleCheck = (id: string, passed: boolean) => {
    setChecklist(items =>
      items.map(item =>
        item.id === id ? { ...item, passed } : item
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (checklist.some(item => item.passed === null)) {
      addNotification('error', 'Please complete all quality checks');
      return;
    }

    if (selectedBoxes.length === 0) {
      addNotification('error', 'Please select at least one box for QC');
      return;
    }

    try {
      // Update lot with QC results
      await db.update('lots', parseInt(lotNumber), {
        packagingQC: {
          checklist,
          inspectedBoxes: selectedBoxes,
          completedAt: new Date().toISOString(),
          passed: checklist.every(item => item.passed)
        }
      });

      addNotification('success', 'Packaging quality control completed');
    } catch (error) {
      console.error('Error saving QC results:', error);
      addNotification('error', 'Error saving quality control results');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {checklist.map((item) => (
          <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{item.label}</span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => handleCheck(item.id, true)}
                  className={`p-2 rounded-full ${
                    item.passed === true
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Check className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleCheck(item.id, false)}
                  className={`p-2 rounded-full ${
                    item.passed === false
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {checklist.some(item => item.passed === false) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-yellow-800">
            <AlertTriangle className="h-5 w-5" />
            <span>Some quality checks have failed. Add detailed notes for failed items.</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
      >
        Submit Quality Control Results
      </button>
    </form>
  );
}