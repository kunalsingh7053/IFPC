import PageWrapper from '../components/PageWrapper'

function Contact() {
  return (
    <PageWrapper>
      <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-bold text-white">Contact IFPC</h1>
        <p className="mt-2 text-slate-300">Have questions or partnership ideas? Reach out to us.</p>

        <form className="mt-5 space-y-4">
          <input className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-slate-100" placeholder="Your name" />
          <input className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-slate-100" placeholder="Your email" />
          <textarea className="min-h-28 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-slate-100" placeholder="Message" />
          <button className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-5 py-3 font-semibold text-white">
            Send Message
          </button>
        </form>
      </div>
    </PageWrapper>
  )
}

export default Contact
