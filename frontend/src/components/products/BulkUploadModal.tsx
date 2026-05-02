import React, { useState } from 'react';
import { X, Upload, Download, FileText, CheckCircle2 } from 'lucide-react';
import { productApi } from '@/lib/api';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function BulkUploadModal({ isOpen, onClose, onSuccess }: BulkUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    // CSV Header: ProductName,Category,Barcode,Brand,Size,Color,PurchasePrice,SellingPrice,Quantity,Status
    const csvContent = "ProductName,Category,Barcode,Brand,Size,Color,PurchasePrice,SellingPrice,Quantity,Status\nExample T-Shirt,Apparel,100123456789,Polo,M,Red,1000,1500,50,ACTIVE\nExample T-Shirt,Apparel,100987654321,Polo,L,Blue,1000,1500,30,ACTIVE\n";
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'SmartWave_Products_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    try {
      await productApi.bulkUpload(selectedFile);
      setUploadSuccess(true);
      
      // Reset after showing success briefly
      setTimeout(() => {
        setUploadSuccess(false);
        setSelectedFile(null);
        if (onSuccess) onSuccess();
        onClose();
      }, 2000);
    } catch (error: any) {
      alert("Upload failed: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-xl font-extrabold text-[#1D4ED8] flex items-center gap-2">
            <Upload size={24} />
            Bulk CSV Upload
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {uploadSuccess ? (
            <div className="text-center py-8 animate-in fade-in zoom-in">
              <div className="w-20 h-20 bg-[#ECFDF5] text-[#059669] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Upload Complete!</h3>
              <p className="text-slate-500">Your products are being processed into inventory.</p>
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Step 1: Download Template */}
              <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-6 text-center">
                <h4 className="font-bold text-[#1D4ED8] mb-2">Step 1: Download Template</h4>
                <p className="text-sm text-[#3B82F6] mb-4">Use our standard CSV format to prepare your product data.</p>
                <button 
                  onClick={handleDownloadTemplate}
                  className="bg-white border-2 border-[#1D4ED8] text-[#1D4ED8] hover:bg-[#DBEAFE] px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 mx-auto transition-colors shadow-sm"
                >
                  <Download size={16} /> Download CSV Template
                </button>
              </div>

              {/* Step 2: Upload File */}
              <div>
                <h4 className="font-bold text-slate-800 mb-3 text-center">Step 2: Upload Completed File</h4>
                
                <label className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${selectedFile ? 'border-[#1D4ED8] bg-[#EFF6FF]' : 'border-slate-300 hover:border-[#1D4ED8] hover:bg-slate-50'}`}>
                  <FileText size={40} className={selectedFile ? 'text-[#1D4ED8] mb-3' : 'text-slate-300 mb-3'} />
                  
                  {selectedFile ? (
                    <div className="text-center">
                      <p className="font-bold text-[#1D4ED8]">{selectedFile.name}</p>
                      <p className="text-xs text-[#3B82F6] mt-1">Ready to upload</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="font-bold text-slate-600">Click to browse or drag file here</p>
                      <p className="text-xs text-slate-400 mt-1">Supports .csv files only</p>
                    </div>
                  )}
                  
                  <input 
                    type="file" 
                    accept=".csv" 
                    onChange={handleFileChange} 
                    className="hidden" 
                  />
                </label>
              </div>

              {/* Upload Button */}
              <button 
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="w-full bg-gradient-to-r from-[#1E40AF] to-[#2563EB] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>Processing File...</>
                ) : (
                  <><Upload size={20} /> Upload Products</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
