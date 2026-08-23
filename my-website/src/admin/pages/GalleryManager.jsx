import React, { useState, useEffect } from 'react';
import { Upload, Plus, Folder, Image as ImageIcon, Trash2, Edit, MoreVertical, Search, X, Save, FileImage, ShieldCheck } from 'lucide-react';

const GalleryManager = () => {
  const [activeTab, setActiveTab] = useState('media');
  const [media, setMedia] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    album: '',
    type: 'IMAGE'
  });

  const fetchData = async () => {
    try {
      const backendUrl = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('rcs_admin_token');
      const [mediaRes, albumRes] = await Promise.all([
        fetch(`${backendUrl}/api/gallery/items`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${backendUrl}/api/gallery/albums`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      const mData = await mediaRes.json();
      const aData = await albumRes.json();
      if (mData.success) setMedia(mData.data);
      if (aData.success) setAlbums(aData.data);
    } catch (err) {
      console.error('Failed to fetch gallery data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const backendUrl = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('rcs_admin_token');
      const response = await fetch(`${backendUrl}/api/gallery/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setShowModal(false);
        setFormData({ title: '', url: '', album: '', type: 'IMAGE' });
        fetchData();
      }
    } catch (err) {
      console.error('Failed to upload media:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Erase this media asset from RCS servers?')) return;
    try {
      const backendUrl = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('rcs_admin_token');
      await fetch(`${backendUrl}/api/gallery/items/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error('Failed to delete media:', err);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Deploy Media Asset</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"><X size={20} /></button>
             </div>

             <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Title</label>
                   <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" placeholder="e.g. Q3 Strategy Meet" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Remote URL / Cloud Path</label>
                   <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input required className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold" placeholder="https://cdn.rcs.com.np/..." value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Media Type</label>
                      <select className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                         <option value="IMAGE">Still Image</option>
                         <option value="VIDEO">Motion Video</option>
                      </select>
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign to Album</label>
                      <select required className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none" value={formData.album} onChange={e => setFormData({...formData, album: e.target.value})}>
                         <option value="">Select Album</option>
                         {albums.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                      </select>
                   </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                   <button type="button" onClick={() => setShowModal(false)} className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Discard</button>
                   <button type="submit" className="flex items-center gap-2 bg-slate-900 text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10"><Save size={16} /> Deploy Asset</button>
                </div>
             </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Media Vault</h1>
          <p className="text-slate-500 font-medium mt-1">Manage public portfolio and operational visual assets.</p>
        </div>
        <div className="flex gap-3">
           <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 px-6 py-3 rounded-2xl text-sm font-black text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
              <Upload size={18} /> Upload Media
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'media' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'bg-white text-slate-400 border border-slate-200 hover:text-slate-900'}`}
          onClick={() => setActiveTab('media')}
        >
          All Assets
        </button>
        <button
          className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'albums' ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'bg-white text-slate-400 border border-slate-200 hover:text-slate-900'}`}
          onClick={() => setActiveTab('albums')}
        >
          Albums Pool
        </button>
      </div>

      {/* Media View */}
      {activeTab === 'media' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {loading ? (
             <div className="col-span-full py-20 text-center font-bold text-slate-400 uppercase tracking-widest text-xs">Accessing Cloud Assets...</div>
          ) : media.length === 0 ? (
             <div className="col-span-full py-20 text-center font-bold text-slate-400 uppercase tracking-widest text-xs">No media assets found</div>
          ) : media.map((item) => (
            <div key={item._id} className="group relative bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:border-blue-500/50 transition-all">
              <div className="aspect-[4/3] bg-slate-100 relative">
                <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                  <button onClick={() => handleDelete(item._id)} className="p-3 bg-white/10 hover:bg-red-500 text-white rounded-2xl backdrop-blur-md transition-all shadow-xl">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="p-4 bg-white">
                <p className="text-sm font-black text-slate-900 truncate leading-none mb-1">{item.title}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.type}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Albums View */}
      {activeTab === 'albums' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-20 font-bold text-slate-400 uppercase tracking-widest text-xs">Loading Storage Tiers...</div>
          ) : albums.map((album) => (
            <div key={album._id} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 hover:border-blue-500/50 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                  <Folder size={24} />
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                   Active
                </div>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-1">{album.name}</h3>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-400 mb-8">
                <span className="flex items-center gap-1.5"><ImageIcon size={14} /> 24 Assets</span>
                <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                <span className="uppercase tracking-widest">{album.category}</span>
              </div>
              <button className="w-full py-3 bg-slate-50 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                Open Directory
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryManager;
