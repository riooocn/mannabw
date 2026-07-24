'use client';

import { useState, useRef, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function AddressPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form states
  const [label, setLabel] = useState('Rumah');
  const [recipientName, setRecipientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [addressLine, setAddressLine] = useState('');
  
  // Biteship Location states
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [cityId, setCityId] = useState('');
  const [provinceName, setProvinceName] = useState('');
  const [cityName, setCityName] = useState('');
  const [districtName, setDistrictName] = useState('');
  const [postalCode, setPostalCode] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !user) {
        router.push('/login');
    } else if (user) {
        fetchAddresses();
    }
  }, [user, isAuthLoading]);

  const fetchAddresses = async () => {
      try {
          const data = await fetchApi('/api/addresses');
          setAddresses(data || []);
      } catch (err) {
          console.error("Failed to fetch addresses");
      } finally {
          setIsLoading(false);
      }
  };

  const openForm = (addr: any = null) => {
      setIsEditing(true);
      setError('');
      setSuccess('');
      
      if (addr) {
          setEditingId(addr.id);
          setLabel(addr.label);
          setRecipientName(addr.recipient_name);
          setPhoneNumber(addr.phone_number);
          setAddressLine(addr.full_address);
          setCityId(addr.city_id);
          setProvinceName(addr.province_id);
          setPostalCode(addr.postal_code);
          setSearchQuery('Lokasi Tersimpan (Ketik ulang untuk mengubah)');
      } else {
          setEditingId(null);
          setLabel('Rumah');
          setRecipientName(user?.name || '');
          setPhoneNumber(user?.phone_number || '');
          setAddressLine('');
          setCityId('');
          setProvinceName('');
          setCityName('');
          setDistrictName('');
          setPostalCode('');
          setSearchQuery('');
      }
  };

  const closeForm = () => {
      setIsEditing(false);
      setEditingId(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCityId('');
    setProvinceName('');
    setCityName('');
    setDistrictName('');
    setPostalCode('');

    if (query.length < 3) {
      setLocations([]);
      setShowDropdown(false);
      return;
    }

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await fetchApi(`/api/shipping/locations?query=${query}`);
        if (data && data.areas) {
          setLocations(data.areas);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error("Failed to fetch locations", err);
      } finally {
        setIsSearching(false);
      }
    }, 500);
  };

  const selectLocation = (area: any) => {
    setSearchQuery(`${area.name}, ${area.administrative_division_level_2_name}, ${area.administrative_division_level_1_name}`);
    setCityId(area.id);
    setDistrictName(area.name || '');
    setCityName(area.administrative_division_level_2_name || '');
    setProvinceName(area.administrative_division_level_1_name || '');
    setPostalCode(area.postal_code ? String(area.postal_code) : '');
    setShowDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityId) {
        setError('Please select a valid location from the search dropdown.');
        return;
    }

    setIsLoading(true);
    setError('');

    const payload = {
        label,
        recipient_name: recipientName,
        phone_number: phoneNumber, 
        full_address: addressLine, 
        city_id: cityId,
        province_id: provinceName,
        postal_code: postalCode
    };

    try {
      if (editingId) {
          await fetchApi(`/api/addresses/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) });
          setSuccess('Alamat berhasil diperbarui!');
      } else {
          await fetchApi('/api/addresses', { method: 'POST', body: JSON.stringify(payload) });
          setSuccess('Alamat berhasil ditambahkan!');
      }
      
      fetchAddresses();
      setTimeout(() => {
          closeForm();
          setSuccess('');
      }, 1500);
    } catch (err: any) {
      setError(err.data?.message || 'Gagal menyimpan alamat. Silakan cek kembali input Anda.');
      setIsLoading(false);
    }
  };

  const setAsDefault = async (id: number) => {
      setIsLoading(true);
      try {
          await fetchApi(`/api/addresses/${id}/set-default`, { method: 'POST' });
          fetchAddresses();
      } catch (err) {
          console.error(err);
          setIsLoading(false);
      }
  };

  const deleteAddress = async (id: number) => {
      if (!confirm('Apakah Anda yakin ingin menghapus alamat ini?')) return;
      setIsLoading(true);
      try {
          await fetchApi(`/api/addresses/${id}`, { method: 'DELETE' });
          fetchAddresses();
      } catch (err) {
          console.error(err);
          setIsLoading(false);
      }
  };

  if (isAuthLoading) return null;

  return (
    <div className="min-h-screen bg-surface p-4 pt-24 pb-12">
      <div className="max-w-4xl mx-auto border border-primary p-8 bg-surface-container shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h1 className="text-3xl md:text-4xl font-anton uppercase mb-2 leading-tight">Alamat Pengiriman</h1>
                <p className="text-sm text-on-surface-variant">
                  Kelola alamat pengiriman untuk pesanan Anda.
                </p>
            </div>
            {!isEditing && (
                <button 
                    onClick={() => openForm()}
                    className="w-full md:w-auto bg-primary text-on-primary px-6 py-3 text-xs uppercase font-bold tracking-widest hover:bg-primary/90 transition-colors"
                >
                    + Tambah Alamat Baru
                </button>
            )}
        </div>

        {error && <div className="bg-red-500 text-white p-3 mb-6 text-sm font-semibold">{error}</div>}
        {success && <div className="bg-green-500 text-white p-3 mb-6 text-sm font-semibold">{success}</div>}

        {!isEditing ? (
            <div className="space-y-4">
                {isLoading ? (
                    <p className="text-center py-8">Memuat alamat...</p>
                ) : addresses.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-primary/50">
                        <p className="mb-4 text-on-surface-variant">Anda belum memiliki alamat tersimpan.</p>
                        <button onClick={() => openForm()} className="border border-primary px-6 py-2 text-xs uppercase font-bold hover:bg-surface-container-low">
                            Tambah Sekarang
                        </button>
                    </div>
                ) : (
                    addresses.map((addr) => (
                        <div 
                            key={addr.id} 
                            onClick={() => openForm(addr)}
                            className={`border ${addr.is_default ? 'border-primary' : 'border-primary/20'} p-6 bg-surface-container relative cursor-pointer hover:border-primary transition-colors group`}
                        >
                            {addr.is_default && (
                                <div className="absolute top-0 right-0 bg-primary text-on-primary text-[10px] px-3 py-1 font-bold uppercase tracking-wider">
                                    UTAMA
                                </div>
                            )}
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-bold uppercase text-on-surface-variant tracking-wider bg-surface-dim px-2 py-1">{addr.label}</span>
                                        <h3 className="font-bold text-lg uppercase">{addr.recipient_name}</h3>
                                    </div>
                                    <p className="text-sm text-on-surface-variant mb-2">{addr.phone_number}</p>
                                    <div className="text-sm text-on-surface space-y-1">
                                        <p>{addr.full_address}</p>
                                        <p>Provinsi {addr.province_id}, {addr.postal_code}</p>
                                    </div>
                                </div>
                                <div className="hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant border-b border-on-surface-variant">Edit</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        ) : (
            <div className="border border-primary p-6 bg-surface-container-low">
                <h2 className="text-2xl font-anton uppercase mb-6">{editingId ? 'Ubah Alamat' : 'Tambah Alamat Baru'}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2">Label Alamat</label>
                        <select 
                            value={label} 
                            onChange={(e) => setLabel(e.target.value)}
                            className="w-full border border-primary p-3 rounded-none focus:outline-none focus:ring-2 focus:ring-primary bg-surface-container"
                        >
                            <option value="Rumah">Rumah</option>
                            <option value="Kantor">Kantor</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2">Nama Penerima</label>
                        <input
                          type="text"
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          placeholder="Nama lengkap penerima"
                          className="w-full border border-primary p-3 rounded-none focus:outline-none focus:ring-2 focus:ring-primary bg-surface-container"
                          required
                        />
                      </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">Nomor Handphone (WhatsApp)</label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Contoh: 08123456789"
                      className="w-full border border-primary p-3 rounded-none focus:outline-none focus:ring-2 focus:ring-primary bg-surface-container"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">Alamat Lengkap (Jalan, RT/RW, Gedung)</label>
                    <textarea
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      rows={3}
                      placeholder="Nama jalan, gedung, nomor rumah..."
                      className="w-full border border-primary p-3 rounded-none focus:outline-none focus:ring-2 focus:ring-primary bg-surface-container"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="relative">
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2">Ketik & Cari Lokasi (Kecamatan / Kota)</label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Contoh: Grogol, Sukoharjo"
                      className="w-full border border-primary p-3 rounded-none focus:outline-none focus:ring-2 focus:ring-primary bg-surface-container"
                      autoComplete="off"
                      required
                    />
                    {isSearching && <div className="absolute right-3 top-[38px] text-xs text-on-surface-variant">Mencari...</div>}
                    
                    {showDropdown && locations.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-surface-container border border-primary max-h-60 overflow-y-auto shadow-lg">
                        {locations.map((area) => (
                          <div
                            key={area.id}
                            onClick={() => selectLocation(area)}
                            className="p-3 hover:bg-primary hover:text-on-primary cursor-pointer text-sm border-b border-primary/10 last:border-0 transition-colors"
                          >
                            <div className="font-bold">{area.name}</div>
                            <div className="text-xs opacity-70">
                              {area.administrative_division_level_2_name}, {area.administrative_division_level_1_name} {area.postal_code}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {showDropdown && locations.length === 0 && searchQuery.length >= 3 && !isSearching && (
                       <div className="absolute z-10 w-full mt-1 bg-surface-container border border-primary p-3 text-sm text-center text-red-500">
                         Lokasi tidak ditemukan. Pastikan ejaan benar.
                       </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-on-surface-variant">Kecamatan</label>
                      <input type="text" value={districtName} readOnly className="w-full border border-primary/20 p-3 bg-surface-dim text-on-surface-variant outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-on-surface-variant">Kota/Kabupaten</label>
                      <input type="text" value={cityName} readOnly className="w-full border border-primary/20 p-3 bg-surface-dim text-on-surface-variant outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-on-surface-variant">Provinsi</label>
                      <input type="text" value={provinceName} readOnly className="w-full border border-primary/20 p-3 bg-surface-dim text-on-surface-variant outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-on-surface-variant">Kode Pos</label>
                      <input type="text" value={postalCode} readOnly className="w-full border border-primary/20 p-3 bg-surface-dim text-on-surface-variant outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:flex md:flex-row gap-2 md:gap-4 pt-4 border-t border-primary/10 mt-6">
                    <button
                        type="button"
                        onClick={closeForm}
                        className="w-full md:w-auto md:flex-1 border-2 border-primary bg-surface-container text-on-surface p-3 md:p-4 text-xs md:text-sm uppercase font-bold tracking-widest hover:bg-surface-container-low transition-colors"
                    >
                        Batal
                    </button>
                    
                    {editingId && (
                        <button
                            type="button"
                            onClick={() => {
                                deleteAddress(editingId);
                                closeForm();
                            }}
                            className="w-full md:w-auto md:flex-1 border-2 border-red-500 bg-surface-container text-red-500 p-3 md:p-4 text-xs md:text-sm uppercase font-bold tracking-widest hover:bg-red-500/10 transition-colors"
                        >
                            Hapus
                        </button>
                    )}

                    {editingId && addresses.find(a => a.id === editingId) && !addresses.find(a => a.id === editingId)?.is_default && (
                        <button
                            type="button"
                            onClick={() => {
                                setAsDefault(editingId);
                                closeForm();
                            }}
                            className="w-full md:w-auto md:flex-1 border-2 border-primary bg-surface-container text-on-surface p-3 md:p-4 text-[10px] md:text-sm uppercase font-bold tracking-widest hover:bg-surface-container-low transition-colors whitespace-nowrap"
                        >
                            Jadikan Utama
                        </button>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading || !cityId}
                      className="w-full md:w-auto md:flex-1 bg-primary text-on-primary p-3 md:p-4 text-xs md:text-sm uppercase font-bold tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Menyimpan...' : 'Simpan'}
                    </button>
                  </div>
                </form>
            </div>
        )}
      </div>
    </div>
  );
}
