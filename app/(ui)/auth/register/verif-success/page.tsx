"use client";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams dari next/navigation
import styles from './VerifikasiEmail.module.css'; // Mengimpor stylesheet
import Image from 'next/image'; // Import Image dari Next.js
import ImageVerif from '../../../../../assets/images/verif-success.png';

export default function VerifikasiEmail() {
  const searchParams = useSearchParams(); // Mengambil search params dari URL
  const token = searchParams.get('token'); // Mendapatkan token dari query string
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const verifyEmail = async () => {
    console.log("Masuk ke sini: " + token);
    if (!token) {
      console.error('Token is not available');
      return;
    }

    try {
      const response = await fetch(`/api/auth/verif-Email?token=${token}`, { // Ganti user_id dengan token
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      console.log('response: ', result);
      if (result.success) {
        setIsSuccess(true);
      } else {
        setIsSuccess(false); // Menangani jika verifikasi gagal
      }

    } catch (error) {
      console.error('Error verifying email:', error);
      setIsSuccess(false); // Menangani error
    } finally {
      setIsLoading(false); // Ubah menjadi false setelah selesai
    }
  };

  useEffect(() => {
    if (token) {
      verifyEmail(); // Menjalankan verifyEmail hanya jika token ada
    }
  }, [token]); // Menjalankan verifyEmail ketika token berubah

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Image 
          src={ImageVerif} // Ganti dengan path gambar yang sesuai
          alt="Verifikasi Email"
          width={300} // Lebar gambar
          height={300} // Tinggi gambar
          className={styles.image} // Kelas untuk styling tambahan
        />
        {isLoading ? (
          <h1 className={styles.loadingText}>Memverifikasi email...</h1>
        ) : (
          isSuccess ? (
            <h1 className={styles.successText}>Berhasil Verifikasi!</h1>
          ) : (
            <h1 className={styles.errorText}>Gagal Verifikasi</h1>
          )
        )}
        <button className={styles.loginButton} onClick={() => window.location.href='/auth/login'}>
          Login
        </button>
      </div>
    </div>
  );
}
