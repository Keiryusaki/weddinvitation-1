 import React, { useState, useEffect } from 'react';
 import { db } from './firebase';
 import { collection, onSnapshot, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
 import { Lock, Trash2, Download, LogOut, Users, CheckCircle, XCircle, HelpCircle, Image, ExternalLink } from 'lucide-react';
 
 const ADMIN_PASSWORD = 'As3kb3sokgwKawin';
 
 export default function Admin() {
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const [wishes, setWishes] = useState([]);
   const [confirmations, setConfirmations] = useState([]);
   const [deleting, setDeleting] = useState(null);
 
   useEffect(() => {
     if (!isAuthenticated) return;
     
     const q = query(collection(db, 'wishes'), orderBy('createdAt', 'desc'));
     const unsubscribe = onSnapshot(q, (snapshot) => {
       const wishesData = snapshot.docs.map(doc => ({
         id: doc.id,
         ...doc.data()
       }));
       setWishes(wishesData);
     });
 
     return () => unsubscribe();
   }, [isAuthenticated]);
 
   const handleLogin = (e) => {
     e.preventDefault();
     if (password === ADMIN_PASSWORD) {
       setIsAuthenticated(true);
       setError('');
     } else {
       setError('Password salah!');
     }
   };
 
   const handleDelete = async (id) => {
     if (!confirm('Yakin mau hapus ucapan ini?')) return;
     setDeleting(id);
     try {
       await deleteDoc(doc(db, 'wishes', id));
     } catch (err) {
       console.error('Error deleting:', err);
     }
     setDeleting(null);
   };
 
   const handleDeleteAll = async () => {
     if (!confirm(`Yakin mau hapus SEMUA ${wishes.length} ucapan? Ini tidak bisa dibatalkan!`)) return;
     for (const wish of wishes) {
       await deleteDoc(doc(db, 'wishes', wish.id));
     }
   };
 
   const exportCSV = () => {
     const headers = ['Nama', 'Ucapan', 'Kehadiran', 'Waktu'];
     const rows = wishes.map(w => [
       w.name,
       w.message.replace(/"/g, '""'),
       w.attendance === 'hadir' ? 'Hadir' : w.attendance === 'tidak' ? 'Tidak Hadir' : 'Ragu-ragu',
       w.createdAt ? w.createdAt.toDate().toLocaleString('id-ID') : '-'
     ]);
     
     const csv = [headers, ...rows]
       .map(row => row.map(cell => `"${cell}"`).join(','))
       .join('\n');
     
     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
     const url = URL.createObjectURL(blob);
     const link = document.createElement('a');
     link.href = url;
     link.download = `ucapan-wedding-${new Date().toISOString().split('T')[0]}.csv`;
     link.click();
   };
 
   const stats = {
     total: wishes.length,
     hadir: wishes.filter(w => w.attendance === 'hadir').length,
     tidak: wishes.filter(w => w.attendance === 'tidak').length,
     ragu: wishes.filter(w => w.attendance === 'ragu').length
   };
 
   if (!isAuthenticated) {
     return (
       <div className="min-h-screen bg-gradient-to-br from-[#1A365D] to-[#0f172a] flex items-center justify-center p-4">
         <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
           <div className="text-center mb-6">
             <div className="w-16 h-16 bg-[#E6F4FA] rounded-full flex items-center justify-center mx-auto mb-4">
               <Lock className="text-[#1A365D]" size={28} />
             </div>
             <h1 className="text-2xl font-bold text-[#1A365D]">Admin Panel</h1>
             <p className="text-sm text-gray-500 mt-1">Masukkan password untuk akses</p>
           </div>
           <form onSubmit={handleLogin} className="space-y-4">
             <input
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               placeholder="Password"
               className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
             />
             {error && <p className="text-red-500 text-sm text-center">{error}</p>}
             <button
               type="submit"
               className="w-full bg-[#1A365D] text-white py-3 rounded-lg font-medium hover:bg-[#0f172a] transition"
             >
               Masuk
             </button>
           </form>
           <a href="/" className="block text-center text-sm text-gray-400 mt-4 hover:text-[#C5A059]">
             ← Kembali ke undangan
           </a>
         </div>
       </div>
     );
   }
 
   return (
     <div className="min-h-screen bg-gray-100">
       {/* Header */}
       <div className="bg-[#1A365D] text-white p-4 shadow-lg">
         <div className="max-w-6xl mx-auto flex items-center justify-between">
           <h1 className="text-xl font-bold">Admin - Ucapan Wedding</h1>
           <button
             onClick={() => setIsAuthenticated(false)}
             className="flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition"
           >
             <LogOut size={16} />
             Logout
           </button>
         </div>
       </div>
 
       <div className="max-w-6xl mx-auto p-4 md:p-6">
         {/* Stats */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
           <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-[#1A365D]">
             <div className="flex items-center gap-3">
               <Users className="text-[#1A365D]" size={24} />
               <div>
                 <p className="text-2xl font-bold text-[#1A365D]">{stats.total}</p>
                 <p className="text-xs text-gray-500">Total Ucapan</p>
               </div>
             </div>
           </div>
           <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
             <div className="flex items-center gap-3">
               <CheckCircle className="text-green-500" size={24} />
               <div>
                 <p className="text-2xl font-bold text-green-600">{stats.hadir}</p>
                 <p className="text-xs text-gray-500">Hadir</p>
               </div>
             </div>
           </div>
           <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-400">
             <div className="flex items-center gap-3">
               <XCircle className="text-red-400" size={24} />
               <div>
                 <p className="text-2xl font-bold text-red-500">{stats.tidak}</p>
                 <p className="text-xs text-gray-500">Tidak Hadir</p>
               </div>
             </div>
           </div>
           <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-yellow-400">
             <div className="flex items-center gap-3">
               <HelpCircle className="text-yellow-500" size={24} />
               <div>
                 <p className="text-2xl font-bold text-yellow-600">{stats.ragu}</p>
                 <p className="text-xs text-gray-500">Ragu-ragu</p>
               </div>
             </div>
           </div>
         </div>
 
         {/* Actions */}
         <div className="flex flex-wrap gap-3 mb-6">
           <button
             onClick={exportCSV}
             className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
           >
             <Download size={16} />
             Export CSV
           </button>
           <button
             onClick={handleDeleteAll}
             className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm font-medium"
           >
             <Trash2 size={16} />
             Hapus Semua
           </button>
         </div>
 
         {/* Table */}
         <div className="bg-white rounded-xl shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full">
               <thead className="bg-gray-50 border-b">
                 <tr>
                   <th className="text-left p-4 text-sm font-semibold text-gray-600">Nama</th>
                   <th className="text-left p-4 text-sm font-semibold text-gray-600">Ucapan</th>
                   <th className="text-left p-4 text-sm font-semibold text-gray-600">Kehadiran</th>
                   <th className="text-left p-4 text-sm font-semibold text-gray-600">Waktu</th>
                   <th className="text-center p-4 text-sm font-semibold text-gray-600">Aksi</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {wishes.length === 0 ? (
                   <tr>
                     <td colSpan="5" className="text-center py-12 text-gray-400">
                       Belum ada ucapan
                     </td>
                   </tr>
                 ) : (
                   wishes.map((wish) => (
                     <tr key={wish.id} className="hover:bg-gray-50 transition">
                       <td className="p-4 font-medium text-[#1A365D]">{wish.name}</td>
                       <td className="p-4 text-gray-600 text-sm max-w-xs">
                         <p className="line-clamp-2">{wish.message}</p>
                       </td>
                       <td className="p-4">
                         <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                           wish.attendance === 'hadir' 
                             ? 'bg-green-100 text-green-700' 
                             : wish.attendance === 'tidak'
                             ? 'bg-red-100 text-red-600'
                             : 'bg-yellow-100 text-yellow-700'
                         }`}>
                           {wish.attendance === 'hadir' ? 'Hadir' : wish.attendance === 'tidak' ? 'Tidak Hadir' : 'Ragu'}
                         </span>
                       </td>
                       <td className="p-4 text-sm text-gray-500">
                         {wish.createdAt ? wish.createdAt.toDate().toLocaleString('id-ID') : '-'}
                       </td>
                       <td className="p-4 text-center">
                         <button
                           onClick={() => handleDelete(wish.id)}
                           disabled={deleting === wish.id}
                           className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition disabled:opacity-50"
                         >
                           <Trash2 size={18} />
                         </button>
                       </td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
           </div>
         </div>
       </div>
     </div>
   );
 }
