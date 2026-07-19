'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';

export default function CompleteProfilePage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [cityId, setCityId] = useState('');
  const [provinceId, setProvinceId] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await fetchApi('/profile/complete', {
        method: 'POST',
        body: JSON.stringify({ 
            phone_number: phoneNumber, 
            address, 
            city_id: cityId,
            province_id: provinceId,
            postal_code: postalCode
        }),
      });
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.data?.message || 'Failed to update profile. Please check your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md border border-black p-8 bg-white">
        <h1 className="text-4xl font-anton uppercase mb-2">Complete Profile</h1>
        <p className="text-sm mb-8 text-black/70">
          You logged in with Google. Please provide your shipping details to complete your account.
        </p>

        {error && (
          <div className="bg-red-500 text-white p-3 mb-6 text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" htmlFor="phone">
              Phone Number
            </label>
            <input
              id="phone"
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. 08123456789"
              className="w-full border border-black p-3 rounded-none focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" htmlFor="address">
              Full Address
            </label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              placeholder="Street name, building, house number..."
              className="w-full border border-black p-3 rounded-none focus:outline-none focus:ring-2 focus:ring-black"
              required
            ></textarea>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" htmlFor="city">
                City ID (Optional)
              </label>
              <input
                id="city"
                type="text"
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                className="w-full border border-black p-3 rounded-none focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" htmlFor="province">
                Province ID (Optional)
              </label>
              <input
                id="province"
                type="text"
                value={provinceId}
                onChange={(e) => setProvinceId(e.target.value)}
                className="w-full border border-black p-3 rounded-none focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" htmlFor="postal">
              Postal Code (Optional)
            </label>
            <input
              id="postal"
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full border border-black p-3 rounded-none focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white p-4 uppercase font-bold tracking-widest hover:bg-black/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
