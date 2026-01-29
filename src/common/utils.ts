export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Ganti spasi dengan -
    .replace(/[^\w-]+/g, '')  // Hapus semua karakter non-word (kecuali -)
    .replace(/--+/g, '-')     // Ganti multiple - dengan single -
    .replace(/^-+/, '')       // Hapus - di awal teks
    .replace(/-+$/, '');      // Hapus - di akhir teks
};