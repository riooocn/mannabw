'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) return null;

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4 pt-24 pb-12">
      <div className="w-full max-w-2xl border border-primary p-8 bg-surface-container shadow-sm">
        <h1 className="text-4xl font-anton uppercase mb-2">Profil Saya</h1>
        <p className="text-sm mb-8 text-on-surface-variant">
          Informasi dasar akun Anda.
        </p>

        <div className="space-y-6">
            <div className="flex flex-row items-center gap-4 md:gap-8 border border-primary p-4 md:p-8 bg-surface-container-low">
                {/* Profile Picture Placeholder */}
                <div className="w-16 h-16 md:w-24 md:h-24 bg-primary text-on-primary flex items-center justify-center text-3xl md:text-5xl font-anton uppercase rounded-none flex-shrink-0">
                    {user.name.charAt(0)}
                </div>
                
                {/* Info */}
                <div className="flex-1 space-y-2 md:space-y-4 text-left min-w-0">
                    <div className="border-b border-primary/20 pb-1 md:pb-2">
                        <h4 className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-0.5 md:mb-1">Nama Lengkap</h4>
                        <p className="font-bold text-sm md:text-lg truncate">{user.name}</p>
                    </div>
                    <div className="border-b border-primary/20 pb-1 md:pb-2">
                        <h4 className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-0.5 md:mb-1">Email</h4>
                        <p className="font-bold text-xs md:text-base truncate">{user.email}</p>
                    </div>
                    <div>
                        <h4 className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-0.5 md:mb-1">Nomor Handphone</h4>
                        <p className="font-bold text-xs md:text-base truncate">{user.phone_number || '-'}</p>
                    </div>
                </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 md:gap-4">
                <button 
                    onClick={() => router.push('/orders')} 
                    className="flex flex-col items-center justify-center border border-primary p-2 md:p-6 bg-surface-container hover:bg-primary hover:text-on-primary transition-colors duration-300 text-center"
                >
                    <span className="font-anton text-[10px] md:text-xl tracking-widest uppercase mb-1 whitespace-nowrap">Riwayat Pesanan</span>
                    <span className="text-[6px] md:text-[10px] font-bold uppercase tracking-widest opacity-80 whitespace-nowrap">Lihat & Lacak</span>
                </button>
                
                <button 
                    onClick={() => router.push('/address')} 
                    className="flex flex-col items-center justify-center border border-primary p-2 md:p-6 bg-surface-container hover:bg-primary hover:text-on-primary transition-colors duration-300 text-center"
                >
                    <span className="font-anton text-[10px] md:text-xl tracking-widest uppercase mb-1 whitespace-nowrap">Alamat Tersimpan</span>
                    <span className="text-[6px] md:text-[10px] font-bold uppercase tracking-widest opacity-80 whitespace-nowrap">Atur Alamat</span>
                </button>
            </div>
            
            <p className="text-xs text-on-surface-variant text-center border-t border-primary/20 pt-6">
                Untuk mengubah nama atau email, silakan hubungi tim bantuan Manna Blessingwear.
            </p>
        </div>
      </div>
    </div>
  );
}
