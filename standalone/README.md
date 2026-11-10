# คู่มือการตั้งค่า Firebase Realtime Database และ Deploy ทีละขั้นตอน (ฟรี 100%)

ระบบแบบประเมินความพึงพอใจการอบรมนี้ทำงานแบบ **Serverless 100%** โดยใช้คู่ไฟล์ HTML + Firebase Realtime Database
- ไฟล์ **`index.html`**: หน้าแบบสอบถามสเกล 1-5 สำหรับผู้เข้าอบรมเปิดบนมือถือ
- ไฟล์ **`dashboard.html`**: หน้าแดชบอร์ดฉายขึ้นจอโปรเจกเตอร์ อัปเดตทันทีแบบเรียลไทม์

---

## ขั้นตอนที่ 1: สร้าง Firebase Project (ฟรี ไม่ต้องผูกบัตรเครดิต)
1. เข้าไปที่ [https://console.firebase.google.com](https://console.firebase.google.com)
2. คลิก **Add project** (เพิ่มโปรเจกต์)
3. ตั้งชื่อโปรเจกต์ เช่น `my-training-eval` แล้วกด **Continue**
4. หน้า Google Analytics สามารถกดยกเลิก (Disabled) หรือเปิดไว้ก็ได้ แล้วกด **Create project**
5. รอระบบสร้างโปรเจกต์ประมาณ 20 วินาที แล้วกด **Continue**

---

## ขั้นตอนที่ 2: เปิดใช้งาน Realtime Database
1. ในแถบเมนูด้านซ้าย เลือกหมวด **Build** > คลิก **Realtime Database**
2. คลิกปุ่มสีฟ้า **"Create Database"**
3. **Database location**: แนะนำเลือก **Singapore (`asia-southeast1`)** เพื่อความเร็วสูงสุดและ Latency ต่ำสุดสำหรับผู้ใช้งานในไทย
4. **Security rules**: เลือก **"Start in test mode"** แล้วกด **Enable**
5. ไปที่แท็บ **Rules** ด้านบน แล้วเปลี่ยนเป็นกฎดังนี้:
```json
{
  "rules": {
    "training_evaluations": {
      ".read": true,
      ".write": true
    }
  }
}
```
6. กดปุ่ม **"Publish"** เพื่อบันทึกกฎความปลอดภัย

---

## ขั้นตอนที่ 3: คัดลอก firebaseConfig มาใส่ในโค้ด
1. ที่หน้าภาพรวมโปรเจกต์ (Project Overview) หรือไอคอนรูปฟันเฟืองด้านบนซ้าย เลือก **Project settings**
2. เลื่อนลงมาที่หัวข้อ **Your apps** แล้วคลิกไอคอนรูปเว็บ `</>`
3. ตั้งชื่อแอป เช่น `Training Eval` แล้วกด **Register app**
4. คุณจะเห็นบล็อกตัวแปร `firebaseConfig` หน้าตาประมาณนี้:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "my-training-eval.firebaseapp.com",
  databaseURL: "https://my-training-eval-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "my-training-eval",
  storageBucket: "my-training-eval.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```
5. คัดลอกโค้ดส่วนนี้ไปวางแทนที่ตัวแปร `const firebaseConfig = { ... }` ในทั้ง 2 ไฟล์:
   - `index.html` (ประมาณบรรททัดที่ 113)
   - `dashboard.html` (ประมาณบรรทัดที่ 130)

---

## ขั้นตอนที่ 4: Deploy ขึ้นอินเทอร์เน็ตฟรี (เลือก 1 วิธี)

### ทางเลือก A: ผ่าน GitHub Pages (แนะนำ ง่ายสุด ไม่ต้องติดตั้งโปรแกรม)
1. เข้า [https://github.com](https://github.com) แล้วสร้าง New Repository ตั้งชื่อตามต้องการ (เลือก Public)
2. อัปโหลดไฟล์ `index.html` และ `dashboard.html` ขึ้นไป
3. ไปที่แท็บ **Settings** ของ Repository > เมนูซ้ายเลือก **Pages**
4. ในหัวข้อ **Branch** เลือก `main` หรือ `master` และโฟลเดอร์ `/ (root)` แล้วกด **Save**
5. รอ 1 นาที คุณจะได้รับลิงก์เว็บทันที เช่น:
   - หน้าตอบ: `https://<username>.github.io/<repo-name>/index.html`
   - หน้าแดชบอร์ด: `https://<username>.github.io/<repo-name>/dashboard.html`

### ทางเลือก B: ผ่าน Firebase Hosting (เป็นทางการและโหลดเร็ว)
1. ติดตั้ง Firebase CLI ใน Terminal / Command Prompt:
   ```bash
   npm install -g firebase-tools
   ```
2. ล็อกอินบัญชี Google:
   ```bash
   firebase login
   ```
3. รันคำสั่งสร้างคอนฟิกในโฟลเดอร์ที่มีไฟล์:
   ```bash
   firebase init hosting
   ```
   - เลือก *Use an existing project* (เลือกโปรเจกต์ที่สร้างไว้)
   - *What do you want to use as your public directory?* -> พิมพ์ `.` (จุด) แล้ว Enter
   - *Configure as a single-page app?* -> พิมพ์ `N` แล้ว Enter
4. Deploy ขึ้นอินเทอร์เน็ตทันที:
   ```bash
   firebase deploy
   ```
5. คุณจะได้โดเมนฟรี เช่น `https://my-training-eval.web.app`

---

## คุณสมบัติเด่นของระบบ
1. **ป้องกันการตอบซ้ำ (Duplicate Prevention)**: เมื่อตอบเสร็จแล้วจะบันทึกสถานะลงใน Browser ของเครื่องนั้นทันที
2. **คำนวณและแปลผล 5 ระดับอัตโนมัติ**:
   - 4.51 - 5.00: มากที่สุด (Highest)
   - 3.51 - 4.50: มาก (High)
   - 2.51 - 3.50: ปานกลาง (Moderate)
   - 1.51 - 2.50: น้อย (Low)
   - 1.00 - 1.50: น้อยที่สุด (Lowest)
3. **QR Code ฉายบนจอ**: หน้าจอโปรเจกเตอร์มี QR Code ฝังไว้ให้ผู้เข้าอบรมหยิบมือถือมาสแกนได้ทันที
4. **ดาวน์โหลด CSV ภาษาไทยสมบูรณ์**: ไฟล์ CSV ฝัง UTF-8 BOM ทำให้เปิดในโปรแกรม Excel ได้ทันทีโดยภาษาไทยไม่เพี้ยน
