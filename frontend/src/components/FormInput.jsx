function FormInput({ label, name, type = 'text', value, onChange, placeholder, required = false }) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-semibold tracking-wide text-slate-200/95">{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-white/15 bg-slate-950/45 px-4 py-3 text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-slate-900/65 focus:ring-2 focus:ring-emerald-400/35"
      />
    </label>
  )
}

export default FormInput
