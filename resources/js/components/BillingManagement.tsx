import { useState, useEffect } from 'react'
import { Search, Receipt, Edit3, Trash2, X, ArrowLeft, Plus, User, Calendar, CreditCard, FileText, Calculator, Percent, Minus, GripVertical, Printer } from "lucide-react"

interface Bill {
  id: number
  patient_id: number
  invoice_number: string
  bill_date: string
  total_amount: string
  paid_amount: string
  payment_method: string | null
  payment_status: string
  description: string | null
  items: string | null
  created_at: string
  patient: { id: number; first_name: string; last_name: string }
}

const emptyForm = {
  patient_id: '', invoice_number: '', bill_date: '', total_amount: '0',
  paid_amount: '0', payment_method: '', payment_status: 'pending',
  description: '', items: '',
}

const paymentMethods = ['cash', 'card', 'insurance', 'online', 'other']
const paymentStatuses = ['paid', 'partial', 'pending', 'cancelled', 'refunded']

const methodLabels: Record<string, string> = {
  cash: 'नगद', card: 'कार्ड', insurance: 'बीमा', online: 'अनलाइन', other: 'अन्य'
}

const statusLabels: Record<string, string> = {
  paid: 'भुक्तानी भयो', partial: 'आंशिक', pending: 'विचाराधीन', cancelled: 'रद्द', refunded: 'फिर्ता'
}

function BillForm({ form, setForm, saving, onCancel, onSubmit, title, submitLabel, patients }: {
  form: typeof emptyForm
  setForm: (f: typeof emptyForm) => void
  saving: boolean
  onCancel: () => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  title: string
  submitLabel: string
  patients: { id: number; first_name: string; last_name: string }[]
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">कृपया बिल विवरण भर्नुहोस्।</p>
      </div>
      <form onSubmit={onSubmit} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">बिरामी <span className="text-rose-500">*</span></label>
            <select value={form.patient_id} onChange={(e) => setForm({ ...form, patient_id: e.target.value })} required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
              <option value="">बिरामी चयन गर्नुहोस्...</option>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">इनभ्वाइस नम्बर <span className="text-rose-500">*</span></label>
            <input value={form.invoice_number} onChange={(e) => setForm({ ...form, invoice_number: e.target.value })} required placeholder="जस्तै INV-001"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">बिल मिति <span className="text-rose-500">*</span></label>
            <input type="date" value={form.bill_date} onChange={(e) => setForm({ ...form, bill_date: e.target.value })} required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">जम्मा रकम (रु.) <span className="text-rose-500">*</span></label>
            <input type="number" step="0.01" min="0" value={form.total_amount} onChange={(e) => setForm({ ...form, total_amount: e.target.value })} required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">भुक्तानी रकम (रु.) <span className="text-rose-500">*</span></label>
            <input type="number" step="0.01" min="0" value={form.paid_amount} onChange={(e) => setForm({ ...form, paid_amount: e.target.value })} required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">भुक्तानी विधि</label>
            <select value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
              <option value="">-- चयन गर्नुहोस् --</option>
              {paymentMethods.map((m) => <option key={m} value={m}>{methodLabels[m]}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">भुक्तानी स्थिति</label>
            <select value={form.payment_status} onChange={(e) => setForm({ ...form, payment_status: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
              {paymentStatuses.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">विवरण</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="बिल विवरण..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">लाइन आइटमहरू</label>
            <textarea value={form.items} onChange={(e) => setForm({ ...form, items: e.target.value })} rows={3} placeholder='जस्तै: परामर्श: रु. ५०, ल्याब: रु. ३०, फार्मेसी: रु. २५' 
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6 dark:border-gray-800">
          <button type="button" onClick={onCancel}
            className="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600">
            रद्द गर्नुहोस्
          </button>
          <button type="submit" disabled={saving}
            className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-600">
            {saving ? 'सुरक्षित गर्दै...' : submitLabel}
          </button>
        </div>
      </form>
    </div>
  )
}

interface CalcItem {
  id: number
  description: string
  qty: number
  unitPrice: number
}

const emptyCalcItem = (id: number): CalcItem => ({ id, description: '', qty: 1, unitPrice: 0 })

export default function BillingManagement() {
  const [bills, setBills] = useState<Bill[]>([])
  const [patients, setPatients] = useState<{ id: number; first_name: string; last_name: string }[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Bill | null>(null)
  const [editing, setEditing] = useState<Bill | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const [calcItems, setCalcItems] = useState<CalcItem[]>([emptyCalcItem(1)])
  const [calcTaxPct, setCalcTaxPct] = useState(0)
  const [calcDiscount, setCalcDiscount] = useState(0)
  let calcIdCounter = 1
  
  const C = (n: number | string) => 'रु. ' + Number(n).toFixed(2)

  useEffect(() => { fetchBills(); fetchPatients() }, [])

  async function fetchBills() {
    try { const r = await fetch('/api/bills'); const d = await r.json(); setBills(d.bills ?? []) } catch { /* ignore */ }
  }

  async function fetchPatients() {
    try { const r = await fetch('/api/patients'); const d = await r.json(); setPatients(d.patients ?? []) } catch { /* ignore */ }
  }

  function openEdit(b: Bill) {
    setForm({
      patient_id: b.patient_id.toString(), invoice_number: b.invoice_number, bill_date: b.bill_date,
      total_amount: b.total_amount, paid_amount: b.paid_amount,
      payment_method: b.payment_method || '', payment_status: b.payment_status,
      description: b.description || '', items: b.items || '',
    })
    setEditing(b)
  }

  function openAddForm() { setForm(emptyForm); setShowAddForm(true); setSelected(null) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    try {
      const body = { ...form, patient_id: Number(form.patient_id), total_amount: Number(form.total_amount), paid_amount: Number(form.paid_amount) }
      const res = await fetch(`/api/bills/${editing!.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) { setEditing(null); await fetchBills() }
      else { const d = await res.json(); alert(Object.values(d.errors || { message: d.message || 'Error' }).flat().join('\n')) }
    } catch { alert('Update failed') }
    finally { setSaving(false) }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    try {
      const body = { ...form, patient_id: Number(form.patient_id), total_amount: Number(form.total_amount), paid_amount: Number(form.paid_amount) }
      const res = await fetch('/api/bills', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) { setShowAddForm(false); setForm(emptyForm); await fetchBills() }
      else { const d = await res.json(); alert(Object.values(d.errors || { message: d.message || 'Error' }).flat().join('\n')) }
    } catch { alert('Add failed') }
    finally { setSaving(false) }
  }

  async function handleDelete(id: number) {
    if (!confirm('के यो बिल मेटाउने?') ) return
    try {
      const res = await fetch(`/api/bills/${id}`, { method: 'DELETE' })
      if (res.ok) { if (selected?.id === id) setSelected(null); await fetchBills() }
    } catch { alert('मेटाउन असफल') }
  }

  const filtered = bills.filter((b) => {
    const q = search.toLowerCase()
    return b.invoice_number.toLowerCase().includes(q) || (b.patient.first_name + ' ' + b.patient.last_name).toLowerCase().includes(q) || (b.payment_status).toLowerCase().includes(q)
  })

  const totalRevenue = bills.reduce((sum, b) => sum + Number(b.total_amount), 0)
  const totalPaid = bills.reduce((sum, b) => sum + Number(b.paid_amount), 0)
  const totalDue = totalRevenue - totalPaid

  const paymentStatusColors: Record<string, { bg: string; dot: string }> = {
    paid: { bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', dot: 'bg-emerald-500' },
    partial: { bg: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', dot: 'bg-amber-500' },
    pending: { bg: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', dot: 'bg-blue-500' },
    cancelled: { bg: 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400', dot: 'bg-gray-400' },
    refunded: { bg: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400', dot: 'bg-red-500' },
  }

  function printInvoice(b: Bill) {
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.top = '-9999px'
    iframe.style.left = '-9999px'
    iframe.style.width = '800px'
    iframe.style.height = '600px'
    document.body.appendChild(iframe)

    const items = b.items ? b.items.split('\n').filter(l => l.trim()).map(l => '<tr><td class="py-2 px-4 border-b border-gray-200">' + l + '</td><td class="py-2 px-4 border-b border-gray-200 text-right"></td><td class="py-2 px-4 border-b border-gray-200 text-right"></td><td class="py-2 px-4 border-b border-gray-200 text-right"></td></tr>').join('') : ''
    const billDate = new Date(b.bill_date).toLocaleDateString('ne-NP', { year: 'numeric', month: 'long', day: 'numeric' })
    const statusClass = 'status-' + b.payment_status
    const pm = methodLabels[b.payment_method || ''] || '\u2014'

    iframe.contentDocument?.write(`
      <html>
      <head>
        <title>बिल - ${b.invoice_number}</title>
        <style>
          @page { margin: 15mm; }
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; margin: 0; padding: 20px; }
          .invoice-box { max-width: 800px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 40px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #1a1a2e; padding-bottom: 20px; margin-bottom: 20px; }
          .hospital-name { font-size: 24px; font-weight: 800; color: #1a1a2e; letter-spacing: -0.5px; }
          .hospital-sub { font-size: 11px; color: #64748b; margin-top: 2px; }
          .invoice-title { font-size: 28px; font-weight: 700; color: #1a1a2e; }
          .invoice-meta { margin: 20px 0; display: flex; justify-content: space-between; }
          .meta-left p, .meta-right p { margin: 4px 0; font-size: 13px; color: #475569; }
          .meta-label { font-weight: 600; color: #1e293b; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background: #f8fafc; text-align: left; padding: 10px 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b; border-bottom: 2px solid #e2e8f0; }
          td { padding: 10px 12px; font-size: 14px; border-bottom: 1px solid #f1f5f9; }
          .total-table { margin-top: 20px; }
          .total-table td { border: none; padding: 6px 12px; font-size: 14px; }
          .total-table .grand-total td { font-size: 18px; font-weight: 700; border-top: 2px solid #1a1a2e; padding-top: 10px; }
          .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: capitalize; }
          .status-paid { background: #dcfce7; color: #166534; }
          .status-partial { background: #fef3c7; color: #92400e; }
          .status-pending { background: #dbeafe; color: #1e40af; }
          .status-cancelled { background: #f1f5f9; color: #64748b; }
          .status-refunded { background: #fee2e2; color: #991b1b; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; }
          @media print { body { padding: 0; } .invoice-box { border: none; box-shadow: none; } }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="header">
            <div>
              <div class="hospital-name">सिटी अस्पताल</div>
              <div class="hospital-sub">१२३ स्वास्थ्य सेवा एभिन्यु, मेडिकल डिस्ट्रिक्ट</div>
              <div class="hospital-sub">फोन: (५५५) १२३-४५६७ | इमेल: info@cityhospital.com</div>
            </div>
            <div class="invoice-title">बिल</div>
          </div>
          <div class="invoice-meta">
            <div class="meta-left">
              <p><span class="meta-label">इनभ्वाइस नं.:</span> ${b.invoice_number}</p>
              <p><span class="meta-label">मिति:</span> ${billDate}</p>
              <p><span class="meta-label">स्थिति:</span> <span class="status-badge ${statusClass}">${statusLabels[b.payment_status]}</span></p>
            </div>
            <div class="meta-right">
              <p><span class="meta-label">बिरामी:</span> ${b.patient.first_name} ${b.patient.last_name}</p>
              <p><span class="meta-label">भुक्तानी विधि:</span> ${pm}</p>
            </div>
          </div>
          <table>
            <thead><tr><th>विवरण</th><th class="text-right">मूल्य</th></tr></thead>
            <tbody>${items || '<tr><td colspan="2" class="text-center" style="color:#94a3b8;padding:20px;">कुनै लाइन आइटम छैन</td></tr>'}</tbody>
          </table>
          <table class="total-table">
            <tr><td style="text-align:right;width:80%"><span class="meta-label">जम्मा रकम:</span></td><td style="text-align:right;width:20%;font-weight:600">${C(b.total_amount)}</td></tr>
            <tr><td style="text-align:right"><span class="meta-label">भुक्तानी रकम:</span></td><td style="text-align:right;color:#059669;font-weight:600">${C(b.paid_amount)}</td></tr>
            <tr class="grand-total"><td style="text-align:right"><span class="meta-label">बाँकी रकम:</span></td><td style="text-align:right;color:#dc2626;font-weight:700">${C(Number(b.total_amount) - Number(b.paid_amount))}</td></tr>
          </table>
          ${b.description ? '<div style="margin-top:20px;padding-top:16px;border-top:1px solid #e2e8f0"><p style="font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">नोटहरू</p><p style="font-size:13px;color:#475569;margin-top:4px;">' + b.description + '</p></div>' : ''}
          <div class="footer"><p>भ्रमणको लागि धन्यवाद। यो कम्प्युटर-उत्पन्न बिल हो।</p><p>सिटी अस्पताल &bull; www.cityhospital.com</p></div>
        </div>
      </body>
      </html>
    `)
    iframe.contentDocument?.close()

    setTimeout(() => {
      iframe.contentWindow?.print()
      setTimeout(() => document.body.removeChild(iframe), 500)
    }, 250)
  }

  function DetailView(b: Bill) {
    return (
      <div className="space-y-6">
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <ArrowLeft className="h-4 w-4" /> सबै बिलहरूमा फर्कनुहोस्
        </button>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-xl font-bold text-blue-700 dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-400">
                  <Receipt className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{b.invoice_number}</h1>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${paymentStatusColors[b.payment_status]?.bg || 'bg-gray-50 text-gray-600'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${paymentStatusColors[b.payment_status]?.dot || 'bg-gray-400'}`} />
                      {statusLabels[b.payment_status]}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => printInvoice(b)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-blue-400" title="प्रिन्ट">
                  <Printer className="h-4 w-4" />
                </button>
                <button onClick={() => openEdit(b)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-amber-600 dark:hover:bg-gray-800 dark:hover:text-amber-400" title="सम्पादन">
                  <Edit3 className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(b.id)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800 dark:hover:text-red-400" title="मेटाउन">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <User className="h-3.5 w-3.5" /> बिरामी
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{b.patient.first_name} {b.patient.last_name}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3.5 w-3.5" /> बिल मिति
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{new Date(b.bill_date).toLocaleDateString()}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <CreditCard className="h-3.5 w-3.5" /> भुक्तानी विधि
                </div>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{methodLabels[b.payment_method || ''] || '\u2014'}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <FileText className="h-3.5 w-3.5" /> जम्मा रकम
                </div>
                <p className="mt-1 text-sm font-bold text-gray-900 dark:text-white">{C(b.total_amount)}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <FileText className="h-3.5 w-3.5" /> भुक्तानी रकम
                </div>
                <p className="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">{C(b.paid_amount)}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <FileText className="h-3.5 w-3.5" /> बाँकी रकम
                </div>
                <p className="mt-1 text-sm font-bold text-rose-600 dark:text-rose-400">{C(Number(b.total_amount) - Number(b.paid_amount))}</p>
              </div>
            </div>

            {b.description && (
              <div className="mt-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">विवरण</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{b.description}</p>
              </div>
            )}

            {b.items && (
              <div className="mt-4">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">लाइन आइटमहरू</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{b.items}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  function ListView() {
    if (filtered.length === 0) {
      return (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-800">
            <Receipt className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">कुनै बिल फेला परेन</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">नयाँ बिल सिर्जना गर्न "बिल सिर्जना गर्नुहोस्" मा क्लिक गर्नुहोस्।</p>
        </div>
      )
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((b) => (
          <div key={b.id} className="group relative rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg hover:border-blue-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-800">
            <button onClick={() => setSelected(b)} className="w-full p-5 text-left">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-400 dark:group-hover:from-blue-900/50 dark:group-hover:to-indigo-900/50">
                <Receipt className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">{b.invoice_number}</h4>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{b.patient.first_name} {b.patient.last_name}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{C(b.total_amount)} | {C(b.paid_amount)} भुक्तानी</p>
              <span className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${paymentStatusColors[b.payment_status]?.bg || 'bg-gray-50 text-gray-600'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${paymentStatusColors[b.payment_status]?.dot || 'bg-gray-400'}`} />
                {statusLabels[b.payment_status]}
              </span>
            </button>
            <div className="absolute right-3 top-3 hidden gap-1 group-hover:flex">
              <button onClick={(e) => { e.stopPropagation(); printInvoice(b) }} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400" title="प्रिन्ट">
                <Printer className="h-3.5 w-3.5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); openEdit(b) }} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-amber-600 dark:hover:bg-gray-700 dark:hover:text-amber-400" title="सम्पादन">
                <Edit3 className="h-3.5 w-3.5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); handleDelete(b.id) }} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-700 dark:hover:text-red-400" title="मेटाउन">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  function CalculatorView() {
    const subtotal = calcItems.reduce((s, i) => s + i.qty * i.unitPrice, 0)
    const taxAmount = subtotal * (calcTaxPct / 100)
    const grandTotal = subtotal + taxAmount - calcDiscount

    function addRow() { calcIdCounter++; setCalcItems([...calcItems, emptyCalcItem(calcIdCounter)]) }
    function removeRow(id: number) { if (calcItems.length > 1) setCalcItems(calcItems.filter((i) => i.id !== id)) }
    function updateRow(id: number, field: keyof CalcItem, val: string | number) {
      setCalcItems(calcItems.map((i) => (i.id === id ? { ...i, [field]: typeof val === 'string' && (field === 'qty' || field === 'unitPrice') ? Number(val) || 0 : val } : i)))
    }

    function createFromCalc() {
      const lines = calcItems.map((i) => `${i.description} x ${i.qty} @ रु. ${i.unitPrice.toFixed(2)} = रु. ${(i.qty * i.unitPrice).toFixed(2)}`).join('\n')
      const taxLine = calcTaxPct > 0 ? `\nकर (${calcTaxPct}%): रु. ${taxAmount.toFixed(2)}` : ''
      const discLine = calcDiscount > 0 ? `\nछुट: -रु. ${calcDiscount.toFixed(2)}` : ''
      const desc = `क्याल्कुलेटरबाट उत्पन्न\n${lines}${taxLine}${discLine}\nजम्मा: रु. ${grandTotal.toFixed(2)}`
      setForm({ ...emptyForm, total_amount: grandTotal.toFixed(2), paid_amount: grandTotal.toFixed(2), description: desc, items: lines })
      setShowCalculator(false)
      setShowAddForm(true)
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">बिल क्याल्कुलेटर</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">जम्मा बिल रकम गणना गर्न लाइन आइटमहरू थप्नुहोस्।</p>
          </div>
          <button onClick={() => setShowCalculator(false)} className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
            <ArrowLeft className="h-4 w-4" /> फर्कनुहोस्
          </button>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="py-2 pr-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 w-8"></th>
                  <th className="py-2 px-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">विवरण</th>
                  <th className="py-2 px-2 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 w-20">मात्रा</th>
                  <th className="py-2 px-2 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 w-28">एकाइ मूल्य</th>
                  <th className="py-2 pl-2 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 w-28">जम्मा</th>
                  <th className="py-2 pl-2 text-right w-10"></th>
                </tr>
              </thead>
              <tbody>
                {calcItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 dark:border-gray-800/50">
                    <td className="py-2 pr-2 text-gray-300"><GripVertical className="h-4 w-4" /></td>
                    <td className="py-2 px-2">
                      <input value={item.description} onChange={(e) => updateRow(item.id, 'description', e.target.value)} placeholder="वस्तुको नाम..."
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-sm text-gray-900 outline-none focus:border-amber-500 focus:outline-amber-500/25 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
                    </td>
                    <td className="py-2 px-2">
                      <input type="number" min="1" value={item.qty} onChange={(e) => updateRow(item.id, 'qty', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-right text-sm text-gray-900 outline-none focus:border-amber-500 focus:outline-amber-500/25 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
                    </td>
                    <td className="py-2 px-2">
                      <input type="number" step="0.01" min="0" value={item.unitPrice || ''} onChange={(e) => updateRow(item.id, 'unitPrice', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-right text-sm text-gray-900 outline-none focus:border-amber-500 focus:outline-amber-500/25 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
                    </td>
                    <td className="py-2 px-2 text-right text-sm font-medium text-gray-900 dark:text-white">{C(item.qty * item.unitPrice)}</td>
                    <td className="py-2 pl-2 text-right">
                      {calcItems.length > 1 && (
                        <button onClick={() => removeRow(item.id)} className="rounded-lg p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30"><X className="h-4 w-4" /></button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button onClick={addRow} className="mt-3 flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300">
            <Plus className="h-4 w-4" /> आइटम थप्नुहोस्
          </button>

          <div className="mt-6 border-t border-gray-100 pt-4 dark:border-gray-800">
            <div className="ml-auto space-y-2 sm:w-72">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><Percent className="h-4 w-4" /> कर (%)</label>
                <input type="number" min="0" max="100" step="0.1" value={calcTaxPct} onChange={(e) => setCalcTaxPct(Number(e.target.value) || 0)}
                  className="w-24 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-right text-sm text-gray-900 outline-none focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><Minus className="h-4 w-4" /> छुट (रु.)</label>
                <input type="number" min="0" step="0.01" value={calcDiscount} onChange={(e) => setCalcDiscount(Number(e.target.value) || 0)}
                  className="w-24 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-right text-sm text-gray-900 outline-none focus:border-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100" />
              </div>
              <div className="border-t border-gray-100 pt-2 dark:border-gray-800">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>उप-जम्मा</span>
                  <span>{C(subtotal)}</span>
                </div>
                {calcTaxPct > 0 && (
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>कर ({calcTaxPct}%)</span>
                    <span>{C(taxAmount)}</span>
                  </div>
                )}
                {calcDiscount > 0 && (
                  <div className="flex items-center justify-between text-sm text-rose-500">
                    <span>छुट</span>
                    <span>-{C(calcDiscount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-lg font-bold text-gray-900 dark:text-white mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>जम्मा</span>
                  <span>{C(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-6 dark:border-gray-800">
            <button onClick={() => setShowCalculator(false)} className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">रद्द गर्नुहोस्</button>
            <button onClick={createFromCalc} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
              <Receipt className="h-4 w-4" /> क्याल्कुलेटरबाट बिल सिर्जना गर्नुहोस्
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (showCalculator) {
    return <CalculatorView />
  }

  if (showAddForm) {
    return (
      <BillForm
        form={form} setForm={setForm} saving={saving} patients={patients}
        onCancel={() => setShowAddForm(false)} onSubmit={handleAdd}
        title="नयाँ बिल सिर्जना गर्नुहोस्" submitLabel="बिल सिर्जना गर्नुहोस्"
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">बिलिङ र वित्त</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{bills.length} बिलहरू</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowCalculator(true)} className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 shadow-sm hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/30">
            <Calculator className="h-4 w-4" /> क्याल्कुलेटर
          </button>
          <button onClick={openAddForm} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
            <Plus className="h-4 w-4" /> बिल सिर्जना गर्नुहोस्
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">कुल आम्दानी</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{C(totalRevenue)}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">कुल सङ्कलन</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-300">{C(totalPaid)}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-medium text-rose-600 dark:text-rose-400">कुल बाँकी</p>
          <p className="mt-1 text-2xl font-bold text-rose-700 dark:text-rose-300">{C(totalDue)}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400">विचाराधीन बिल</p>
          <p className="mt-1 text-2xl font-bold text-blue-700 dark:text-blue-300">{bills.filter((b) => b.payment_status === 'pending').length}</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
        <input type="text" placeholder="इनभ्वाइस नम्बर, बिरामीको नाम वा स्थिति अनुसार खोज्नुहोस्..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:outline-2 focus:outline-offset-0 focus:outline-amber-500/25 focus:border-amber-500 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-amber-500 dark:focus:outline-amber-500/25"
        />
      </div>

      {selected ? <DetailView {...selected} /> : <ListView />}

      {editing && (
        <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/30 backdrop-blur-sm py-10">
          <div className="relative w-full max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">बिल सम्पादन गर्नुहोस्</h2>
              <button onClick={() => setEditing(null)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-5 w-5" /></button>
            </div>
            <BillForm
              form={form} setForm={setForm} saving={saving} patients={patients}
              onCancel={() => setEditing(null)} onSubmit={handleSave}
              title="बिल सम्पादन गर्नुहोस्" submitLabel="बिल अद्यावधिक गर्नुहोस्"
            />
          </div>
        </div>
      )}
    </div>
  )
}
