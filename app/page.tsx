'use client';

import { useState } from 'react';

export default function FreeWeatherWrapper() {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [wrapperOutput, setWrapperOutput] = useState('');
  const [step, setStep] = useState(0);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setWrapperOutput('');
    setStep(1); 

    try {
      // Step 1: Get Latitude/Longitude coordinates (Free open API)
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
      );
      const geoData = await geoRes.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        setWrapperOutput('Destination city not found. Please try another location.');
        setStep(0);
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];
      setStep(2); 

      // Step 2: Fetch raw current weather metrics (Free open API)
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,weather_code&temperature_unit=fahrenheit`
      );
      const rawData = await weatherRes.json();
      const temp = Math.round(rawData.current.temperature_2m);
      const isRaining = rawData.current.precipitation > 0;

      // Step 3: The "Zero-Cost" Wrapper Transformation Layer
      let recommendation = '';
      if (temp >= 80) {
        recommendation = `It's a hot ${temp}°F in ${name}. Wear light, breathable clothing and stay hydrated!`;
      } else if (temp >= 65 && temp < 80) {
        recommendation = `It's a gorgeous ${temp}°F in ${name}. Perfect patio weather—no jacket needed right now.`;
      } else if (temp >= 45 && temp < 65) {
        recommendation = `It's a crisp ${temp}°F in ${name}. You'll definitely want to grab a light jacket or sweater before heading out.`;
      } else {
        recommendation = `It's freezing (${temp}°F) in ${name}! Bundle up with a heavy coat, scarf, and gloves.`;
      }

      if (isRaining) {
        recommendation += " Also, it's currently raining, so grab an umbrella or raincoat!";
      }

      setTimeout(() => {
        setWrapperOutput(recommendation);
        setStep(3); 
        setLoading(false);
      }, 800);

    } catch (err) {
      setWrapperOutput('Could not fetch data. Please try again.');
      setStep(0);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto space-y-12">
        
        <header className="border-b border-slate-800 pb-6 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-sky-400">The AI Wrapper Blueprint Demo</h1>
          <p className="text-slate-400 mt-2">A completely free, keyless mockup showing how a wrapper UI abstracts complex data.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN: The Interface */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="bg-sky-500/10 text-sky-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full w-fit mb-4">
                The App Face
              </div>
              <h2 className="text-xl font-bold mb-4">Smart Forecast Concierge</h2>
              
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Enter Destination City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g., Chicago, London, Tokyo"
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-sky-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-sky-500 hover:bg-sky-400 text-slate-900 font-bold py-3 px-4 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Processing Pipeline...' : 'Get Smart Forecast'}
                </button>
              </form>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-700 min-h-[120px]">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-500 block mb-2">Output Dashboard</span>
              {wrapperOutput ? (
                <p className="text-lg text-slate-200 italic font-medium leading-relaxed">
                  "{wrapperOutput}"
                </p>
              ) : (
                <p className="text-slate-500 italic">Enter a location above to see the wrapper translate raw data.</p>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: The Interactive Architecture Lesson */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col space-y-6">
            <div>
              <div className="bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full w-fit mb-4">
                Under The Hood Explainer
              </div>
              <h2 className="text-xl font-bold">How This App Thinks</h2>
            </div>

            <div className="space-y-4">
              <div className={`p-4 rounded-lg border transition ${step >= 1 ? 'bg-slate-900 border-sky-500/50' : 'bg-slate-900/40 border-slate-800 text-slate-500'}`}>
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <span className={`w-5 h-5 flex items-center justify-center rounded-full text-xs ${step >= 1 ? 'bg-sky-500 text-slate-900 font-bold' : 'bg-slate-800'}`}>1</span>
                  Capture Variable Input
                </h3>
                <p className="text-xs mt-1 text-slate-400">
                  The user inputs <span className="text-sky-400 font-semibold">"{city || 'a city'}"</span>. The wrapper removes the user's friction—they don't need to know formulas or prompt templates.
                </p>
              </div>

              <div className={`p-4 rounded-lg border transition ${step >= 2 ? 'bg-slate-900 border-indigo-500/50' : 'bg-slate-900/40 border-slate-800 text-slate-500'}`}>
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <span className={`w-5 h-5 flex items-center justify-center rounded-full text-xs ${step >= 2 ? 'bg-indigo-500 text-slate-100 font-bold' : 'bg-slate-800'}`}>2</span>
                  Wholesale Data Gathering
                </h3>
                <p className="text-xs mt-1 text-slate-400">
                  The app queries the open geocoding and meteorological database. It gathers cold numbers that humans find tedious to interpret.
                </p>
              </div>

              <div className={`p-4 rounded-lg border transition ${step >= 3 ? 'bg-slate-900 border-emerald-500/50' : 'bg-slate-900/40 border-slate-800 text-slate-500'}`}>
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <span className={`w-5 h-5 flex items-center justify-center rounded-full text-xs ${step >= 3 ? 'bg-emerald-500 text-slate-900 font-bold' : 'bg-slate-800'}`}>3</span>
                  The Transformation Layer
                </h3>
                <p className="text-xs mt-1 text-slate-400">
                  The wrapper logic reads those data metrics and processes them into conversational, contextual instructions. Retail value is created out of wholesale data.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* 🌟 Footer Signature */}
        <footer className="text-center text-xs text-slate-500 pt-6 border-t border-slate-800/60">
          Designed by <span className="text-sky-400/80 font-medium">Betty Harris</span> with AI
        </footer>

      </div>
    </div>
  );
}