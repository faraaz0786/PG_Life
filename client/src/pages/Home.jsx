import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const ROOMS = [
  {
    title: 'Single Bed • Non-AC',
    img: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1200&auto=format&fit=crop',
    q: 'single',
  },
  {
    title: 'Twin Sharing • 2 Bed',
    img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop',
    q: 'twin',
  },
  {
    title: 'Triple Sharing • Non-AC',
    img: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop',
    q: 'triple',
  },
  {
    title: 'Quad Sharing • AC',
    img: 'https://images.unsplash.com/photo-1505691723518-36a5ac3b2aa5?q=80&w=1200&auto=format&fit=crop',
    q: 'quad',
  },
]

const GALLERY = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop',
]

export default function Home() {
  const sendEnquiry = (e) => {
    e.preventDefault()
    toast.success('Thanks! We will contact you shortly. (Demo)')
    e.currentTarget.reset()
  }

  return (
    <div className="pb-10">
      {/* HERO */}
      <section className="relative overflow-hidden border-b">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1920&auto=format&fit=crop')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/50 to-transparent" />
        <div className="relative container-max section">
          <div className="max-w-2xl text-white space-y-5">
            <p className="text-sm tracking-wide text-white/80">Experience happiness with</p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Our PG Accommodations</h1>
            <p className="text-white/85 max-w-xl">
              Fully-furnished rooms, secure premises and modern amenities — find a place that feels like home.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link to="/search" className="btn btn-primary">Enquire Now</Link>
              <a href="#rooms" className="btn">Explore Rooms</a>
            </div>
          </div>
        </div>
      </section>

      {/* ROOMS */}
      <section id="rooms" className="container-max section space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold">Rooms</h2>
          <Link to="/search" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Browse all</Link>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {ROOMS.map(r => (
            <article key={r.title} className="card overflow-hidden group">
              <img
                src={r.img}
                alt={r.title}
                className="h-48 w-full object-cover transition group-hover:scale-[1.02]"
                loading="lazy"
                decoding="async"
              />
              <div className="p-4 flex items-center justify-between">
                <div className="font-semibold">{r.title}</div>
                <Link to={`/search?roomType=${encodeURIComponent(r.q)}`} className="btn">View</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="container-max section">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Services</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { t: 'Fully Furnished', d: 'Comfortable beds & storage, move-in ready.' },
            { t: 'Hot / Cold Shower', d: 'Temperature control as per your preference.' },
            { t: 'Terrace / Recreation', d: 'Relax on terraces & common lounges.' },
            { t: 'Wardrobe with Locker', d: 'Keep your belongings secure.' },
          ].map(s => (
            <div key={s.t} className="card p-6 text-center space-y-3">
              <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-600/10" />
              <div className="font-semibold">{s.t}</div>
              <p className="text-sm text-slate-600 dark:text-slate-300">{s.d}</p>
              <a href="#contact" className="btn w-full">Enquire Now</a>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="container-max section">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="card overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1505691723518-36a5ac3b2aa5?q=80&w=1600&auto=format&fit=crop"
              alt="Comfortable PG room"
              className="w-full h-80 object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold">About Us</h2>
            <p className="text-slate-600 dark:text-slate-300">
              We provide warm, friendly and affordable PG stays across major cities. Enjoy convenience with modern
              amenities — great locations, clean rooms and a community-first approach.
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              Whether you’re a student or a working professional, we make moving-in effortless so you can focus on what matters.
            </p>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="container-max section">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Gallery</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {GALLERY.map((src, i) => (
            <div key={i} className="card overflow-hidden">
              <img
                src={src}
                alt={`PG gallery ${i + 1}`}
                className="w-full h-56 md:h-72 object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="container-max section">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Contact Us</h2>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="card overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1505764706515-aa95265c5abc?q=80&w=1600&auto=format&fit=crop"
              alt="Map"
              className="w-full h-80 object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="space-y-5">
            <div className="card p-5 text-sm space-y-2">
              <div><span className="font-semibold">Address: </span>Palm Court, Malad West, Mumbai 400064</div>
              <div><span className="font-semibold">Email: </span>hello@pglife.example</div>
              <div><span className="font-semibold">Phone: </span>+91-88888 88888</div>
              <div><span className="font-semibold">Timing: </span>Mon – Sun: 10:00 AM – 07:00 PM</div>
            </div>
            <form onSubmit={sendEnquiry} className="card p-5 grid gap-3">
              <div className="grid md:grid-cols-2 gap-3">
                <input className="input" placeholder="Full Name" />
                <input className="input" placeholder="Mobile Number" />
              </div>
              <input className="input" placeholder="Email ID" type="email" />
              <textarea className="textarea min-h-[120px]" placeholder="Message" />
              <div className="flex justify-end">
                <button className="btn btn-primary">Send Enquiry</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
