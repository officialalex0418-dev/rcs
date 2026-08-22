import React, { useState, useEffect } from 'react';
import { Upload, Plus, Folder, Image as ImageIcon, Trash2, Edit, MoreVertical, Search } from 'lucide-react';

const GalleryManager = () => {
  const [activeTab, setActiveTab] = useState('media');
  const [media, setMedia] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // simulate API delay
    setTimeout(() => {
      setAlbums([
        { _id: '1', name: 'Corporate Events', itemsCount: 12, category: 'Events', status: 'Active' },
        { _id: '2', name: 'Office Interior', itemsCount: 8, category: 'Office', status: 'Active' },
        { _id: '3', name: 'Project Branding', itemsCount: 24, category: 'Marketing', status: 'Active' },
      ]);
      setMedia([
        { _id: 'm1', title: 'Office Front', url: '/Hero.png', album: 'Office Interior', published: true },
        { _id: 'm2', title: 'Team Meeting', url: '/team1.png', album: 'Corporate Events', published: true },
        { _id: 'm3', title: 'Project Logo', url: '/Logo.png', album: 'Project Branding', published: true },
        { _id: 'm4', title: 'Work Space', url: '/team2.png', album: 'Office Interior', published: true },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gallery Management</h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">
            <Upload size={18} />
            Upload Media
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition">
            <Plus size={18} />
            New Album
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-6 py-2 text-sm font-medium transition ${activeTab === 'media' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('media')}
        >
          All Media
        </button>
        <button
          className={`px-6 py-2 text-sm font-medium transition ${activeTab === 'albums' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('albums')}
        >
          Albums
        </button>
      </div>

      {/* Media View */}
      {activeTab === 'media' && (
        <div>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Search media..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md sm:text-sm"
              />
            </div>
            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white">
              <option>All Albums</option>
              {albums.map(a => <option key={a._id}>{a.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {loading ? (
              <div className="col-span-full text-center py-12 text-gray-500">Loading media...</div>
            ) : media.map((item) => (
              <div key={item._id} className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                <div className="aspect-square bg-gray-100 relative">
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button className="p-2 bg-white rounded-full text-blue-600 hover:bg-blue-50">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                  <p className="text-xs text-gray-500 truncate">{item.album}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Albums View */}
      {activeTab === 'albums' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12 text-gray-500">Loading albums...</div>
          ) : albums.map((album) => (
            <div key={album._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                  <Folder size={24} />
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical size={20} />
                </button>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{album.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <ImageIcon size={14} />
                <span>{album.itemsCount} Items</span>
                <span className="text-gray-300">•</span>
                <span>{album.category}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                  {album.status}
                </span>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View Album</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryManager;
