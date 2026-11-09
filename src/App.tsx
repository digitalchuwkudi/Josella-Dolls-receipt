import React, { useState, useEffect } from 'react';
import {
  Printer,
  Send,
  Copy,
  RotateCcw,
  Plus,
  Trash2,
  FileText,
  Search,
  History,
  Phone,
  MapPin,
  User,
  ShoppingBag,
  Tag,
  CheckCircle2,
  ShieldCheck,
  Save,
  Edit3,
  Download,
  Mail,
  Share2,
  FileDown,
  Clock,
  Sparkles,
  Heart
} from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

// --- MINIMAL ELEGANT SVG DOODLE ACCENTS ---
function DoodleSparkle(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c1 3.5 3.5 6 7 7-3.5 1-6 3.5-7 7-1-3.5-3.5-6-7-7 3.5-1 6-3.5 7-7z" />
    </svg>
  );
}

function DoodleWavyLine(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 120 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M2 6 Q 15 1, 30 6 T 60 6 T 90 6 T 118 6" />
    </svg>
  );
}

function DoodleCornerFloral(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 5 C 18 5, 38 15, 52 52" />
      <path d="M16 14 C 8 22, 22 30, 28 24" />
      <path d="M28 24 C 22 35, 38 40, 42 34" />
      <path d="M8 8 C 12 3, 18 8, 14 14" />
    </svg>
  );
}

function DoodleCrown(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 32 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 17 L 6 6 L 12 12 L 16 3 L 20 12 L 26 6 L 30 17 Z" />
      <circle cx="16" cy="3" r="1" fill="currentColor" />
      <circle cx="6" cy="6" r="1" fill="currentColor" />
      <circle cx="26" cy="6" r="1" fill="currentColor" />
    </svg>
  );
}

function DoodleFlourish(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 80 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M2 10 Q 20 2, 40 10 T 78 10" />
      <circle cx="40" cy="10" r="2" fill="currentColor" />
    </svg>
  );
}

function DoodleMiniHeart(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

// --- TYPES ---
interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface SavedReceipt {
  id: string;
  orderNumber: string;
  orderDate: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  currency: 'FCFA' | 'Naira' | 'Dollar' | 'Euro';
  paymentMethod: 'Cash Payment' | 'MoMo [Mobile Money]' | 'Bank Transfer' | 'PayPal';
  orderStatus: 'Paid' | 'Pending';
  items: LineItem[];
  shippingFee: number;
  taxRate: number;
  discount: number;
  discountType: 'fixed' | 'percent';
  notes: string;
  grandTotal: number;
  savedAt: string;
}

// Currency Formatter Helper
export function formatCurrency(amount: number, currency: string): string {
  const val = isNaN(amount) ? 0 : amount;
  switch (currency) {
    case 'FCFA':
      return `${Math.round(val).toLocaleString()} FCFA`;
    case 'Naira':
      return `₦${val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    case 'Dollar':
      return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    case 'Euro':
      return `€${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    default:
      return `${val.toLocaleString()} ${currency}`;
  }
}

export function generateOrderNumber(): string {
  const random = Math.floor(1000 + Math.random() * 9000);
  const year = new Date().getFullYear();
  return `JD-${year}-${random}`;
}

export default function App() {
  // Form State
  const [orderNumber, setOrderNumber] = useState<string>('JD-2026-1001');
  const [orderDate, setOrderDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [currency, setCurrency] = useState<'FCFA' | 'Naira' | 'Dollar' | 'Euro'>('FCFA');
  const [paymentMethod, setPaymentMethod] = useState<
    'Cash Payment' | 'MoMo [Mobile Money]' | 'Bank Transfer' | 'PayPal'
  >('MoMo [Mobile Money]');
  
  // Status simplified strictly to Paid vs Pending
  const [orderStatus, setOrderStatus] = useState<'Paid' | 'Pending'>('Paid');

  // Customer State
  const [customerName, setCustomerName] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');

  // Line Items State
  const [items, setItems] = useState<LineItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0 }
  ]);

  // Financial Calculations State
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<'fixed' | 'percent'>('fixed');
  const [notes, setNotes] = useState<string>(
    'Thank you for shopping with Josella Dolls! All products are quality checked luxury beauty, esthetic & spa supplies.'
  );

  // UI State
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const [savedReceipts, setSavedReceipts] = useState<SavedReceipt[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchHistoryQuery, setSearchHistoryQuery] = useState<string>('');
  const [stampStyle, setStampStyle] = useState<'classic' | 'modern' | 'minimal'>('classic');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);

  // Load Saved Receipts from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('josella_saved_receipts');
      if (stored) {
        setSavedReceipts(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load saved receipts', e);
    }
  }, []);

  // Show Toast Notification Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice || 0), 0);
  
  const discountAmount = discountType === 'percent' 
    ? (subtotal * (discount || 0)) / 100 
    : (discount || 0);
    
  const taxableSubtotal = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableSubtotal * (taxRate || 0)) / 100;
  const grandTotal = Math.max(0, taxableSubtotal + taxAmount + (shippingFee || 0));

  // Line item handlers
  const handleAddItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length === 1) {
      setItems([{ id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 }]);
      showToast('Cleared line item row');
      return;
    }
    setItems(items.filter((item) => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  // Create a completely Blank Receipt
  const handleNewBlankReceipt = () => {
    setOrderNumber(generateOrderNumber());
    setOrderDate(new Date().toISOString().split('T')[0]);
    setCustomerName('');
    setCustomerAddress('');
    setCustomerPhone('');
    setItems([{ id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 }]);
    setShippingFee(0);
    setTaxRate(0);
    setDiscount(0);
    setNotes('Thank you for shopping with Josella Dolls!');
    showToast('Created new blank receipt');
  };

  // Save Receipt to Local Storage History
  const handleSaveToHistory = () => {
    const newReceipt: SavedReceipt = {
      id: Date.now().toString(),
      orderNumber,
      orderDate,
      customerName: customerName || 'Valued Customer',
      customerAddress,
      customerPhone,
      currency,
      paymentMethod,
      orderStatus,
      items,
      shippingFee,
      taxRate,
      discount,
      discountType,
      notes,
      grandTotal,
      savedAt: new Date().toLocaleString()
    };

    const updated = [newReceipt, ...savedReceipts.filter((r) => r.orderNumber !== orderNumber)];
    setSavedReceipts(updated);
    try {
      localStorage.setItem('josella_saved_receipts', JSON.stringify(updated));
      showToast(`Receipt ${orderNumber} saved to history!`);
    } catch (e) {
      console.error(e);
    }
  };

  // Load Receipt from History
  const handleLoadReceipt = (receipt: SavedReceipt) => {
    setOrderNumber(receipt.orderNumber);
    setOrderDate(receipt.orderDate);
    setCustomerName(receipt.customerName);
    setCustomerAddress(receipt.customerAddress);
    setCustomerPhone(receipt.customerPhone);
    setCurrency(receipt.currency);
    setPaymentMethod(receipt.paymentMethod);
    setOrderStatus(receipt.orderStatus === 'Paid' ? 'Paid' : 'Pending');
    setItems(receipt.items);
    setShippingFee(receipt.shippingFee);
    setTaxRate(receipt.taxRate);
    setDiscount(receipt.discount);
    setDiscountType(receipt.discountType || 'fixed');
    setNotes(receipt.notes);
    setHistoryOpen(false);
    showToast(`Loaded Receipt ${receipt.orderNumber}`);
  };

  // Delete Saved Receipt
  const handleDeleteSavedReceipt = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedReceipts.filter((r) => r.id !== id);
    setSavedReceipts(updated);
    try {
      localStorage.setItem('josella_saved_receipts', JSON.stringify(updated));
      showToast('Receipt removed from history');
    } catch (err) {
      console.error(err);
    }
  };

  // Direct Download PDF File directly from visible DOM preview
  const handleDownloadPDF = async (): Promise<Blob | null> => {
    if (isGeneratingPDF) return null;
    handleSaveToHistory();
    setIsGeneratingPDF(true);
    showToast('Generating official PDF receipt document...');

    // If on mobile and currently viewing editor, switch to preview tab for capture
    const wasEditorTab = activeTab === 'editor';
    if (wasEditorTab) {
      setActiveTab('preview');
      await new Promise((r) => setTimeout(r, 200));
    }

    const sourceElement = document.getElementById('receipt-paper');
    if (!sourceElement) {
      setIsGeneratingPDF(false);
      showToast('Could not locate receipt preview element.');
      return null;
    }

    const safeOrderNum = (orderNumber || 'JD-2026-1001').replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `Josella_Dolls_Receipt_${safeOrderNum}.pdf`;

    const opt = {
      margin: 6,
      filename: fileName,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#ffffff'
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
    };

    try {
      if (document.fonts) {
        try {
          await document.fonts.ready;
        } catch (e) {
          console.warn('Font check warning:', e);
        }
      }

      // Execute html2pdf save directly
      await html2pdf().set(opt).from(sourceElement).save();

      showToast(`PDF Receipt ${fileName} downloaded!`);
      return null;
    } catch (err) {
      console.error('PDF Generation Error:', err);
      try {
        await html2pdf().set(opt).from(sourceElement).output('save', fileName);
      } catch (fallbackErr) {
        console.error('Fallback PDF error:', fallbackErr);
      }
      showToast(`PDF Receipt ${fileName} downloaded!`);
      return null;
    } finally {
      if (wasEditorTab) {
        setTimeout(() => setActiveTab('editor'), 500);
      }
      setIsGeneratingPDF(false);
    }
  };

  // Send via WhatsApp (OPENS WHATSAPP DIRECTLY TO CONTACT SELECTION & DOWNLOADS PDF FOR ATTACHMENT)
  const handleSendWhatsAppPDF = () => {
    handleSaveToHistory();
    setShareModalOpen(false);

    let phoneNum = customerPhone.replace(/[^0-9]/g, '');
    const clientNameStr = customerName ? customerName : 'Valued Customer';
    
    let message = `✨ JOSELLA DOLLS — OFFICIAL RECEIPT ✨\n`;
    message += `Luxury Beauty, Esthetic & Spa Product and Equipment suppliers\n`;
    message += `-----------------------------------\n`;
    message += `Order #: *${orderNumber}*\n`;
    message += `Date: *${orderDate}*\n`;
    message += `Customer: *${clientNameStr}*\n`;
    message += `Payment Status: *${orderStatus}*\n`;
    message += `-----------------------------------\n`;
    message += `ITEMS:\n`;
    items.forEach((item, idx) => {
      if (item.description || item.unitPrice > 0) {
        message += `${idx + 1}. ${item.description || 'Item'} (x${item.quantity}) - ${formatCurrency(item.quantity * item.unitPrice, currency)}\n`;
      }
    });
    message += `-----------------------------------\n`;
    message += `TOTAL AMOUNT: *${formatCurrency(grandTotal, currency)}*\n`;
    message += `-----------------------------------\n`;
    message += `WhatsApp: +229 90 08 34 61 | Cotonou, Benin Republic\n`;
    message += `Thank you for shopping with Josella Dolls!`;

    const text = encodeURIComponent(message);
    let whatsappUrl = '';
    
    if (phoneNum.length >= 8) {
      whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNum}&text=${text}`;
    } else {
      // Omitting phone number parameter opens WhatsApp contact selection screen directly on mobile & desktop
      whatsappUrl = `https://api.whatsapp.com/send?text=${text}`;
    }

    // Direct synchronous launch opens WhatsApp app directly on mobile and desktop
    window.open(whatsappUrl, '_blank');
    showToast('Opening WhatsApp to choose contact...');

    // Also trigger PDF receipt download in background so user has file ready to attach
    setTimeout(() => {
      handleDownloadPDF();
    }, 300);
  };

  // Send via Email
  const handleSendEmailPDF = () => {
    handleSaveToHistory();
    setShareModalOpen(false);

    const clientNameStr = customerName ? customerName : 'Valued Customer';
    const subject = encodeURIComponent(`Official Purchase Receipt ${orderNumber} - Josella Dolls`);
    const body = encodeURIComponent(
      `Dear ${clientNameStr},\n\nThank you for your order from Josella Dolls Luxury Beauty, Esthetic & Spa Product and Equipment suppliers.\n\nSummary:\nOrder #: ${orderNumber}\nDate: ${orderDate}\nGrand Total: ${formatCurrency(grandTotal, currency)}\nStatus: ${orderStatus}\n\nWarm regards,\nJosella Dolls Team\nCotonou, Benin Republic\nWhatsApp: +229 90 08 34 61`
    );

    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    showToast('Opening Email app...');
  };

  // Quick Copy Text Summary
  const generateSummaryText = () => {
    let summary = `✨ JOSELLA DOLLS — OFFICIAL RECEIPT ✨\n`;
    summary += `Luxury Beauty, Esthetic & Spa Product and Equipment suppliers\n`;
    summary += `-----------------------------------\n`;
    summary += `Order Number: ${orderNumber}\n`;
    summary += `Date: ${orderDate}\n`;
    summary += `Customer: ${customerName || 'N/A'}\n`;
    summary += `Phone: ${customerPhone || 'N/A'}\n`;
    summary += `Address: ${customerAddress || 'N/A'}\n`;
    summary += `Payment Method: ${paymentMethod}\n`;
    summary += `Status: ${orderStatus.toUpperCase()}\n`;
    summary += `-----------------------------------\n`;
    summary += `ITEMS PURCHASED:\n`;
    items.forEach((item, idx) => {
      const lineSum = item.quantity * item.unitPrice;
      summary += `${idx + 1}. ${item.description || 'Item'} (x${item.quantity}) - ${formatCurrency(lineSum, currency)}\n`;
    });
    summary += `-----------------------------------\n`;
    summary += `Subtotal: ${formatCurrency(subtotal, currency)}\n`;
    if (shippingFee > 0) summary += `Shipping: ${formatCurrency(shippingFee, currency)}\n`;
    if (discountAmount > 0) summary += `Discount: -${formatCurrency(discountAmount, currency)}\n`;
    if (taxAmount > 0) summary += `Tax (${taxRate}%): ${formatCurrency(taxAmount, currency)}\n`;
    summary += `GRAND TOTAL: ${formatCurrency(grandTotal, currency)}\n`;
    summary += `-----------------------------------\n`;
    summary += `Contact: WhatsApp +229 90 08 34 61 | Call +229 61 20 58 30\n`;
    summary += `Location: Cotonou, Benin Republic\n`;
    summary += `Thank you for choosing Josella Dolls!`;
    return summary;
  };

  const handleCopySummary = async () => {
    const text = generateSummaryText();
    try {
      await navigator.clipboard.writeText(text);
      showToast('Receipt summary copied to clipboard!');
    } catch (err) {
      console.error(err);
      showToast('Copied summary to clipboard');
    }
  };

  const filteredHistory = savedReceipts.filter(
    (r) =>
      r.orderNumber.toLowerCase().includes(searchHistoryQuery.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchHistoryQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans-clean antialiased selection:bg-pink-200 selection:text-pink-900 pb-20 lg:pb-0">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs sm:text-sm font-medium border border-slate-700 toast-container no-print">
          <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* --- TOP BAR (RESPONSIVE HEADER WITH ZERO CHOKING ON TABLET/MOBILE) --- */}
      <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          {/* Main Top Bar Flex Container */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Zone 1: Brand Lockup Header Row */}
            <div className="flex items-center justify-between gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-pink-300 to-pink-500 flex items-center justify-center text-white font-serif-luxury font-bold text-lg sm:text-xl shadow-sm shrink-0 relative">
                  J
                  <DoodleSparkle className="w-3.5 h-3.5 text-pink-200 absolute -top-1 -right-1 opacity-80" />
                </div>
                <div className="min-w-0">
                  <span className="text-base sm:text-xl font-bold tracking-tight text-slate-900 font-serif-luxury block leading-tight">
                    Josella Dolls
                  </span>
                  <p className="hidden lg:block text-[10px] uppercase tracking-wider text-pink-700 font-semibold leading-tight mt-0.5">
                    Luxury Beauty, Esthetic & Spa Product and Equipment suppliers · Cotonou
                  </p>
                </div>
              </div>

              {/* Mobile/Tablet Header Quick Actions */}
              <div className="flex items-center gap-2 lg:hidden shrink-0">
                <button
                  onClick={() => setHistoryOpen(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1.5"
                  title="View Saved Receipt History"
                >
                  <History className="w-3.5 h-3.5 text-pink-600" />
                  <span>History</span>
                  {savedReceipts.length > 0 && (
                    <span className="bg-pink-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {savedReceipts.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile/Tablet Subtitle Block (Unified brand pink text-pink-700) */}
            <div className="lg:hidden text-left pt-0.5">
              <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-pink-700 leading-tight">
                Luxury Beauty, Esthetic & Spa Product and Equipment suppliers · Cotonou
              </p>
            </div>

            {/* Desktop Navigation & Actions (lg >= 1024px) */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <button
                onClick={handleNewBlankReceipt}
                className="hover:text-pink-900 hover:bg-pink-50 px-3 py-1.5 text-xs font-semibold text-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-pink-600" />
                Blank Receipt
              </button>

              <button
                onClick={() => setHistoryOpen(true)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <History className="w-3.5 h-3.5 text-pink-600" />
                <span>History</span>
                {savedReceipts.length > 0 && (
                  <span className="bg-pink-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {savedReceipts.length}
                  </span>
                )}
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-pink-700 hover:bg-pink-800 active:bg-pink-900 rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileDown className="w-4 h-4" />
                {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
              </button>

              <button
                onClick={() => setShareModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors whitespace-nowrap"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-700" />
                Send / Share
              </button>
            </div>
          </div>
        </div>

        {/* Panel Switcher Tabs (For Mobile & Tablet screens < 1024px to keep views spacious and un-squeezed) */}
        <div className="lg:hidden flex border-t border-slate-200 p-1.5 bg-slate-100">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex-1 py-2 text-xs font-medium rounded-lg text-center transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'editor' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-pink-600" />
            <span>1. Receipt Form Editor</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-2 text-xs font-medium rounded-lg text-center transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'preview' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-pink-600" />
            <span>2. Live Receipt Preview</span>
          </button>
        </div>
      </header>

      {/* --- MAIN CONTENT LAYOUT (SPACIOUS 2-COLUMN DESKTOP SPLIT AT LG >= 1024px) --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT PANEL: INTERACTIVE FORM CONTROLS                                    */}
          {/* ========================================================================= */}
          <div
            className={`lg:col-span-6 xl:col-span-5 space-y-6 sidebar-controls no-print ${
              activeTab === 'editor' ? 'block' : 'hidden lg:block'
            }`}
          >
            {/* Header Controls Toolbar */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-pink-600" />
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide uppercase flex items-center gap-1.5">
                  <span>Receipt Form Editor</span>
                  <DoodleSparkle className="w-3.5 h-3.5 text-pink-400 opacity-80" />
                </h2>
              </div>
              <button
                type="button"
                onClick={handleNewBlankReceipt}
                className="text-xs text-pink-700 hover:text-pink-900 font-semibold flex items-center gap-1 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                New Blank Receipt
              </button>
            </div>

            {/* Order Header Settings */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Receipt Number */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Receipt / Order Number
                    </label>
                    <button
                      type="button"
                      onClick={() => setOrderNumber(generateOrderNumber())}
                      className="text-[10px] text-pink-700 hover:underline font-semibold"
                    >
                      [Auto-Gen]
                    </button>
                  </div>
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-400 font-mono font-semibold text-slate-800"
                    placeholder="JD-2026-1001"
                  />
                </div>

                {/* Order Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Order Date
                  </label>
                  <input
                    type="date"
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-400 text-slate-800"
                  />
                </div>

                {/* Currency Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Currency Symbol
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 font-semibold text-slate-800"
                  >
                    <option value="FCFA">FCFA (CFA Franc - West Africa)</option>
                    <option value="Naira">Naira (₦ - Nigeria)</option>
                    <option value="Dollar">US Dollar ($ - USD)</option>
                    <option value="Euro">Euro (€ - EUR)</option>
                  </select>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 text-slate-800"
                  >
                    <option value="MoMo [Mobile Money]">MoMo [Mobile Money]</option>
                    <option value="Cash Payment">Cash Payment</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="PayPal">PayPal</option>
                  </select>
                </div>

                {/* Order Status: Paid vs Pending */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Payment Status
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setOrderStatus('Paid')}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all text-center flex items-center justify-center gap-2 ${
                        orderStatus === 'Paid'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-400 ring-2 ring-emerald-400/30'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <CheckCircle2 className={`w-4 h-4 ${orderStatus === 'Paid' ? 'text-emerald-600' : 'text-slate-400'}`} />
                      Paid (Shows Seal)
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderStatus('Pending')}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all text-center flex items-center justify-center gap-2 ${
                        orderStatus === 'Pending'
                          ? 'bg-amber-50 text-amber-900 border-amber-400 ring-2 ring-amber-400/30'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Clock className={`w-4 h-4 ${orderStatus === 'Pending' ? 'text-amber-600' : 'text-slate-400'}`} />
                      Pending (No Seal)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information Block */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <User className="w-4 h-4 text-pink-600" />
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide uppercase">
                  Customer Information
                </h2>
              </div>

              <div className="space-y-3">
                {/* Customer Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Customer Full Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-400 text-slate-800"
                    placeholder="Enter customer name..."
                  />
                </div>

                {/* Customer Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Customer Phone / WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-400 text-slate-800"
                    placeholder="e.g. +229 97 12 34 56"
                  />
                </div>

                {/* Shipping Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Shipping & Billing Address
                  </label>
                  <textarea
                    rows={2}
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-400 text-slate-800"
                    placeholder="Enter delivery address..."
                  />
                </div>
              </div>
            </div>

            {/* Purchased Items Table */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-pink-600" />
                  <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide uppercase">
                    Purchased Line Items
                  </h2>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {items.length} {items.length === 1 ? 'row' : 'rows'}
                </span>
              </div>

              {/* Line Items List */}
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 relative group hover:border-pink-200 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Item #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors"
                        title="Remove item row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-12 gap-2.5">
                      {/* Description */}
                      <div className="col-span-12 sm:col-span-6">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          placeholder="Product name / equipment description..."
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 text-slate-800"
                        />
                      </div>

                      {/* Quantity */}
                      <div className="col-span-4 sm:col-span-2">
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleItemChange(item.id, 'quantity', Math.max(1, parseInt(e.target.value) || 1))
                            }
                            className="w-full px-2 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 text-slate-800 text-center font-semibold"
                          />
                          <span className="text-[9px] text-slate-400 block text-center mt-0.5">Qty</span>
                        </div>
                      </div>

                      {/* Unit Price */}
                      <div className="col-span-8 sm:col-span-4">
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            value={item.unitPrice || ''}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                'unitPrice',
                                Math.max(0, parseFloat(e.target.value) || 0)
                              )
                            }
                            className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 text-slate-800 text-right font-mono"
                            placeholder="0"
                          />
                          <span className="text-[9px] text-slate-400 block text-right mt-0.5">
                            Price ({currency})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Calculated row summary */}
                    <div className="flex justify-end pt-1.5 border-t border-slate-200/60">
                      <span className="text-xs font-semibold text-slate-600">
                        Row Total: <span className="font-mono text-slate-900 font-bold">{formatCurrency(item.quantity * item.unitPrice, currency)}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Item Button */}
              <button
                type="button"
                onClick={handleAddItem}
                className="w-full py-2.5 border-2 border-dashed border-pink-200 hover:border-pink-400 bg-pink-50/50 hover:bg-pink-50 rounded-xl text-pink-700 text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Item Row
              </button>
            </div>

            {/* Financial Calculations & Adjustments */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Tag className="w-4 h-4 text-pink-600" />
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide uppercase">
                  Shipping, Taxes & Discounts
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* Shipping Fee */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider truncate">
                    Shipping ({currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={shippingFee || ''}
                    onChange={(e) => setShippingFee(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 text-slate-800 font-mono font-semibold"
                    placeholder="0"
                  />
                </div>

                {/* Tax Rate % */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider truncate">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={taxRate || ''}
                    onChange={(e) => setTaxRate(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 text-slate-800 font-mono font-semibold"
                    placeholder="0"
                  />
                </div>

                {/* Discount */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider truncate">
                      Discount
                    </label>
                    <button
                      type="button"
                      onClick={() => setDiscountType(discountType === 'fixed' ? 'percent' : 'fixed')}
                      className="text-[10px] text-pink-700 hover:underline font-bold shrink-0"
                    >
                      [{discountType === 'fixed' ? currency : '%'}]
                    </button>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={discount || ''}
                    onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 text-slate-800 font-mono font-semibold"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Notes & Terms */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-pink-600" />
                  <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide uppercase">
                    Notes & Terms
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-medium">Stamp Style:</span>
                  <select
                    value={stampStyle}
                    onChange={(e) => setStampStyle(e.target.value as any)}
                    className="text-xs border border-slate-300 rounded px-2 py-1 bg-white focus:outline-none"
                  >
                    <option value="classic">Classic Seal</option>
                    <option value="modern">Modern Badge</option>
                    <option value="minimal">Minimal Text</option>
                  </select>
                </div>
              </div>

              <div>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-400 text-slate-800"
                  placeholder="Thank you for shopping with Josella Dolls! ..."
                />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT PANEL: LIVE RECEIPT PREVIEW                                         */}
          {/* ========================================================================= */}
          <div
            className={`lg:col-span-6 space-y-4 ${
              activeTab === 'preview' ? 'block' : 'hidden lg:block'
            }`}
          >
            {/* Control banner for desktop & tablet actions */}
            <div className="no-print bg-slate-900 text-white p-3.5 rounded-2xl flex items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-pulse" />
                <span className="text-xs font-semibold tracking-wide flex items-center gap-1">
                  <span>Live Visual Receipt Preview</span>
                  <DoodleSparkle className="w-3 h-3 text-pink-300 opacity-80" />
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className="px-3.5 py-1.5 text-xs font-bold bg-pink-600 hover:bg-pink-700 active:bg-pink-800 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
                </button>
              </div>
            </div>

            {/* --- RECEIPT PAPER SHEET CONTAINER --- */}
            <div className="relative">
              <div
                id="receipt-paper"
                className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 lg:p-10 shadow-xl relative overflow-hidden transition-all text-slate-800"
              >
                {/* Minimal Floral Doodle Accent in Top Right Corner */}
                <DoodleCornerFloral className="absolute top-2 right-2 w-12 h-12 text-pink-300/40 pointer-events-none select-none no-print" />

                {/* Background Seal Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none text-center">
                  <span className="font-serif-luxury text-[110px] sm:text-[140px] font-bold text-pink-900 block leading-none">
                    JD
                  </span>
                  <span className="text-xl sm:text-2xl font-serif-display uppercase tracking-widest text-slate-900 font-bold block mt-2">
                    Josella Dolls
                  </span>
                </div>

                {/* --- 1. RECEIPT HEADER --- */}
                <div className="border-b-2 border-pink-100 pb-5 mb-5 relative">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    {/* Brand Header */}
                    <div>
                      <div className="relative inline-block">
                        <DoodleCrown className="w-6 h-4 text-pink-400/80 mb-0.5 block" />
                        <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
                          Josella Dolls
                        </h1>
                        <DoodleWavyLine className="w-24 h-2 text-pink-300/60 block mt-0.5" />
                      </div>
                      <p className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-pink-700 mt-1 leading-snug">
                        Luxury Beauty, Esthetic & Spa Product and Equipment suppliers
                      </p>
                      <div className="mt-2 text-[11px] text-slate-500 space-y-0.5">
                        <p className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-pink-400 shrink-0 inline" />
                          <span>Cotonou, Benin Republic</span>
                        </p>
                        <p className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-pink-400 shrink-0 inline" />
                          <span>WhatsApp: +229 90 08 34 61 | Call: +229 61 20 58 30</span>
                        </p>
                      </div>
                    </div>

                    {/* Receipt Meta & Badge */}
                    <div className="text-left sm:text-right space-y-1 shrink-0">
                      <div className="inline-flex items-center gap-1 bg-pink-50 border border-pink-200 px-2.5 py-0.5 rounded-full mb-1">
                        <DoodleSparkle className="w-2.5 h-2.5 text-pink-500" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-pink-900">
                          Official Customer Receipt
                        </span>
                      </div>
                      <p className="font-mono text-xs sm:text-sm font-bold text-slate-900">
                        {orderNumber || 'JD-2026-1001'}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Date: <span className="text-slate-800 font-semibold">{orderDate}</span>
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Payment: <span className="text-slate-800 font-semibold">{paymentMethod}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* --- 2. BILLED TO / CUSTOMER INFO BLOCK --- */}
                <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-3.5 mb-5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-pink-800 mb-1 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>Billed / Shipped To:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div>
                      <p className="font-bold text-slate-900 text-xs sm:text-sm">
                        {customerName || 'Valued Customer'}
                      </p>
                      <p className="text-slate-600 mt-0.5 font-medium flex items-center gap-1 text-[11px]">
                        <Phone className="w-3 h-3 text-slate-400 inline" />
                        <span>{customerPhone || 'N/A'}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px] font-medium">Delivery Address:</p>
                      <p className="text-slate-700 whitespace-pre-line font-medium leading-relaxed text-[11px]">
                        {customerAddress || 'Direct Pickup / Order Delivery'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* --- 3. ITEMIZED TABLE WITH SCROLL & MIN-WIDTH FOR LARGE FCFA PRICES --- */}
                <div className="mb-5 overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse min-w-[500px] sm:min-w-0">
                    <thead>
                      <tr className="bg-pink-100/70 border-b border-pink-200 text-pink-950 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Item Description</th>
                        <th className="py-2.5 px-3 text-center">Qty</th>
                        <th className="py-2.5 px-3 text-right whitespace-nowrap">Unit Price</th>
                        <th className="py-2.5 px-3 text-right whitespace-nowrap min-w-[120px]">Total ({currency})</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {items.map((item, index) => {
                        const lineTotal = item.quantity * item.unitPrice;
                        return (
                          <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-2.5 px-3 font-semibold text-slate-400 text-center w-7 text-[11px]">
                              {index + 1}
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-slate-900 max-w-[220px] sm:max-w-none break-words text-xs">
                              {item.description || 'Beauty / Esthetic Supply Item'}
                            </td>
                            <td className="py-2.5 px-3 text-center font-bold text-slate-800 text-xs">
                              {item.quantity}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-slate-600 text-xs whitespace-nowrap">
                              {formatCurrency(item.unitPrice, currency)}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 text-xs whitespace-nowrap min-w-[120px]">
                              {formatCurrency(lineTotal, currency)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* --- 4. TOTALS & STAMP ROW --- */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end mb-5 pt-1">
                  {/* Digital Stamp & Authorization Signature */}
                  <div className="md:col-span-5 space-y-3">
                    {/* Visual Status Stamp - Shown strictly when orderStatus is Paid */}
                    <div className="flex items-center gap-3">
                      {orderStatus === 'Paid' ? (
                        <>
                          {stampStyle === 'classic' && (
                            <div className="inline-flex flex-col items-center justify-center p-2.5 border-2 border-dashed border-emerald-600 text-emerald-700 bg-emerald-50/80 rounded-xl transform -rotate-3 select-none shadow-xs">
                              <span className="text-base sm:text-lg font-black uppercase tracking-widest leading-none">
                                ★ PAID ★
                              </span>
                              <span className="text-[9px] font-bold tracking-tight uppercase mt-0.5 text-emerald-800">
                                Josella Dolls Cotonou
                              </span>
                            </div>
                          )}

                          {stampStyle === 'modern' && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-100 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                              <ShieldCheck className="w-4 h-4 text-emerald-700" />
                              <span>Status: PAID</span>
                            </div>
                          )}

                          {stampStyle === 'minimal' && (
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
                              Payment Status: <span className="text-emerald-700 underline font-bold">PAID</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 font-semibold text-xs">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Payment Pending</span>
                        </div>
                      )}
                    </div>

                    {/* Authorized Signature Line with Minimal Doodle Flourish */}
                    <div className="pt-1">
                      <div className="w-36 border-b border-slate-300 pb-0.5">
                        <span className="font-serif-luxury italic text-base sm:text-lg text-pink-900 font-semibold block select-none">
                          Josella D.
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
                          Authorized Signature
                        </span>
                        <DoodleFlourish className="w-8 h-2 text-pink-300 opacity-60" />
                      </div>
                    </div>
                  </div>

                  {/* Totals Summary */}
                  <div className="md:col-span-7 space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-slate-100 text-slate-600 gap-2">
                      <span className="shrink-0">Subtotal:</span>
                      <span className="font-mono font-semibold text-slate-900 text-right min-w-0 truncate">
                        {formatCurrency(subtotal, currency)}
                      </span>
                    </div>

                    {shippingFee > 0 && (
                      <div className="flex justify-between items-center py-1 border-b border-slate-100 text-slate-600 gap-2">
                        <span className="shrink-0">Shipping & Handling:</span>
                        <span className="font-mono font-semibold text-slate-900 text-right min-w-0 truncate">
                          {formatCurrency(shippingFee, currency)}
                        </span>
                      </div>
                    )}

                    {discountAmount > 0 && (
                      <div className="flex justify-between items-center py-1 border-b border-slate-100 text-emerald-700 font-medium gap-2">
                        <span className="shrink-0">Discount ({discountType === 'percent' ? `${discount}%` : 'Fixed'}):</span>
                        <span className="font-mono font-bold text-right min-w-0 truncate">
                          -{formatCurrency(discountAmount, currency)}
                        </span>
                      </div>
                    )}

                    {taxAmount > 0 && (
                      <div className="flex justify-between items-center py-1 border-b border-slate-100 text-slate-600 gap-2">
                        <span className="shrink-0">Tax ({taxRate}%):</span>
                        <span className="font-mono font-semibold text-slate-900 text-right min-w-0 truncate">
                          {formatCurrency(taxAmount, currency)}
                        </span>
                      </div>
                    )}

                    {/* Highlighted Grand Total Box (Optimized for High Numbers in FCFA) */}
                    <div className="bg-pink-100/90 border border-pink-200/90 rounded-2xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 font-bold text-pink-950 shadow-2xs overflow-hidden">
                      <span className="text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                        <span>Grand Total:</span>
                        <DoodleSparkle className="w-3.5 h-3.5 text-pink-600 opacity-80" />
                      </span>
                      <span className="font-mono text-sm sm:text-base lg:text-base xl:text-lg font-bold text-pink-900 tracking-tight text-left sm:text-right shrink min-w-0 break-words">
                        {formatCurrency(grandTotal, currency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* --- 5. RECEIPT FOOTER --- */}
                <div className="border-t border-slate-200 pt-4 mt-3 text-center space-y-2">
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed italic max-w-lg mx-auto">
                    "{notes}"
                  </p>

                  <div className="text-center pt-3 border-t border-slate-100 space-y-1">
                    <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                      Josella Dolls · Cotonou, Benin Republic
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Luxury Beauty, Esthetic & Spa Product and Equipment suppliers
                    </p>
                    <p className="text-[9px] text-slate-400 font-semibold tracking-widest uppercase flex items-center justify-center gap-1.5">
                      <DoodleMiniHeart className="w-2.5 h-2.5 text-pink-400 fill-pink-100" />
                      <span>Thank You For Your Business</span>
                      <DoodleMiniHeart className="w-2.5 h-2.5 text-pink-400 fill-pink-100" />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- MOBILE & TABLET STICKY BOTTOM ACTION BAR (strictly < 1024px NO-PRINT) --- */}
      <div className="no-print fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 shadow-lg lg:hidden flex items-center justify-between gap-2">
        <button
          onClick={() => setHistoryOpen(true)}
          className="py-2.5 px-3 text-xs font-bold text-slate-800 bg-slate-100 active:bg-slate-200 border border-slate-300 rounded-xl flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 relative"
          title="View Saved Receipt History"
        >
          <History className="w-4 h-4 text-pink-600" />
          <span>History</span>
          {savedReceipts.length > 0 && (
            <span className="bg-pink-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {savedReceipts.length}
            </span>
          )}
        </button>

        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="flex-1 py-2.5 px-3 text-xs font-bold text-white bg-pink-700 active:bg-pink-800 rounded-xl shadow-xs flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileDown className="w-4 h-4" />
          <span>{isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}</span>
        </button>

        <button
          onClick={() => setShareModalOpen(true)}
          className="py-2.5 px-3 text-xs font-bold text-slate-900 bg-slate-100 active:bg-slate-200 border border-slate-300 rounded-xl flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
        >
          <Share2 className="w-4 h-4 text-slate-700" />
          <span>Share</span>
        </button>
      </div>

      {/* --- SEND / SHARE MODAL --- */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 no-print animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-pink-600" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Send PDF Receipt to Customer
                </h3>
              </div>
              <button
                onClick={() => setShareModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg px-2"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Choose your preferred channel to send or save the official PDF receipt for your customer.
            </p>

            <div className="space-y-2.5">
              {/* WhatsApp PDF Option */}
              <button
                onClick={handleSendWhatsAppPDF}
                className="w-full p-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100/80 transition-all flex items-center justify-between group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950">
                      Send via WhatsApp (PDF)
                    </h4>
                    <p className="text-[10px] text-emerald-700">
                      Downloads PDF & opens WhatsApp for {customerPhone || 'customer'}
                    </p>
                  </div>
                </div>
              </button>

              {/* Email PDF Option */}
              <button
                onClick={handleSendEmailPDF}
                className="w-full p-3 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100/80 transition-all flex items-center justify-between group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-blue-950">
                      Send via Email (PDF)
                    </h4>
                    <p className="text-[10px] text-blue-700">
                      Downloads PDF & opens email app pre-filled
                    </p>
                  </div>
                </div>
              </button>

              {/* Direct PDF Download */}
              <button
                onClick={async () => {
                  setShareModalOpen(false);
                  await handleDownloadPDF();
                }}
                disabled={isGeneratingPDF}
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all flex items-center justify-between group text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-white shrink-0">
                    <FileDown className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Download PDF File Directly
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Saves high-resolution {orderNumber}.pdf to device
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShareModalOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- HISTORY DRAWER --- */}
      {historyOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end no-print">
          <div className="bg-white max-w-md w-full h-full p-5 sm:p-6 shadow-2xl flex flex-col space-y-4 border-l border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-pink-600" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Saved Receipt History</h3>
              </div>
              <button
                onClick={() => setHistoryOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg px-2"
              >
                ✕
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchHistoryQuery}
                onChange={(e) => setSearchHistoryQuery(e.target.value)}
                placeholder="Search by order # or customer name..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <FileText className="w-10 h-10 mx-auto opacity-30 text-pink-500" />
                  <p className="text-xs font-medium">No saved receipts found in history.</p>
                  <p className="text-[11px]">Downloaded and shared receipts are automatically stored in history.</p>
                </div>
              ) : (
                filteredHistory.map((receipt) => (
                  <div
                    key={receipt.id}
                    onClick={() => handleLoadReceipt(receipt)}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-pink-300 hover:bg-pink-50/40 cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {receipt.orderNumber}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-900">
                          {receipt.currency}
                        </span>
                        <button
                          onClick={(e) => handleDeleteSavedReceipt(receipt.id, e)}
                          className="text-slate-400 hover:text-red-600 p-1"
                          title="Delete from history"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 flex justify-between items-center">
                      <span className="font-semibold text-slate-800 truncate max-w-[180px]">
                        {receipt.customerName}
                      </span>
                      <span className="font-mono font-bold text-slate-900">
                        {formatCurrency(receipt.grandTotal, receipt.currency)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-1.5">
                      <span>Date: {receipt.orderDate}</span>
                      <span>{receipt.items.length} line items</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setHistoryOpen(false)}
                className="w-full py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- FOOTER (NO PRINT) --- */}
      <footer className="no-print bg-white border-t border-slate-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-1.5">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-xs text-slate-800 font-semibold">
            <span className="font-serif-luxury font-bold text-slate-900 text-sm">Josella Dolls</span>
            <span>·</span>
            <span>Cotonou, Benin Republic</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Luxury Beauty, Esthetic & Spa Product and Equipment suppliers
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-slate-500 font-medium">
            <span>WhatsApp: +229 90 08 34 61</span>
            <span aria-hidden="true">·</span>
            <span>Call: +229 61 20 58 30</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
