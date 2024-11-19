-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Waktu pembuatan: 15 Nov 2024 pada 02.35
-- Versi server: 9.1.0
-- Versi PHP: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `presence`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `t_absensi`
--

CREATE TABLE `t_absensi` (
  `kd_absensi` varchar(255) NOT NULL,
  `kd_user` varchar(255) NOT NULL,
  `jenis_absen` enum('masuk','keluar') NOT NULL,
  `foto` varchar(255) NOT NULL,
  `latitude` varchar(255) NOT NULL,
  `longitude` varchar(255) NOT NULL,
  `waktu` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `t_biodata`
--

CREATE TABLE `t_biodata` (
  `kd_biodata` varchar(255) NOT NULL,
  `nama_lengkap` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `nomor_ponsel` varchar(255) NOT NULL,
  `tempat_lahir` varchar(255) NOT NULL,
  `tanggal_lahir` varchar(255) NOT NULL,
  `jenis_kelamin` enum('pria','wanita') NOT NULL,
  `status_perkawinan` enum('bujang','menikah','cerai') NOT NULL,
  `alamat_ktp` text NOT NULL,
  `alamat_tempat_tinggal` text NOT NULL,
  `foto_wajah` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `t_location`
--

CREATE TABLE `t_location` (
  `kd_location` varchar(100) NOT NULL,
  `latitude` varchar(100) NOT NULL,
  `longitude` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `t_pekerjaan`
--

CREATE TABLE `t_pekerjaan` (
  `id_karyawan` varchar(100) NOT NULL,
  `kd_biodata` varchar(255) NOT NULL,
  `nama_pt` varchar(255) NOT NULL,
  `nama_organisasi` varchar(255) NOT NULL,
  `posisi_pekerjaan` varchar(255) NOT NULL,
  `level_pekerjaan` varchar(255) NOT NULL,
  `status_pekerjaan` enum('magang','contract','tetap','training') NOT NULL,
  `tanggal_bergabung` varchar(100) NOT NULL,
  `tanggal_berakhir` varchar(100) NOT NULL,
  `masa_kerja` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `t_users`
--

CREATE TABLE `t_users` (
  `kd_user` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL,
  `status` set('on','off') NOT NULL DEFAULT 'on',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `t_absensi`
--
ALTER TABLE `t_absensi`
  ADD PRIMARY KEY (`kd_absensi`),
  ADD KEY `kd_user` (`kd_user`);

--
-- Indeks untuk tabel `t_biodata`
--
ALTER TABLE `t_biodata`
  ADD PRIMARY KEY (`kd_biodata`);

--
-- Indeks untuk tabel `t_location`
--
ALTER TABLE `t_location`
  ADD PRIMARY KEY (`kd_location`);

--
-- Indeks untuk tabel `t_pekerjaan`
--
ALTER TABLE `t_pekerjaan`
  ADD PRIMARY KEY (`id_karyawan`),
  ADD KEY `kd_biodata` (`kd_biodata`);

--
-- Indeks untuk tabel `t_users`
--
ALTER TABLE `t_users`
  ADD PRIMARY KEY (`kd_user`);

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `t_absensi`
--
ALTER TABLE `t_absensi`
  ADD CONSTRAINT `t_absensi_ibfk_1` FOREIGN KEY (`kd_user`) REFERENCES `t_users` (`kd_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `t_pekerjaan`
--
ALTER TABLE `t_pekerjaan`
  ADD CONSTRAINT `t_pekerjaan_ibfk_1` FOREIGN KEY (`kd_biodata`) REFERENCES `t_biodata` (`kd_biodata`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
