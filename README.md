# Dmaktab — Maktab platformasi

React + Vite asosidagi maktab boshqaruv interfeysi.

## Yangilangan versiya

- Dmaktab logotipi qo‘shildi (`public/dmaktab-logo.png`)
- `Xabarlar` bo‘limi olib tashlandi
- `Baholar` sahifasi fanlar bo‘yicha kartalar, o‘rtacha natija, progress va baholar jurnali bilan qayta ishlangan
- `Sozlamalar` bo‘limiga foydali funksiyalar qo‘shildi:
  - Light / Dark mode
  - Bildirishnomalarni yoqish/o‘chirish
  - Ixcham ko‘rinish
  - Ma’lumotlarni JSON backup qilish
  - Demo ma’lumotlarini tiklash
- Responsive dizayn saqlangan

## Ishga tushirish

```bash
npm install
npm run dev
```

Keyin Vite ko‘rsatgan lokal manzilni brauzerda oching.

## Demo loginlar

**O‘quvchi**
- Login: `student1`
- Parol: `123456`

**O‘qituvchi**
- Login: `teacher1`
- Parol: `123456`

**Admin**
- Login: `admin`
- Parol: `admin123`

> Ushbu loyiha hozircha browser `localStorage` bazasidan foydalanadi. Real maktabda PostgreSQL/Prisma kabi server bazasiga ulash tavsiya etiladi.
