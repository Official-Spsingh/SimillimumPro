
import React, { useState } from 'react';
import { 
  PlusIcon, 
  SearchIcon, 
  Trash2Icon, 
  StethoscopeIcon, 
  ActivityIcon, 
  BrainCircuitIcon,
  WindIcon,
  ShieldCheckIcon,
  Loader2Icon,
  ChevronRightIcon,
  BookOpenIcon,
  GridIcon,
  InfoIcon,
  ClockIcon,
  MapPinIcon,
  SparklesIcon
} from 'lucide-react';
import { Symptom, AnalysisResult } from './types';
import { analyzeSymptoms } from './services/geminiService';

const GradeDisplay = ({ grade }: { grade: number }) => {
  if (grade === 3) return <span className="font-black text-indigo-800 underline decoration-2">3</span>;
  if (grade === 2) return <span className="font-bold italic text-indigo-600">2</span>;
  return <span className="text-indigo-400">1</span>;
};

export default function App() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [formData, setFormData] = useState({
    location: '',
    sensation: '',
    timing: '',
    category: 'Physical' as Symptom['category']
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addSymptom = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!formData.sensation.trim() && !formData.location.trim()) return;
    
    const newSymptom: Symptom = {
      id: Date.now().toString(),
      category: formData.category,
      location: formData.location.trim() || 'General',
      sensation: formData.sensation.trim() || 'Unspecified',
      timing: formData.timing.trim() || 'Unspecified'
    };
    
    setSymptoms([...symptoms, newSymptom]);
    setFormData({ ...formData, location: '', sensation: '', timing: '' });
    setError(null);
  };

  const removeSymptom = (id: string) => {
    setSymptoms(symptoms.filter(s => s.id !== id));
  };

  const handleAnalysis = async () => {
    if (symptoms.length === 0) {
      setError("Please add at least one complete symptom.");
      return;
    }
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeSymptoms(symptoms);
      setAnalysisResult(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getCategoryIcon = (category: Symptom['category']) => {
    switch (category) {
      case 'Mental': return <BrainCircuitIcon className="w-4 h-4 text-purple-500" />;
      case 'Physical': return <StethoscopeIcon className="w-4 h-4 text-blue-500" />;
      case 'General': return <ActivityIcon className="w-4 h-4 text-green-500" />;
      case 'Modality': return <WindIcon className="w-4 h-4 text-orange-500" />;
      case 'Sensation': return <SearchIcon className="w-4 h-4 text-pink-500" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Header */}
      <nav className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-100">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900">Simillimum<span className="text-indigo-600">Pro</span></span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Advanced Homeopathic HDSS</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
              Expert Module
            </span>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Input Panel */}
          <div className="lg:col-span-5 space-y-6">
            <section className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 overflow-hidden">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <ActivityIcon className="w-4 h-4 text-indigo-500" />
                Case Recording
              </h2>

              <form onSubmit={addSymptom} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">1. Category</label>
                  <div className="flex flex-wrap gap-2">
                    {['Mental', 'Physical', 'General', 'Modality', 'Sensation'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat as Symptom['category'] })}
                        className={`px-3 py-2 rounded-xl text-[11px] font-bold transition-all border ${
                          formData.category === cat 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                            : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <MapPinIcon className="w-3 h-3 text-indigo-400" /> Location (Area/Side)
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Left side of Face, Upper abdomen..."
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <SearchIcon className="w-3 h-3 text-indigo-400" /> Sensation (The Symptom)
                    </label>
                    <input
                      type="text"
                      value={formData.sensation}
                      onChange={(e) => setFormData({ ...formData, sensation: e.target.value })}
                      placeholder="e.g. Sharp stinging pain, Heavy numbness..."
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-sm font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <ClockIcon className="w-3 h-3 text-indigo-400" /> Timing / Modalities
                    </label>
                    <input
                      type="text"
                      value={formData.timing}
                      onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                      placeholder="e.g. Worse at Night, Better from warmth..."
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!formData.sensation.trim() && !formData.location.trim()}
                  className="w-full py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add to Totality
                </button>
              </form>

              {/* List of recorded symptoms */}
              <div className="mt-12 space-y-4">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Case Totality</h3>
                  <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">{symptoms.length} Symptoms</span>
                </div>
                
                {symptoms.length === 0 ? (
                  <div className="py-12 text-center bg-slate-50 border-2 border-dashed border-slate-100 rounded-3xl">
                    <p className="text-xs text-slate-400 italic font-medium">Totality is empty</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                    {symptoms.map((s) => (
                      <div key={s.id} className="group relative bg-white border border-slate-100 rounded-2xl p-4 hover:border-indigo-200 hover:shadow-md transition-all">
                        <div className="flex gap-4 items-start">
                          <div className="p-2.5 bg-slate-50 rounded-xl">
                            {getCategoryIcon(s.category)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[9px] font-black text-indigo-300 uppercase tracking-tighter">{s.category}</span>
                            </div>
                            <p className="text-sm font-bold text-slate-800 break-words leading-tight">{s.sensation}</p>
                            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] font-medium text-slate-500">
                              <span className="flex items-center gap-1 opacity-70"><MapPinIcon className="w-3 h-3" /> {s.location}</span>
                              <span className="flex items-center gap-1 opacity-70"><ClockIcon className="w-3 h-3" /> {s.timing}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeSymptom(s.id)}
                            className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2Icon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleAnalysis}
                disabled={symptoms.length === 0 || isAnalyzing}
                className={`w-full mt-8 py-5 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest transition-all shadow-xl ${
                  isAnalyzing 
                    ? 'bg-slate-100 text-slate-400' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-indigo-100'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2Icon className="w-5 h-5 animate-spin" />
                    Performing Repertorization...
                  </>
                ) : (
                  <>
                    <ShieldCheckIcon className="w-5 h-5" />
                    Determine Simillimum
                  </>
                )}
              </button>
              
              {error && <p className="mt-4 text-[11px] text-red-500 font-bold text-center uppercase tracking-widest">{error}</p>}
            </section>
          </div>

          {/* Right: Analysis Panel */}
          <div className="lg:col-span-7">
            {!analysisResult && !isAnalyzing ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-[2.5rem] border border-slate-200 border-dashed">
                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
                  <GridIcon className="w-10 h-10 text-indigo-400" />
                </div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Clinical Repertory Analysis</h3>
                <p className="text-slate-400 text-sm mt-3 max-w-sm mx-auto leading-relaxed font-medium">
                  Add symptoms to the totality to generate a structured analysis from <strong>Kent's Repertory</strong> and clinical confirmation from <strong>Boericke</strong>.
                </p>
              </div>
            ) : isAnalyzing ? (
              <div className="bg-white rounded-[2.5rem] p-12 h-full flex flex-col items-center justify-center border border-slate-100">
                <div className="relative mb-10">
                  <div className="w-24 h-24 border-4 border-indigo-50 border-t-indigo-600 rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <SparklesIcon className="w-8 h-8 text-indigo-600 animate-pulse" />
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-800 animate-pulse tracking-tight uppercase tracking-widest">Consulting Repertory Authorities...</h3>
                <p className="text-slate-400 text-sm mt-3 font-medium">Cross-referencing Kent and Boericke sources</p>
              </div>
            ) : (
              <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-right-8 duration-700">
                
                {/* Repertorization Grid */}
                <section className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 px-8 py-6 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GridIcon className="w-5 h-5 text-indigo-600" />
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Kent's Grading Matrix</h3>
                    </div>
                    <div className="hidden sm:flex gap-5">
                      <span className="text-[10px] font-black text-slate-400 flex items-center gap-1.5 uppercase">
                        <span className="underline text-indigo-800 decoration-2">3</span> Bold
                      </span>
                      <span className="text-[10px] font-black text-slate-400 flex items-center gap-1.5 uppercase">
                        <span className="italic text-indigo-600">2</span> Italics
                      </span>
                      <span className="text-[10px] font-black text-slate-400 flex items-center gap-1.5 uppercase">
                        1 Roman
                      </span>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 w-2/3">Kent's Rubric / Chapter</th>
                          {analysisResult.remedies.map(rem => (
                            <th key={rem.name} className="px-4 py-5 text-[11px] font-black text-indigo-700 border-b border-slate-100 text-center bg-indigo-50/20 whitespace-nowrap min-w-[80px]">
                              {rem.name.split(' ')[0]}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {analysisResult.rubricAnalysis.map((row, i) => (
                          <tr key={i} className="hover:bg-indigo-50/10 transition-colors group">
                            <td className="px-8 py-4.5 text-xs font-bold text-slate-600">
                              {row.kentRubric}
                            </td>
                            {analysisResult.remedies.map(rem => {
                              const match = row.matches.find(m => 
                                m.remedyName.toLowerCase().includes(rem.name.toLowerCase()) || 
                                rem.name.toLowerCase().includes(m.remedyName.toLowerCase())
                              );
                              return (
                                <td key={rem.name} className="px-4 py-4.5 text-center group-hover:bg-white transition-all">
                                  {match ? <GradeDisplay grade={match.grade} /> : <span className="text-slate-100">-</span>}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Analysis Breakdown */}
                <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <InfoIcon className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Totality Differential</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-sm bg-indigo-50/30 p-8 rounded-3xl border border-indigo-100/30 italic font-medium">
                    "{analysisResult.summary}"
                  </p>
                </div>

                {/* Remedy Details */}
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-6">Authoritative Indications</h3>
                  {analysisResult.remedies.map((remedy, idx) => (
                    <div key={remedy.name} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                      <div className="px-8 py-7 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-indigo-100">
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className="font-black text-slate-900 text-2xl tracking-tight">{remedy.name}</h4>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">{remedy.commonName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-black text-indigo-600">{remedy.relevanceScore}%</div>
                          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Similarity</div>
                        </div>
                      </div>
                      
                      <div className="p-8 lg:p-10 grid md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                          <div>
                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                              <BookOpenIcon className="w-4 h-4" /> Boericke's Clinical Data
                            </p>
                            <p className="text-xs text-slate-600 leading-relaxed italic bg-indigo-50/30 p-6 rounded-[2rem] border border-indigo-100/30 font-medium">
                              "{remedy.boerickeReference}"
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Therapeutic Nodes</p>
                            <ul className="grid grid-cols-1 gap-3">
                              {remedy.keyIndications.map((ind, i) => (
                                <li key={i} className="text-[11px] text-slate-500 flex gap-3 leading-snug font-medium">
                                  <ChevronRightIcon className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" /> {ind}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="flex flex-col h-full">
                          <div className="bg-amber-50 rounded-[2rem] p-8 border border-amber-100 flex-1 shadow-sm">
                            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                              <ShieldCheckIcon className="w-4 h-4" /> Selection Logic
                            </p>
                            <p className="text-xs text-slate-700 leading-relaxed font-bold">
                              {remedy.differentiation}
                            </p>
                          </div>
                          <div className="mt-8">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">Key Kent Rubrics</p>
                            <div className="flex flex-wrap gap-2.5">
                              {remedy.kentRubrics.slice(0, 4).map((r, i) => (
                                <span key={i} className="text-[9px] px-4 py-1.5 bg-slate-50 text-slate-500 rounded-full font-black border border-slate-100 uppercase tracking-tighter">
                                  {r.split(' - ').pop()}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
             <SparklesIcon className="w-5 h-5 text-indigo-300" />
             <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.4em]">
               Simillimum Pro • Hahnemannian Excellence
             </p>
          </div>
          <p className="text-slate-300 text-[9px] mt-4 max-w-2xl mx-auto leading-relaxed font-bold uppercase tracking-widest">
            Expert Decision Support System leveraging Kent's Repertory and Boericke's Materia Medica. 
            Designed for licensed medical practitioners. Proprietary AI analysis engine.
          </p>
        </div>
      </footer>
    </div>
  );
}
