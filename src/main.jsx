import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BookOpen, CalendarDays, CheckCircle2, ChevronRight, ClipboardList,
  GraduationCap, LayoutDashboard, LogOut, Menu,
  Moon, Search, Settings, ShieldCheck, Sun, Users, X, Bell,
  BarChart3, FileText, Clock3, Pencil, Trash2, Download, RotateCcw, SlidersHorizontal
} from "lucide-react";
import "./styles.css";

const DB_KEY = "maktab_react_db_v1";
const SESSION_KEY = "maktab_react_session_v1";

const seed = {
  users: [
    { id: 1, username: "student1", password: "123456", role: "student", name: "Davlat Baxtiorov", className: "9-A", avatar: "DB" },
    { id: 2, username: "teacher1", password: "123456", role: "teacher", name: "Dilnoza Karimova", subject: "Matematika", avatar: "DK" },
    { id: 3, username: "admin", password: "admin123", role: "admin", name: "Maktab administratori", avatar: "AD" }
  ],
  grades: [
    { id: 1, studentId: 1, subject: "Matematika", grade: 5, date: "2026-09-25" },
    { id: 2, studentId: 1, subject: "Informatika", grade: 5, date: "2026-09-24" },
    { id: 3, studentId: 1, subject: "Ona tili", grade: 4, date: "2026-09-23" },
    { id: 4, studentId: 1, subject: "Ingliz tili", grade: 5, date: "2026-09-22" },
    { id: 5, studentId: 1, subject: "Tarix", grade: 4, date: "2026-09-20" }
  ],
  homework: [
    { id: 1, subject: "Matematika", title: "Kvadrat tenglamalar", due: "2026-09-29", status: "Jarayonda" },
    { id: 2, subject: "Informatika", title: "React komponentlari", due: "2026-09-30", status: "Yangi" },
    { id: 3, subject: "Ingliz tili", title: "Unit 5 — Vocabulary", due: "2026-10-01", status: "Yangi" }
  ],
  attendance: [
    { id: 1, studentId: 1, date: "2026-09-25", status: "Bor" },
    { id: 2, studentId: 1, date: "2026-09-24", status: "Bor" },
    { id: 3, studentId: 1, date: "2026-09-23", status: "Sababli" },
    { id: 4, studentId: 1, date: "2026-09-22", status: "Bor" }
  ],
  announcements: [
    { id: 1, title: "Yangi o‘quv haftasi", text: "Darslar odatdagi jadval asosida davom etadi.", date: "25 sentabr" },
    { id: 2, title: "Ota-onalar yig‘ilishi", text: "Yig‘ilish juma kuni soat 17:00 da majlislar zalida.", date: "24 sentabr" }
  ],
  messages: [
    { id: 1, withUserId: 3, from: "them", text: "Assalomu alaykum! Sizga kerakli hujjatlarni yubordim.", time: "09:14" },
    { id: 2, withUserId: 3, from: "me", text: "Vaalaykum assalom, rahmat, ko‘rib chiqaman.", time: "09:20" },
    { id: 3, withUserId: 2, from: "them", text: "Ertangi darsga tayyorgarlik ko‘ring, mavzu takrorlanadi.", time: "Kecha" }
  ],
  timetable: [
    { id: 1, teacherId: 2, day: "Dushanba", start: "08:30", end: "09:15", className: "9-A" },
    { id: 2, teacherId: 2, day: "Dushanba", start: "10:20", end: "11:05", className: "9-B" },
    { id: 3, teacherId: 2, day: "Seshanba", start: "09:25", end: "10:10", className: "9-A" },
    { id: 4, teacherId: 2, day: "Chorshanba", start: "08:30", end: "09:15", className: "9-B" },
    { id: 5, teacherId: 2, day: "Payshanba", start: "11:20", end: "12:05", className: "9-A" },
    { id: 6, teacherId: 2, day: "Juma", start: "09:25", end: "10:10", className: "9-B" }
  ]
};

function loadDB() {
  try {
    const saved = localStorage.getItem(DB_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  localStorage.setItem(DB_KEY, JSON.stringify(seed));
  return seed;
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function App() {
  const [db, setDb] = useState(loadDB);
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
  });
  const [theme, setTheme] = useState(() => localStorage.getItem("maktab_theme") || "light");

  useEffect(() => saveDB(db), [db]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("maktab_theme", theme);
  }, [theme]);

  const login = (username, password) => {
    const user = db.users.find(u => u.username === username && u.password === password);
    if (!user) return false;
    const safeUser = { ...user };
    delete safeUser.password;
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
    setSession(safeUser);
    return true;
  };

  const register = ({ fullName, username, password, extra }) => {
    const role = "student";
    const name = fullName.trim();
    const uname = username.trim();
    if (!name || !uname || !password) {
      return { ok: false, error: "Barcha majburiy maydonlarni to‘ldiring." };
    }
    if (password.length < 4) {
      return { ok: false, error: "Parol kamida 4 belgidan iborat bo‘lsin." };
    }
    if (db.users.some(u => u.username.toLowerCase() === uname.toLowerCase())) {
      return { ok: false, error: "Bu login allaqachon band. Boshqa login tanlang." };
    }
    const initials = name.split(/\s+/).map(w => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
    const newUser = {
      id: Date.now(),
      username: uname,
      password,
      role,
      name,
      avatar: initials || "US",
      ...(role === "student" ? { className: extra.trim() || "Belgilanmagan" } : {}),
      ...(role === "teacher" ? { subject: extra.trim() || "Belgilanmagan" } : {})
    };
    setDb(prev => ({ ...prev, users: [...prev.users, newUser] }));
    const safeUser = { ...newUser };
    delete safeUser.password;
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
    setSession(safeUser);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  const updateProfile = ({ name, avatar, currentPassword, newPassword }) => {
    const real = db.users.find(u => u.id === session.id);
    if (!real) return { ok: false, error: "Foydalanuvchi topilmadi." };
    if (newPassword) {
      if (!currentPassword || real.password !== currentPassword) {
        return { ok: false, error: "Joriy parol noto‘g‘ri kiritildi." };
      }
      if (newPassword.length < 4) {
        return { ok: false, error: "Yangi parol kamida 4 belgidan iborat bo‘lsin." };
      }
    }
    const updated = {
      ...real,
      name: name?.trim() || real.name,
      avatar: avatar?.trim() ? avatar.trim().slice(0, 2).toUpperCase() : real.avatar,
      ...(newPassword ? { password: newPassword } : {})
    };
    setDb(prev => ({ ...prev, users: prev.users.map(u => u.id === real.id ? updated : u) }));
    const safeUser = { ...updated };
    delete safeUser.password;
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
    setSession(safeUser);
    return { ok: true };
  };

  if (!session) {
    return <AuthPage onLogin={login} onRegister={register} theme={theme} setTheme={setTheme} />;
  }

  return (
    <Dashboard
      user={session}
      db={db}
      setDb={setDb}
      logout={logout}
      theme={theme}
      setTheme={setTheme}
      updateProfile={updateProfile}
    />
  );
}

function AuthPage({ onLogin, onRegister, theme, setTheme }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirm, setConfirm] = useState("");
  const [extra, setExtra] = useState("");
  const [error, setError] = useState("");

  const switchMode = (m) => {
    setMode(m);
    setError("");
    setUsername(""); setPassword(""); setFullName(""); setConfirm(""); setExtra("");
  };

  const submitLogin = (e) => {
    e.preventDefault();
    if (!username.trim() || !password) { setError("Login va parolni kiriting."); return; }
    if (!onLogin(username.trim(), password)) {
      setError("Login yoki parol noto‘g‘ri.");
    }
  };

  const submitRegister = (e) => {
    e.preventDefault();
    if (password !== confirm) { setError("Kiritilgan parollar bir-biriga mos emas."); return; }
    const res = onRegister({ fullName, username, password, extra });
    if (!res.ok) setError(res.error);
  };

  return (
    <div className="login-page">
      <div className="notebook-lines" aria-hidden="true" />
      <header className="login-top">
        <div />
        <button className="icon-btn ghost login-theme-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Mavzuni almashtirish">
          {theme === "dark" ? <Sun size={19}/> : <Moon size={19}/>}
        </button>
      </header>

      <div className="login-decor login-decor-one" aria-hidden="true" />
      <div className="login-decor login-decor-two" aria-hidden="true" />
      <div className="login-grid-glow" aria-hidden="true" />

      <main className="login-card">
        <div className="login-copy">
          <div className="eyebrow"><ShieldCheck size={15}/> Yagona ta’lim tizimi</div>
          <h1>Maktab hayotingiz,<br/><span>bitta joyda jamlangan.</span></h1>
          <p>Baholar, uy vazifalari, davomat va maktab yangiliklarini o‘zingiz uchun qulay tarzda kuzating — o‘zingiz tanlagan login va parol bilan.</p>
          <div className="feature-row">
            <div><CheckCircle2 size={17}/><span>O‘zingiz ro‘yxatdan o‘tasiz</span></div>
            <div><CheckCircle2 size={17}/><span>Ma’lumotlar qurilmangizda saqlanadi</span></div>
          </div>
        </div>

        <div className="auth-panel">
          <div className="auth-logo-box">
            <img src="/dmaktab-mark.png" alt="Dmaktab logotipi" />
          </div>
          <div className="auth-tabs">
            <button type="button" className={mode === "login" ? "active" : ""} onClick={() => switchMode("login")}>Kirish</button>
            <button type="button" className={mode === "register" ? "active" : ""} onClick={() => switchMode("register")}>Ro‘yxatdan o‘tish</button>
          </div>

          {mode === "login" ? (
            <form className="login-form" onSubmit={submitLogin}>
              <div className="form-title"><h2>Tizimga kirish</h2><p>Login va parolingizni kiriting</p></div>
              <label>Login<input value={username} onChange={e => setUsername(e.target.value)} placeholder="Loginingizni kiriting" autoComplete="username"/></label>
              <label>Parol<input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Parolingizni kiriting" autoComplete="current-password"/></label>
              {error && <div className="error-box">{error}</div>}
              <button className="primary-btn full" type="submit">Kirish <ChevronRight size={18}/></button>
            </form>
          ) : (
            <form className="login-form" onSubmit={submitRegister}>
              <div className="form-title"><h2>Yangi hisob yaratish</h2><p>O‘quvchi sifatida ro‘yxatdan o‘ting</p></div>
              <label>To‘liq ism<input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Ism Familiya"/></label>
              <label>Sinf (ixtiyoriy)<input value={extra} onChange={e => setExtra(e.target.value)} placeholder="Masalan: 9-A"/></label>
              <label>Login<input value={username} onChange={e => setUsername(e.target.value)} placeholder="O‘zingiz uchun login o‘ylab toping" autoComplete="username"/></label>
              <label>Parol<input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Kamida 4 belgi" autoComplete="new-password"/></label>
              <label>Parolni tasdiqlang<input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Parolni qayta kiriting" autoComplete="new-password"/></label>
              {error && <div className="error-box">{error}</div>}
              <button className="primary-btn full" type="submit">Hisob yaratish <ChevronRight size={18}/></button>
            </form>
          )}
          {mode === "register" && <p className="text-link" style={{cursor:"default"}}>O‘qituvchi yoki administrator hisobini maktab administratori yaratadi.</p>}
        </div>
      </main>
    </div>
  );
}

function Dashboard({ user, db, setDb, logout, theme, setTheme, updateProfile }) {
  const [page, setPage] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifSeen, setNotifSeen] = useState(false);

  const menus = user.role === "student"
    ? [
      ["home", "Bosh sahifa", LayoutDashboard],
      ["grades", "Baholar", BarChart3],
      ["homework", "Uy vazifalari", ClipboardList],
      ["attendance", "Davomat", CheckCircle2],
      ["schedule", "Dars jadvali", CalendarDays],
      ["announcements", "E’lonlar", Bell]
    ]
    : user.role === "teacher"
    ? [
      ["home", "Bosh sahifa", LayoutDashboard],
      ["grades", "Baholar", BarChart3],
      ["classes", "Sinflar", Users],
      ["homework", "Vazifalar", ClipboardList],
      ["schedule", "Dars jadvali", CalendarDays],
      ["announcements", "E’lonlar", Bell]
    ]
    : [
      ["home", "Bosh sahifa", LayoutDashboard],
      ["users", "Foydalanuvchilar", Users],
      ["announcements", "E’lonlar", Bell],
      ["reports", "Hisobotlar", FileText],
      ["settings", "Sozlamalar", Settings]
    ];

  const content = useMemo(() => {
    if (page === "home") return <Home user={user} db={db} setPage={setPage}/>;
    if (page === "grades") return <Grades user={user} db={db} setDb={setDb} query={query}/>;
    if (page === "homework") return <Homework db={db} setDb={setDb} user={user} query={query}/>;
    if (page === "attendance") return <Attendance db={db}/>;
    if (page === "schedule") return <Schedule user={user} db={db}/>;
    if (page === "classes") return <Classes db={db} setDb={setDb} user={user} query={query}/>;
    if (page === "users") return <UsersPage db={db} setDb={setDb} query={query} currentUser={user}/>;
    if (page === "announcements") return <Announcements db={db} setDb={setDb} query={query} user={user}/>;
    if (page === "profile") return <Profile user={user} updateProfile={updateProfile}/>;
    if (page === "reports") return <Reports db={db}/>;
    return <SettingsPage theme={theme} setTheme={setTheme} db={db} setDb={setDb}/>;
  }, [page, user, db, setDb, theme, setTheme, query, updateProfile]);

  const toggleNotif = () => { setNotifOpen(o => !o); setNotifSeen(true); };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="side-head">
          <div className="brand brand-logo-wrap">
            <img className="brand-logo" src="/dmaktab-mark.png" alt="Dmaktab" />
          </div>
          <button className="icon-btn only-mobile" onClick={() => setMobileOpen(false)}><X size={19}/></button>
        </div>

        <button className="profile-mini" onClick={() => {setPage("profile"); setMobileOpen(false)}}>
          <div className="avatar">{user.avatar}</div>
          <div><b>{user.name}</b><span>{user.role === "student" ? user.className : user.role === "teacher" ? user.subject : "Administrator"}</span></div>
        </button>

        <div className="menu-title">ASOSIY</div>
        <nav>
          {menus.map(([id, label, Icon]) => (
            <button key={id} className={page === id ? "selected" : ""} onClick={() => {setPage(id); setMobileOpen(false)}}>
              <Icon size={18}/><span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="side-bottom">
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}><Moon size={18}/><span>{theme === "dark" ? "Yorug‘ rejim" : "Tungi rejim"}</span></button>
          <button className="logout" onClick={logout}><LogOut size={18}/><span>Chiqish</span></button>
        </div>
      </aside>

      {mobileOpen && <div className="overlay" onClick={() => setMobileOpen(false)} />}

      <section className="main-area">
        <header className="topbar">
          <button className="icon-btn only-mobile" onClick={() => setMobileOpen(true)}><Menu size={20}/></button>
          <div className="search"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Qidirish..."/></div>
          <div className="top-actions">
            <div className="notif-wrap">
              <button className="icon-btn" onClick={toggleNotif}><Bell size={19}/>{!notifSeen && db.announcements.length > 0 && <i />}</button>
              {notifOpen && <>
                <div className="notif-backdrop" onClick={() => setNotifOpen(false)} />
                <div className="notif-panel">
                  <div className="notif-head">Bildirishnomalar</div>
                  {db.announcements.length === 0 && <div className="notif-empty">Hozircha bildirishnoma yo‘q.</div>}
                  {db.announcements.slice(0, 6).map(a => (
                    <div className="notif-item" key={a.id}>
                      <div className="ann-icon"><Bell size={15}/></div>
                      <div><b>{a.title}</b><span>{a.date}</span></div>
                    </div>
                  ))}
                </div>
              </>}
            </div>
            <div className="top-user"><div className="avatar small">{user.avatar}</div><span>{user.name.split(" ")[0]}</span></div>
          </div>
        </header>
        <main className="content">{content}</main>
      </section>
    </div>
  );
}

function PageHead({ eyebrow, title, text, action }) {
  return <div className="page-head"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{text}</p></div>{action}</div>
}

function Home({ user, db, setPage }) {
  const isStudent = user.role === "student";
  const grades = db.grades.filter(g => isStudent ? g.studentId === user.id : true);
  const avg = grades.length ? (grades.reduce((a,b) => a+b.grade, 0) / grades.length).toFixed(1) : "0";
  return <>
    <PageHead eyebrow="Xush kelibsiz 👋" title={`Salom, ${user.name.split(" ")[0]}!`} text={isStudent ? "Bugungi o‘qishlaringizni shu yerdan kuzating." : "Maktab tizimidagi asosiy ma’lumotlar bir joyda."} />
    <div className="hero-banner">
      <div><span className="banner-label">BUGUN</span><h2>Bilim — kelajak sari<br/>eng kuchli qadam.</h2><p>Vazifalarni tekshiring va kuningizni rejalashtiring.</p></div>
      <div className="banner-art"><BookOpen size={86}/></div>
    </div>
    <div className="stats-grid">
      {user.role === "student" ? <>
        <Stat icon={BarChart3} title="O‘rtacha baho" value={avg} meta="5 ballik tizim"/>
        <Stat icon={CheckCircle2} title="Davomat" value="94%" meta="Shu oy uchun"/>
        <Stat icon={ClipboardList} title="Vazifalar" value={db.homework.length} meta="Topshiriq mavjud"/>
        <Stat icon={CalendarDays} title="Bugungi dars" value="5 ta" meta="Dars jadvali"/>
      </> : user.role === "teacher" ? <>
        <Stat icon={Users} title="O‘quvchilar" value="28" meta="Sizning sinflaringiz"/>
        <Stat icon="grade" title="Tekshirilmagan" value="7" meta="Ishlar"/>
        <Stat icon={ClipboardList} title="Vazifalar" value={db.homework.length} meta="Faol topshiriqlar"/>
        <Stat icon={CalendarDays} title="Bugungi dars" value="4 ta" meta="Dars jadvali"/>
      </> : <>
        <Stat icon={Users} title="O‘quvchilar" value="486" meta="+12 bu oy"/>
        <Stat icon={GraduationCap} title="O‘qituvchilar" value="38" meta="Faol xodimlar"/>
        <Stat icon={BarChart3} title="Davomat" value="96%" meta="Bugungi holat"/>
        <Stat icon={Bell} title="E’lonlar" value={db.announcements.length} meta="Faol e’lonlar"/>
      </>}
    </div>
    <div className="two-col">
      <section className="panel">
        <PanelTitle title={user.role === "student" ? "So‘nggi baholar" : "So‘nggi faollik"} action="Barchasi" onClick={() => setPage(user.role === "student" ? "grades" : user.role === "teacher" ? "classes" : "users")}/>
        {user.role === "student" ? <div className="grade-list">{grades.slice(0,5).map(g => <div className="grade-row" key={g.id}><div className="subject-dot">{g.subject.slice(0,1)}</div><div className="grow"><b>{g.subject}</b><span>{g.date}</span></div><strong className={`grade g${g.grade}`}>{g.grade}</strong></div>)}</div> : <Activity db={db}/>}
      </section>
      <section className="panel">
        <PanelTitle title="Maktab e’lonlari" action="Barchasi" onClick={() => setPage("announcements")}/>
        <div className="announcement-list">{db.announcements.map(a => <div className="announcement" key={a.id}><div className="ann-icon"><Bell size={17}/></div><div><b>{a.title}</b><p>{a.text}</p><span>{a.date}</span></div></div>)}</div>
      </section>
    </div>
  </>;
}

function Stat({icon: Icon, title, value, meta}) {
  return <div className="stat-card"><div className="stat-icon">{Icon === "grade" ? <BarChart3 size={20}/> : <Icon size={20}/>}</div><span>{title}</span><strong>{value}</strong><small>{meta}</small></div>
}

function PanelTitle({title, action, onClick}) {
  return <div className="panel-title"><h3>{title}</h3><button onClick={onClick}>{action} <ChevronRight size={15}/></button></div>
}

function Activity({db}) {
  return <div className="activity-list">
    {db.grades.slice(-5).reverse().map(g => <div className="activity" key={g.id}><div className="avatar mini">BA</div><div><b>Yangi baho qo‘yildi</b><span>{g.subject} — {g.grade} ball</span></div><Clock3 size={15}/></div>)}
  </div>
}

function Grades({user, db, setDb, query}) {
  const isTeacher = user.role === "teacher";
  const students = db.users.filter(u => u.role === "student");
  const defaultSubjects = ["Matematika", "Informatika", "Ona tili", "Ingliz tili", "Tarix"];
  const subjects = Array.from(new Set([...defaultSubjects, ...db.grades.map(g => g.subject).filter(Boolean)]));
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  const nameOf = (id) => db.users.find(u => u.id === id)?.name || "Noma’lum";
  const visibleStudents = students.filter(s => {
    if (!query?.trim()) return true;
    return s.name.toLowerCase().includes(query.trim().toLowerCase());
  });

  const latestGrade = (studentId, subject) => {
    const list = db.grades
      .filter(g => Number(g.studentId) === Number(studentId) && g.subject === subject)
      .sort((a, b) => String(b.date).localeCompare(String(a.date)));
    return list[0]?.grade ?? "-";
  };

  const attendanceCode = (studentId) => {
    const record = db.attendance.find(a => Number(a.studentId) === Number(studentId) && a.date === selectedDate);
    if (!record) return "-";
    if (record.status === "Bor") return "+";
    if (record.status === "Sababli") return "SB";
    return "-";
  };

  const setAttendance = (studentId) => {
    if (!isTeacher) return;
    const current = attendanceCode(studentId);
    const next = current === "+" ? "-" : current === "-" ? "SB" : "+";
    const status = next === "+" ? "Bor" : next === "SB" ? "Sababli" : "Kelmagan";
    const existing = db.attendance.find(a => Number(a.studentId) === Number(studentId) && a.date === selectedDate);
    let attendance = [...db.attendance];
    if (existing) {
      attendance = attendance.map(a => a.id === existing.id ? { ...a, status } : a);
    } else {
      attendance.push({ id: Date.now() + Number(studentId), studentId: Number(studentId), date: selectedDate, status });
    }
    setDb({ ...db, attendance });
  };

  const setGrade = (studentId, subject) => {
    if (!isTeacher || subject !== user.subject) return;
    const current = latestGrade(studentId, subject);
    const next = current === "-" ? 5 : Number(current) === 5 ? 4 : Number(current) === 4 ? 3 : Number(current) === 3 ? 2 : Number(current) === 2 ? 1 : "-";
    const existing = db.grades.find(g => Number(g.studentId) === Number(studentId) && g.subject === subject);
    let grades = [...db.grades];
    if (next === "-") {
      if (existing) grades = grades.filter(g => g.id !== existing.id);
    } else if (existing) {
      grades = grades.map(g => g.id === existing.id ? { ...g, grade: next, date: selectedDate } : g);
    } else {
      grades.push({ id: Date.now() + Number(studentId), studentId: Number(studentId), subject, grade: next, date: selectedDate });
    }
    setDb({ ...db, grades });
  };

  const shownStudents = user.role === "student" ? students.filter(s => s.id === user.id) : visibleStudents;
  const shortSubject = (subject) => ({
    "Matematika": "Mat.",
    "Informatika": "Inf.",
    "Ona tili": "Ona t.",
    "Ingliz tili": "Ing.",
    "Tarix": "Tarix"
  }[subject] || subject.slice(0, 5) + ".");

  return <>
    <PageHead
      eyebrow="O‘quv jarayoni"
      title="Baholash jurnali"
      text="O‘quvchilar bir qatorda, davomat va baholar ixcham kataklarda ko‘rsatiladi."
    />

    <div className="grade-toolbar panel">
      <div>
        <b>Jurnal</b>
        <span>Davomat: <strong>+</strong> kelgan · <strong>-</strong> kelmagan · <strong>SB</strong> sababli</span>
      </div>
      <label>Sana<input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} /></label>
    </div>

    <section className="panel journal-panel">
      <div className="journal-head">
        <div><h3>O‘quvchilar ro‘yxati</h3><p>Bahosi yo‘q katakka <b>-</b> qo‘yiladi.</p></div>
        {isTeacher && <span className="pill blue">Katakni bosing</span>}
      </div>
      <div className="grade-journal-scroll">
        <table className="compact-journal">
          <thead>
            <tr>
              <th className="student-col">O‘quvchi</th>
              <th className="attendance-col">Dav.</th>
              {subjects.map(subject => <th key={subject} title={subject}>{shortSubject(subject)}</th>)}
            </tr>
          </thead>
          <tbody>
            {shownStudents.length === 0 && <tr><td colSpan={subjects.length + 2} className="empty-row">O‘quvchi topilmadi.</td></tr>}
            {shownStudents.map(student => (
              <tr key={student.id}>
                <td className="student-cell"><b>{student.name}</b><span>{student.className || ""}</span></td>
                <td>
                  <button
                    className={`journal-cell attendance-cell ${attendanceCode(student.id) === "+" ? "is-present" : attendanceCode(student.id) === "SB" ? "is-excused" : attendanceCode(student.id) === "-" ? "is-absent" : "is-empty"}`}
                    onClick={() => setAttendance(student.id)}
                    title={isTeacher ? "Bosib: + → - → SB → +" : "Davomat"}
                  >{attendanceCode(student.id)}</button>
                </td>
                {subjects.map(subject => {
                  const value = latestGrade(student.id, subject);
                  const editable = isTeacher && subject === user.subject;
                  return <td key={subject}>
                    <button
                      className={`journal-cell grade-cell ${value !== "-" ? `grade-value-${value}` : "is-empty"} ${editable ? "editable" : ""}`}
                      onClick={() => setGrade(student.id, subject)}
                      disabled={!editable}
                      title={editable ? "Bosib bahoni o‘zgartiring" : subject}
                    >{value}</button>
                  </td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <div className="journal-legend panel">
      <span><b>+</b> Kelgan</span>
      <span><b>-</b> Kelmagan</span>
      <span><b>SB</b> Sababli</span>
      <span><b>5 / 4 / 3 / 2 / 1</b> Baho</span>
      <span><b>-</b> Baho qo‘yilmagan</span>
      {isTeacher && <small>O‘zingizga biriktirilgan fan ustunidagi baho kataklarini bosib o‘zgartirasiz.</small>}
    </div>
  </>;
}
function Homework({db, setDb, user, query}) {
  let items = db.homework;
  if (query?.trim()) {
    const q = query.trim().toLowerCase();
    items = items.filter(h => h.title.toLowerCase().includes(q) || h.subject.toLowerCase().includes(q));
  }
  const advance = (h) => {
    const nextStatus = h.status === "Yangi" ? "Jarayonda" : h.status === "Jarayonda" ? "Bajarildi" : "Bajarildi";
    setDb({...db, homework: db.homework.map(x => x.id === h.id ? {...x, status: nextStatus} : x)});
  };
  const pillClass = (status) => status === "Bajarildi" ? "success" : status === "Jarayonda" ? "warning" : "blue";
  const buttonLabel = (status) => status === "Yangi" ? "Boshlash" : status === "Jarayonda" ? "Bajarildi deb belgilash" : "Bajarildi";
  return <>
    <PageHead eyebrow="Topshiriqlar" title="Uy vazifalari" text="Barcha faol topshiriqlar va ularning muddatlari."/>
    {items.length === 0 && <section className="panel"><p style={{margin:0,color:"var(--muted)",fontSize:13}}>Hech narsa topilmadi.</p></section>}
    <div className="cards-grid">{items.map(h=>
      <div className="task-card" key={h.id}>
        <div className="task-top"><span className="subject-tag">{h.subject}</span><span className={`pill ${pillClass(h.status)}`}>{h.status}</span></div>
        <h3>{h.title}</h3>
        <p><CalendarDays size={15}/> Topshirish: <b>{h.due}</b></p>
        <button className="outline-btn" onClick={() => advance(h)} disabled={h.status === "Bajarildi"}>
          {buttonLabel(h.status)} {h.status !== "Bajarildi" && <ChevronRight size={15}/>}
        </button>
      </div>
    )}</div>
  </>;
}

function Attendance({db}) {
  return <><PageHead eyebrow="Nazorat" title="Davomat" text="Darslarda qatnashish holatingiz."/><section className="panel attendance-card"><div className="attendance-score"><div className="score-ring">94<span>%</span></div><div><h2>Davomat yaxshi</h2><p>So‘nggi darslarda qatnashish holati.</p></div></div><div className="attendance-list">{db.attendance.map(a=><div key={a.id}><span>{a.date}</span><b className={a.status === "Bor" ? "present" : "excused"}>{a.status}</b></div>)}</div></section></>
}

function Schedule({user, db}) {
  const days = ["Dushanba","Seshanba","Chorshanba","Payshanba","Juma"];

  if (user?.role === "teacher") {
    const lessons = (db?.timetable || []).filter(t => t.teacherId === user.id);
    return <>
      <PageHead eyebrow="Haftalik reja" title="Dars jadvali" text={`${user.subject} fanidan sizning darslaringiz: qaysi kuni, soatda va qaysi sinfda bo‘lishi.`}/>
      <div className="schedule-grid">
        {days.map((d, i) => {
          const dayLessons = lessons.filter(l => l.day === d).sort((a, b) => a.start.localeCompare(b.start));
          return <div className="day-card" key={d}>
            <div className="day-head"><b>{d}</b><span>{i + 1}-kun</span></div>
            {dayLessons.length === 0 && <p style={{color: "var(--muted)", fontSize: 12}}>Bu kuni darsingiz yo‘q.</p>}
            {dayLessons.map(l => (
              <div className="lesson" key={l.id}>
                <span>{l.start}</span>
                <div><b>{l.className} sinfi</b><small>{l.start} — {l.end}</small></div>
              </div>
            ))}
          </div>;
        })}
      </div>
    </>;
  }

  const lessons = [["Matematika","08:30","09:15"],["Informatika","09:25","10:10"],["Ingliz tili","10:20","11:05"],["Tarix","11:20","12:05"],["Jismoniy tarbiya","12:15","13:00"]];
  return <><PageHead eyebrow="Haftalik reja" title="Dars jadvali" text="Haftalik darslaringiz."/><div className="schedule-grid">{days.map((d,i)=><div className="day-card" key={d}><div className="day-head"><b>{d}</b><span>{i+1}-kun</span></div>{lessons.slice(0, i===2?4:5).map((l,j)=><div className="lesson" key={j}><span>{l[1]}</span><div><b>{l[0]}</b><small>{l[1]} — {l[2]}</small></div></div>)}</div>)}</div></>
}

function Classes({db, setDb, user, query}) {
  const [selected, setSelected] = useState(null);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const classOf = (u) => u.className || "Belgilanmagan";
  let classNames = Array.from(new Set(db.users.filter(u => u.role === "student").map(classOf))).sort();

  const avgOf = (id) => {
    const g = db.grades.filter(x => x.studentId === id && (!user.subject || x.subject === user.subject));
    return g.length ? (g.reduce((a, b) => a + b.grade, 0) / g.length).toFixed(1) : "—";
  };

  if (selected) {
    let students = db.users.filter(u => u.role === "student" && classOf(u) === selected);
    const statusOf = (studentId) => db.attendance.find(a => a.studentId === studentId && a.date === date && a.subject === user.subject)?.status || null;

    const mark = (studentId, status) => {
      setDb(prev => {
        const exists = prev.attendance.find(a => a.studentId === studentId && a.date === date && a.subject === user.subject);
        if (exists) {
          return { ...prev, attendance: prev.attendance.map(a => a === exists ? { ...a, status } : a) };
        }
        return { ...prev, attendance: [...prev.attendance, { id: Date.now() + studentId, studentId, date, status, subject: user.subject, className: selected }] };
      });
    };

    return <>
      <PageHead eyebrow="Sinf" title={`${selected} sinfi`} text={`${user.subject} fanidan o‘quvchilar va davomat.`} action={<button className="outline-btn" onClick={() => setSelected(null)}>← Sinflarga qaytish</button>} />
      <div className="inline-form">
        <label>Sana<input type="date" value={date} onChange={e => setDate(e.target.value)} /></label>
        <span>Davomatni shu sana uchun belgilang.</span>
      </div>
      <section className="panel table-panel"><div className="table-wrap"><table><thead><tr><th>O‘quvchi</th><th>O‘rtacha ({user.subject})</th><th>Davomat</th></tr></thead><tbody>
        {students.length === 0 && <tr><td colSpan={3} className="empty-row">Bu sinfda o‘quvchi topilmadi.</td></tr>}
        {students.map(s => {
          const status = statusOf(s.id);
          return <tr key={s.id}>
            <td><div className="person-cell"><div className="avatar mini">{s.avatar}</div><b>{s.name}</b></div></td>
            <td>{avgOf(s.id)}</td>
            <td>
              <div style={{ display: "flex", gap: 6 }}>
                <button type="button" className={`pill success`} style={{ opacity: status === "Bor" ? 1 : 0.4, cursor: "pointer" }} onClick={() => mark(s.id, "Bor")}>Bor</button>
                <button type="button" className={`pill warning`} style={{ opacity: status === "Sababli" ? 1 : 0.4, cursor: "pointer" }} onClick={() => mark(s.id, "Sababli")}>Sababli</button>
                <button type="button" className={`pill danger`} style={{ opacity: status === "Yo‘q" ? 1 : 0.4, cursor: "pointer" }} onClick={() => mark(s.id, "Yo‘q")}>Yo‘q</button>
              </div>
            </td>
          </tr>;
        })}
      </tbody></table></div></section>
    </>;
  }

  if (query?.trim()) {
    const q = query.trim().toLowerCase();
    classNames = classNames.filter(c => c.toLowerCase().includes(q));
  }

  return <>
    <PageHead eyebrow="Sinf nazorati" title="Sinflar" text={`${user.subject} fanidan dars beradigan sinflaringiz. Sinfni tanlab, o‘quvchilar va davomatni ko‘ring.`} />
    <div className="cards-grid">
      {classNames.length === 0 && <p style={{ color: "var(--muted)", fontSize: 13 }}>Hech narsa topilmadi.</p>}
      {classNames.map(c => {
        const count = db.users.filter(u => u.role === "student" && classOf(u) === c).length;
        return <div className="task-card" key={c} style={{ cursor: "pointer" }} onClick={() => setSelected(c)}>
          <div className="task-top"><span className="subject-tag">{count} o‘quvchi</span></div>
          <h3>{c}</h3>
          <p><Users size={15} /> Sinfga kirish</p>
          <button className="outline-btn" onClick={() => setSelected(c)}>Kirish <ChevronRight size={15} /></button>
        </div>;
      })}
    </div>
  </>;
}

function UsersPage({db, setDb, query}) {
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [role, setRole] = useState("student");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("Erkak");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [fatherPhone, setFatherPhone] = useState("");
  const [motherPhone, setMotherPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [className, setClassName] = useState("");
  const [newClass, setNewClass] = useState(false);
  const [customClass, setCustomClass] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  let users = db.users;
  if (query?.trim()) {
    const q = query.trim().toLowerCase();
    users = users.filter(u => u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q) || u.role.toLowerCase().includes(q));
  }

  const existingClasses = Array.from(new Set(db.users.filter(u => u.role === "student" && u.className).map(u => u.className))).sort();

  const reset = () => {
    setEditId(null); setRole("student"); setFirstName(""); setLastName(""); setGender("Erkak"); setAddress(""); setPhone("");
    setFatherPhone(""); setMotherPhone(""); setSubject(""); setClassName(existingClasses[0] || "");
    setNewClass(false); setCustomClass(""); setUsername(""); setPassword(""); setError("");
  };

  const openAdd = () => { reset(); setShowModal(true); };

  const openEdit = (u) => {
    const parts = (u.name || "").trim().split(/\s+/);
    setEditId(u.id);
    setRole(u.role);
    setFirstName(parts[0] || "");
    setLastName(parts.slice(1).join(" ") || "");
    setGender(u.gender || "Erkak");
    setAddress(u.address || "");
    setPhone(u.phone || "");
    setFatherPhone(u.fatherPhone || "");
    setMotherPhone(u.motherPhone || "");
    setSubject(u.subject || "");
    const isKnownClass = u.className && existingClasses.includes(u.className);
    setNewClass(u.role === "student" && !isKnownClass);
    setClassName(isKnownClass ? u.className : (existingClasses[0] || ""));
    setCustomClass(!isKnownClass ? (u.className || "") : "");
    setUsername(u.username || "");
    setPassword(u.password || "");
    setError("");
    setShowModal(true);
  };

  const removeUser = (u) => {
    if (!window.confirm(`${u.name} (${u.username}) o‘chirilsinmi?`)) return;
    setDb({...db, users: db.users.filter(x => x.id !== u.id)});
  };

  const submit = (e) => {
    e.preventDefault();
    const first = firstName.trim(), last = lastName.trim();
    const name = `${first} ${last}`.trim();
    const uname = username.trim();
    const finalClass = newClass ? customClass.trim() : className;

    if (!first || !last || !uname || !password) { setError("Ism, familiya, login va parolni to‘ldiring."); return; }
    if (password.length < 4) { setError("Parol kamida 4 belgidan iborat bo‘lsin."); return; }
    if (db.users.some(u => u.username.toLowerCase() === uname.toLowerCase() && u.id !== editId)) { setError("Bu login allaqachon band."); return; }
    if (role === "student" && !finalClass) { setError("Sinfni tanlang yoki yangi sinf nomini kiriting."); return; }
    if (role === "teacher" && !subject.trim()) { setError("Fan nomini kiriting."); return; }

    const initials = name.split(/\s+/).map(w => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
    const fields = {
      username: uname, password, role, name, avatar: initials || "US",
      gender, address: address.trim(), phone: phone.trim(),
      className: undefined, subject: undefined, fatherPhone: undefined, motherPhone: undefined,
      ...(role === "student" ? { className: finalClass, fatherPhone: fatherPhone.trim(), motherPhone: motherPhone.trim() } : {}),
      ...(role === "teacher" ? { subject: subject.trim() } : {})
    };

    if (editId) {
      setDb({...db, users: db.users.map(u => u.id === editId ? { ...u, ...fields } : u)});
    } else {
      setDb({...db, users: [...db.users, { id: Date.now(), ...fields }]});
    }
    setShowModal(false);
    reset();
  };

  return <>
    <PageHead eyebrow="Administrator" title="Foydalanuvchilar" text="Tizimdagi o‘quvchi, o‘qituvchi va adminlar." action={<button className="primary-btn" onClick={openAdd}>+ Odam qo‘shish</button>}/>

    {showModal && (
      <div className="modal-overlay" onClick={() => setShowModal(false)}>
        <div className="modal-box" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setShowModal(false)}><X size={16}/></button>
          <div className="modal-head"><h2>{editId ? "Ma’lumotlarni o‘zgartirish" : "Yangi odam qo‘shish"}</h2><p>{editId ? "Kerakli maydonlarni tahrirlang." : "Ma’lumotlarni to‘ldiring va login-parol bering."}</p></div>

          <div className="role-tabs">
            <button type="button" className={role === "student" ? "active" : ""} onClick={() => setRole("student")}>O‘quvchi</button>
            <button type="button" className={role === "teacher" ? "active" : ""} onClick={() => setRole("teacher")}>O‘qituvchi</button>
            <button type="button" className={role === "admin" ? "active" : ""} onClick={() => setRole("admin")}>Admin</button>
          </div>

          <form onSubmit={submit}>
            <div className="form-grid-2">
              <label>Ism<input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Ism"/></label>
              <label>Familiya<input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Familiya"/></label>

              <label>Jins
                <div className="gender-toggle">
                  <button type="button" className={gender === "Erkak" ? "active" : ""} onClick={() => setGender("Erkak")}>Erkak</button>
                  <button type="button" className={gender === "Ayol" ? "active" : ""} onClick={() => setGender("Ayol")}>Ayol</button>
                </div>
              </label>
              <label>Telefon raqami<input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+998 90 123 45 67"/></label>

              {role === "student" && (
                <label className="full">Sinf
                  {!newClass ? (
                    <div style={{display:"flex", gap:8}}>
                      <select value={className} onChange={e => setClassName(e.target.value)} style={{flex:1}}>
                        {existingClasses.length === 0 && <option value="">Hozircha sinf yo‘q</option>}
                        {existingClasses.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <button type="button" className="outline-btn" onClick={() => { setNewClass(true); setCustomClass(""); }}>+ Yangi sinf</button>
                    </div>
                  ) : (
                    <div style={{display:"flex", gap:8}}>
                      <input style={{flex:1}} value={customClass} onChange={e => setCustomClass(e.target.value)} placeholder="Masalan: 9-A"/>
                      {existingClasses.length > 0 && <button type="button" className="outline-btn" onClick={() => setNewClass(false)}>Ro‘yxatdan tanlash</button>}
                    </div>
                  )}
                </label>
              )}

              {role === "teacher" && (
                <label className="full">Fan<input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Masalan: Matematika"/></label>
              )}

              <label className="full">Manzil<input value={address} onChange={e => setAddress(e.target.value)} placeholder="Yashash manzili"/></label>

              {role === "student" && (<>
                <label>Otasining telefon raqami<input value={fatherPhone} onChange={e => setFatherPhone(e.target.value)} placeholder="+998 90 123 45 67"/></label>
                <label>Onasining telefon raqami<input value={motherPhone} onChange={e => setMotherPhone(e.target.value)} placeholder="+998 90 123 45 67"/></label>
              </>)}

              <label>Login<input value={username} onChange={e => setUsername(e.target.value)} placeholder="Login"/></label>
              <label>Parol<input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Kamida 4 belgi"/></label>
            </div>

            {error && <div className="error-box" style={{marginTop:16}}>{error}</div>}
            <div className="modal-actions">
              <button type="button" className="outline-btn" onClick={() => setShowModal(false)}>Bekor qilish</button>
              <button className="primary-btn" type="submit">{editId ? "Saqlash" : "Qo‘shish"}</button>
            </div>
          </form>
        </div>
      </div>
    )}

    <div className="user-cards">
      {users.length === 0 && <p style={{color:"var(--muted)",fontSize:13}}>Hech narsa topilmadi.</p>}
      {users.map(u => (
        <div className="user-card" key={u.id}>
          <div className="avatar">{u.avatar}</div>
          <div className="user-info"><h3>{u.name}</h3><span>{u.username}</span></div>
          <em>{u.role}</em>
          <div className="user-card-actions">
            <button type="button" className="icon-btn" title="O‘zgartirish" onClick={() => openEdit(u)}><Pencil size={14}/></button>
            <button type="button" className="icon-btn danger" title="O‘chirish" onClick={() => removeUser(u)}><Trash2 size={14}/></button>
          </div>
        </div>
      ))}
    </div>
  </>;
}

function Announcements({db,setDb,query,user}) {
  const isAdmin = user?.role === "admin";
  const add = () => {
    const title = prompt("E’lon sarlavhasi:");
    if (!title) return;
    const text = prompt("E’lon matni:") || "";
    setDb({...db, announcements:[{id:Date.now(),title,text,date:"Bugun"},...db.announcements]});
  };
  let list = db.announcements;
  if (query?.trim()) {
    const q = query.trim().toLowerCase();
    list = list.filter(a => a.title.toLowerCase().includes(q) || a.text.toLowerCase().includes(q));
  }
  return <><PageHead eyebrow="Maktab yangiliklari" title="E’lonlar" text={isAdmin ? "Maktab bo‘yicha xabarlarni boshqaring." : "Maktab bo‘yicha so‘nggi xabarlar."} action={isAdmin && <button className="primary-btn" onClick={add}>+ E’lon qo‘shish</button>}/><div className="announcement-admin">
    {list.length === 0 && <p style={{color:"var(--muted)",fontSize:13}}>Hech narsa topilmadi.</p>}
    {list.map(a=><div className="panel announcement-big" key={a.id}><div className="ann-icon"><Bell size={18}/></div><div><h3>{a.title}</h3><p>{a.text}</p><span>{a.date}</span></div></div>)}
  </div></>
}

function Reports({db}) {
  const max = Math.max(...db.grades.map(x=>x.grade),5);
  return <><PageHead eyebrow="Analitika" title="Hisobotlar" text="Ta’lim jarayonining qisqa ko‘rinishi."/><div className="report-grid"><div className="panel report-card"><h3>Baholar taqsimoti</h3>{[5,4,3,2].map(n=><div className="bar-row" key={n}><span>{n} ball</span><div><i style={{width:`${(db.grades.filter(g=>g.grade===n).length/Math.max(db.grades.length,1))*100}%`}} /></div><b>{db.grades.filter(g=>g.grade===n).length}</b></div>)}</div><div className="panel report-card"><h3>Tizim holati</h3><div className="system-line"><span>Platforma</span><b className="online">Faol</b></div><div className="system-line"><span>Ma’lumotlar bazasi</span><b className="online">Ulangan</b></div><div className="system-line"><span>Foydalanuvchilar</span><b>{db.users.length}</b></div></div></div></>
}

function Profile({user, updateProfile}) {
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setError(""); setOk("");
    if (newPassword && newPassword !== confirmPassword) {
      setError("Yangi parollar bir-biriga mos emas.");
      return;
    }
    const res = updateProfile({ name, avatar, currentPassword, newPassword: newPassword || undefined });
    if (!res.ok) { setError(res.error); return; }
    setOk("Ma’lumotlar muvaffaqiyatli saqlandi.");
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
  };

  return <>
    <PageHead eyebrow="Hisobim" title="Profil" text="Login va parolingizni faqat o‘zingiz belgilaysiz va boshqarasiz."/>
    <div className="profile-grid">
      <section className="panel profile-card">
        <div className="avatar">{avatar}</div>
        <h3>{user.name}</h3>
        <span>{user.role === "student" ? "O‘quvchi" : user.role === "teacher" ? "O‘qituvchi" : "Administrator"}</span>
      </section>
      <section className="panel">
        <form className="profile-form" onSubmit={submit}>
          <label>To‘liq ism<input value={name} onChange={e=>setName(e.target.value)}/></label>
          <label>Avatar belgisi (2 harf)<input value={avatar} onChange={e=>setAvatar(e.target.value.toUpperCase())} maxLength={2}/></label>
          <label>Login<input value={user.username} disabled/></label>
          <div className="row2">
            <label>Joriy parol<input type="password" value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)} placeholder="Parolni o‘zgartirish uchun"/></label>
            <label>Yangi parol<input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} placeholder="Kamida 4 belgi"/></label>
          </div>
          <label>Yangi parolni tasdiqlang<input type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)}/></label>
          {error && <div className="error-box">{error}</div>}
          {ok && <div className="success-box">{ok}</div>}
          <button className="primary-btn" type="submit">Saqlash</button>
        </form>
      </section>
    </div>
  </>;
}

function SettingsPage({theme,setTheme,db,setDb}) {
  const [notifications, setNotifications] = useState(() => localStorage.getItem("maktab_notifications") !== "off");
  const [compact, setCompact] = useState(() => localStorage.getItem("maktab_compact") === "on");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    document.documentElement.dataset.density = compact ? "compact" : "comfortable";
    localStorage.setItem("maktab_compact", compact ? "on" : "off");
  }, [compact]);

  const toggleNotifications = () => {
    const next = !notifications;
    setNotifications(next);
    localStorage.setItem("maktab_notifications", next ? "on" : "off");
    setNotice(next ? "Bildirishnomalar yoqildi." : "Bildirishnomalar o‘chirildi.");
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(db, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dmaktab-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setNotice("Ma’lumotlar JSON fayl sifatida saqlandi.");
  };

  const resetData = () => {
    if (!window.confirm("Demo ma’lumotlarini tiklashni xohlaysizmi? Siz kiritgan o‘zgarishlar o‘chadi.")) return;
    setDb(JSON.parse(JSON.stringify(seed)));
    setNotice("Boshlang‘ich ma’lumotlar tiklandi.");
  };

  return <>
    <PageHead eyebrow="Tizim" title="Sozlamalar" text="Platformani o‘zingizga qulay qilib sozlang."/>
    <div className="settings-grid">
      <section className="panel settings-card settings-highlight">
        <div className="settings-icon"><SlidersHorizontal size={20}/></div>
        <div className="settings-copy"><h3>Ko‘rinish</h3><p>Yorug‘ yoki tungi rejimni tanlang.</p></div>
        <button className={`switch ${theme==="dark" ? "on" : ""}`} onClick={()=>setTheme(theme==="dark"?"light":"dark")}><i/></button>
      </section>
      <section className="panel settings-card">
        <div className="settings-icon"><Bell size={20}/></div>
        <div className="settings-copy"><h3>Bildirishnomalar</h3><p>Yangi e’lonlar va muhim xabarlar haqida ogohlantirish.</p></div>
        <button className={`switch ${notifications ? "on" : ""}`} onClick={toggleNotifications}><i/></button>
      </section>
      <section className="panel settings-card">
        <div className="settings-icon"><SlidersHorizontal size={20}/></div>
        <div className="settings-copy"><h3>Ixcham ko‘rinish</h3><p>Jadval va kartalarni kichikroq qilib, ko‘proq ma’lumotni ekranga sig‘diradi.</p></div>
        <button className={`switch ${compact ? "on" : ""}`} onClick={()=>setCompact(v=>!v)}><i/></button>
      </section>
      <section className="panel settings-action-card">
        <div className="settings-icon"><Download size={20}/></div>
        <div><h3>Zaxira nusxa</h3><p>O‘quvchilar, baholar, vazifalar va boshqa ma’lumotlarni JSON faylga eksport qiling.</p></div>
        <button className="outline-btn" onClick={exportData}><Download size={16}/> Eksport qilish</button>
      </section>
      <section className="panel settings-action-card danger-setting">
        <div className="settings-icon"><RotateCcw size={20}/></div>
        <div><h3>Demo ma’lumotlarini tiklash</h3><p>Platformani dastlabki namunaviy holatga qaytaradi.</p></div>
        <button className="outline-btn danger-btn" onClick={resetData}><RotateCcw size={16}/> Tiklash</button>
      </section>
    </div>
    {notice && <div className="settings-notice">{notice}</div>}
  </>;
}

createRoot(document.getElementById("root")).render(<App />);
