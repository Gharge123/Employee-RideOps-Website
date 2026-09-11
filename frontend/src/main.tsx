import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  LayoutDashboard,
  Users,
  Car,
  ClipboardList,
  Route,
  MapPinned,
  Activity,
  LogOut,
  Plus,
  Search,
  Play,
  CheckCircle2,
  MapPin,
  Navigation,
  Clock3,
  ShieldCheck,
  LocateFixed,
  Square,
  X,
  Menu,
  Check,
  Radio,
  UserRound,
  ChevronRight,
  Phone,
  Timer,
  RefreshCw,
  Upload,
  Download,
  FileSpreadsheet,
  Bus,
  Building2,
  CalendarDays,
  ShieldAlert,
  BarChart3,
  PlusCircle,
  Bell,
} from "lucide-react";
import "./styles.css";
const API = "http://localhost:5000/api";
type Role =
  | "SUPER_ADMIN"
  | "TRANSPORT_ADMIN"
  | "DISPATCHER"
  | "DRIVER"
  | "EMPLOYEE";
const labels: any = {
  SUPER_ADMIN: "Super Admin",
  TRANSPORT_ADMIN: "Transport Admin",
  DISPATCHER: "Dispatcher",
  DRIVER: "Driver",
  EMPLOYEE: "Employee",
};
async function api(path: string, opts: any = {}) {
  const token = localStorage.getItem("rideops_token");
  const r = await fetch(API + path, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
      ...(token ? { Authorization: "Bearer " + token } : {}),
    },
  });
  const t = await r.text();
  let d: any = {};
  try {
    d = JSON.parse(t);
  } catch {}
  if (!r.ok) throw new Error(d.message || "Request failed");
  return d;
}
function App() {
  const [session, setSession] = useState<any>(() =>
    JSON.parse(localStorage.getItem("rideops_user") || "null"),
  );
  if (!session) return <Login onLogin={(u) => setSession(u)} />;
  return (
    <Shell
      user={session}
      logout={() => {
        localStorage.clear();
        setSession(null);
      }}
    />
  );
}
function Login({ onLogin }: { onLogin: (u: any) => void }) {
  const [email, setEmail] = useState("employee@rideops.local"),
    [password, setPassword] = useState("admin123"),
    [error, setError] = useState("");
  const submit = async () => {
    try {
      const d = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("rideops_token", d.token);
      localStorage.setItem("rideops_user", JSON.stringify(d.user));
      onLogin(d.user);
    } catch (e: any) {
      setError(e.message);
    }
  };
  return (
    <div className="login">
      <div className="loginCard">
        <div className="brand">
          <div className="brandMark">R</div>
          <div>
            <b>RideOps</b>
            <span>Employee Mobility OS</span>
          </div>
        </div>
        <span className="eyebrow">FLEET CONTROL PLATFORM</span>
        <h1>
          Move people.
          <br />
          <em>Move business.</em>
        </h1>
        <p>
          Role-based employee transport, OTP verification and live GPS tracking.
        </p>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Work email"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        <button className="primary full" onClick={submit}>
          Sign in <ChevronRight size={17} />
        </button>
        {error && <div className="error">{error}</div>}
        <div className="demoGrid">
          <span>Super Admin</span>
          <small>superadmin@rideops.local / admin123</small>
          <span>Transport Admin</span>
          <small>admin@rideops.local / admin123</small>
          <span>Dispatcher</span>
          <small>dispatcher@rideops.local / admin123</small>
          <span>Driver A</span>
          <small>suresh@example.com / admin123</small>
          <span>Driver B</span>
          <small>prakash@example.com / admin123</small>
          <span>Employee A</span>
          <small>employee@rideops.local / admin123</small>
          <span>Employee B</span>
          <small>neha@example.com / admin123</small>
        </div>
      </div>
    </div>
  );
}
function Shell({ user, logout }: { user: any; logout: () => void }) {
  const nav =
    user.role === "DRIVER"
      ? ["Dashboard", "My Trips", "Live Tracking", "GPS Logs", "Profile"]
      : user.role === "EMPLOYEE"
        ? ["Dashboard", "Book Ride", "My Rides", "Live Tracking", "Profile"]
        : [
            "Dashboard",
            "Employees",
            "Drivers",
            "Fleet",
            "Vendors",
            "Shifts",
            "Routes",
            "Ride Requests",
            "Trips",
            "Live Tracking",
            "Safety",
            "Reports",
            "GPS Logs",
          ];
  const [page, setPage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="app">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brandMark">R</div>
          <div>
            <b>RideOps</b>
            <span>Employee Mobility OS</span>
          </div>
        </div>
        <div className="roleBox">
          <ShieldCheck size={16} />
          <div>
            <small>Signed in as</small>
            <b>{labels[user.role]}</b>
          </div>
        </div>
        <nav>
          {nav.map((n) => (
            <button
              key={n}
              className={page === n ? "active" : ""}
              onClick={() => { setPage(n); setSidebarOpen(false); }}
            >
              {icon(n)}
              <span>{n}</span>
            </button>
          ))}
        </nav>
        <div className="sideBottom">
          <button onClick={() => { setPage("Profile"); setSidebarOpen(false); }}>
            <UserRound size={18} />
            Profile
          </button>
          <button
            className="logoutBtn"
            onClick={() => {
              if (confirm("Logout?")) logout();
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
      {sidebarOpen && <button type="button" className="sidebarOverlay" aria-label="Close navigation menu" onClick={() => setSidebarOpen(false)} />}
      <main>
        <header>
          <div className="headerTitle">
            <button
              type="button"
              className="mobileMenu"
              aria-label="Open navigation menu"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div>
              <small>RideOps • Secure workspace</small>
              <h1>{page}</h1>
            </div>
          </div>
          <div className="userMenu">
            <div className="avatar">
              {String(user.name || "U")
                .split(" ")
                .map((x: string) => x[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="userMeta">
              <b>{user.name}</b>
              <span>{labels[user.role]}</span>
            </div>
            <button className="headerLogout" onClick={logout}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>
        {page === "Dashboard" ? (
          <Dashboard user={user} />
        ) : page === "Live Tracking" ? (
          <LiveTracking user={user} />
        ) : page === "My Trips" ? (
          <DriverTrips user={user} />
        ) : page === "Book Ride" ? (
          <BookRide user={user} />
        ) : page === "My Rides" ? (
          <EmployeeRides user={user} />
        ) : page === "Trips" ? (
          <TripRecords user={user} />
        ) : page === "Ride Requests" ? (
          <Requests user={user} />
        ) : page === "Employees" || page === "Drivers" ? (
          <People page={page} />
        ) : ["Fleet","Vendors","Shifts","Routes","Safety","Reports"].includes(page) ? (
          <EnterpriseModule page={page} />
        ) : (
          <Simple page={page} user={user} />
        )}
      </main>
    </div>
  );
}
function icon(n: string) {
  const m: any = {
    Dashboard: <LayoutDashboard />,
    "My Trips": <Route />,
    "Book Ride": <Plus />,
    "My Rides": <ClipboardList />,
    "Live Tracking": <MapPinned />,
    "GPS Logs": <Activity />,
    Employees: <Users />,
    Drivers: <Car />,
    Fleet: <Bus />,
    Vendors: <Building2 />,
    Shifts: <CalendarDays />,
    Routes: <Route />,
    "Ride Requests": <ClipboardList />,
    Safety: <ShieldAlert />,
    Reports: <BarChart3 />,
    Trips: <Route />,
    Profile: <UserRound />,
  };
  return React.cloneElement(m[n] || <Activity />, { size: 18 });
}
function Dashboard({ user }: { user: any }) {
  const [d, setD] = useState<any>({}),
    [rides, setRides] = useState<any[]>([]);
  const load = () => {
    api("/dashboard")
      .then(setD)
      .catch(() => {});
    api("/rides")
      .then(setRides)
      .catch(() => {});
  };
  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);
  const active = rides.find(
    (r) => r.status === "ASSIGNED" || r.status === "IN_PROGRESS",
  );
  return (
    <div className="content">
      <div className="welcome">
        <div>
          <span className="eyebrow">
            {labels[user.role].toUpperCase()} WORKSPACE
          </span>
          <h2>
            {user.role === "EMPLOYEE"
              ? "Your driver, trip and history — only yours."
              : user.role === "DRIVER"
                ? "Your assigned employees and routes — only yours."
                : "One control plane for every mobility operation."}
          </h2>
          <p>
            Role isolation is enforced by the backend. Employees see only their
            own rides; each driver sees only rides assigned to that driver.
          </p>
        </div>
        <span className="miniLive">
          <Radio size={15} /> LIVE
        </span>
      </div>
      <div className="stats">
        <Stat label="My/visible trips" value={d.tripsToday ?? 0} icon={Route} />
        <Stat label="Live trips" value={d.liveTrips ?? 0} icon={Navigation} />
        <Stat label="Completed" value={d.completed ?? 0} icon={CheckCircle2} />
        <Stat label="GPS events" value={d.gpsEvents ?? 0} icon={Activity} />
      </div>
      {user.role === "EMPLOYEE" && (
        <div className="panel assignedDriverPanel">
          <div className="recordHead">
            <div>
              <span className="eyebrow">YOUR ASSIGNED DRIVER</span>
              <h3>{active?.driverName || "Driver not assigned yet"}</h3>
              <p>
                {active
                  ? `${active.vehicleNo || "Vehicle pending"} • ${active.vehicleType || ""} • ${active.driverPhone || ""}`
                  : "Your transport team will assign a driver to this ride."}
              </p>
            </div>
            {active && <span className="pill">{active.status}</span>}
          </div>
          {active && (
            <div className="rideMeta">
              <span>
                <MapPin /> Pickup: {active.pickup}
              </span>
              <span>
                <Navigation /> Drop: {active.drop}
              </span>
              <span>
                <Route /> Route stop #{active.routeOrder || "—"}
              </span>
            </div>
          )}
          {active && <GoogleMap ride={active} logs={[]} />}{" "}
          {!active && (
            <div className="infoBanner">
              Once a dispatcher assigns a driver, the driver's name, vehicle and
              phone appear here automatically. You never need to select the
              driver yourself.
            </div>
          )}
        </div>
      )}
      {user.role === "DRIVER" && active && (
        <div className="panel assignedDriverPanel">
          <div className="recordHead">
            <div>
              <span className="eyebrow">CURRENT EMPLOYEE REQUEST</span>
              <h3>{active.employeeName}</h3>
              <p>
                {active.employeePhone} • Stop #{active.routeOrder || "—"} •{" "}
                {active.status}
              </p>
            </div>
            <span className="pill">{active.status}</span>
          </div>
          <div className="rideMeta">
            <span>
              <MapPin /> Pickup: {active.pickup}
            </span>
            <span>
              <Navigation /> Drop: {active.drop}
            </span>
            <span>
              <Car /> {active.vehicleNo}
            </span>
          </div>
          <GoogleMap ride={active} logs={[]} />
        </div>
      )}
      <div className="panel">
        <h3>How RideOps works</h3>
        <div className="flowCards">
          <div>
            <b>1</b>
            <span>Employee requests ride</span>
          </div>
          <div>
            <b>2</b>
            <span>Dispatcher assigns driver</span>
          </div>
          <div>
            <b>3</b>
            <span>Driver accepts</span>
          </div>
          <div>
            <b>4</b>
            <span>Employee shares OTP</span>
          </div>
          <div>
            <b>5</b>
            <span>Driver verifies & GPS starts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: any;
  icon: any;
}) {
  return (
    <div className="stat">
      <Icon size={19} />
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}
function BookRide({ user }: { user: any }) {
  const [form,setForm]=useState<any>({}),[msg,setMsg]=useState("");
  const submit=async()=>{
    try{
      if(!form.pickup||!form.drop||!form.scheduledAt)return setMsg("Pickup, drop and schedule are required.");
      const r=await api("/rides",{method:"POST",body:JSON.stringify(form)});
      setMsg(`Ride request ${r.id} submitted. The transport desk will assign an available driver.`);
      setForm({});
    }catch(e:any){setMsg(e.message)}
  };
  return <div className="content">
    <div className="panel">
      <span className="eyebrow">EMPLOYEE SELF SERVICE</span><h2>Book a corporate ride</h2>
      <p>Request a home-to-office or office-to-home cab. Driver assignment is controlled by the transport desk, so employees cannot accidentally assign another driver.</p>
      <div className="formGrid">
        <label>Pickup<input value={form.pickup||""} onChange={e=>setForm({...form,pickup:e.target.value})} placeholder="Home / pickup location"/></label>
        <label>Drop<input value={form.drop||""} onChange={e=>setForm({...form,drop:e.target.value})} placeholder="Office / destination"/></label>
        <label>Schedule<input type="datetime-local" value={form.scheduledAt?new Date(form.scheduledAt).toISOString().slice(0,16):""} onChange={e=>setForm({...form,scheduledAt:new Date(e.target.value).toISOString()})}/></label>
        <label>Trip type<select value={form.tripType||"HOME_TO_OFFICE"} onChange={e=>setForm({...form,tripType:e.target.value})}><option value="HOME_TO_OFFICE">Home → Office</option><option value="OFFICE_TO_HOME">Office → Home</option><option value="CORPORATE_RENTAL">Corporate Rental</option></select></label>
        <label>Passengers<input type="number" min="1" max="6" value={form.passengers||1} onChange={e=>setForm({...form,passengers:e.target.value})}/></label>
        <label>Special note<input value={form.note||""} onChange={e=>setForm({...form,note:e.target.value})} placeholder="Optional"/></label>
      </div>
      <button className="primary" onClick={submit}><Plus size={16}/> Request Cab</button>
      {msg&&<div className={msg.startsWith("Ride request")?"successBox":"error"}>{msg}</div>}
    </div>
  </div>;
}
function EmployeeRides({ user }: { user: any }) {
  const [rides, setRides] = useState<any[]>([]),
    [msg, setMsg] = useState("");
  const load = () =>
    api("/trip-records")
      .then(setRides)
      .catch((e) => setMsg(e.message));
  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="content">
      <div className="toolbar">
        <div>
          <span className="eyebrow">PERSONAL HISTORY</span>
          <h2>My Rides</h2>
        </div>
        <button className="secondary" onClick={load}>
          <RefreshCw size={15} /> Refresh
        </button>
      </div>
      {rides.map((r) => (
        <EmployeeRide key={r.id} ride={r} onRefresh={load} setMsg={setMsg} />
      ))}
      {!rides.length && (
        <div className="panel empty">No rides for your employee account.</div>
      )}
      {msg && <Toast text={msg} close={() => setMsg("")} />}
    </div>
  );
}
function EmployeeRide({
  ride,
  onRefresh,
  setMsg,
}: {
  ride: any;
  onRefresh: () => void;
  setMsg: (x: string) => void;
  key?: React.Key;
}) {
  const [logs, setLogs] = useState<any[]>([]),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    api("/trips/" + ride.id + "/gps")
      .then(setLogs)
      .catch(() => {});
  }, [ride.id, ride.lastGpsAt]);
  const [tracking, setTracking] = useState(false);
  const watch = useRef<number | null>(null);
  const start = () => {
    if (!navigator.geolocation) return setMsg("GPS is not supported.");
    setTracking(true);
    watch.current = navigator.geolocation.watchPosition(
      (p) => {
        const c = p.coords;
        api("/trips/" + ride.id + "/gps", {
          method: "POST",
          body: JSON.stringify({
            lat: c.latitude,
            lng: c.longitude,
            accuracy: c.accuracy,
            speed: c.speed,
            bearing: c.heading,
            provider: "employee-browser",
            deviceTime: new Date(p.timestamp).toISOString(),
            event: "EMPLOYEE_GPS",
          }),
        }).catch(() => {});
      },
      (e) => setMsg(e.message),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    );
  };
  const stop = () => {
    setTracking(false);
    if (watch.current !== null) navigator.geolocation.clearWatch(watch.current);
  };
  const confirm = async () => {
    try {
      setBusy(true);
      await api("/rides/" + ride.id + "/employee-confirm", { method: "POST" });
      setMsg("Ride confirmed. Give the OTP to your driver before pickup.");
      onRefresh();
    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  };
  const begin = async () => {
    try {
      setBusy(true);
      await api("/trips/" + ride.id + "/start", { method: "POST" });
      setMsg("Trip started. Your live trip view is active.");
      start();
      onRefresh();
    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="panel rideCard">
      <div className="recordHead">
        <div>
          <span className="eyebrow">{ride.id}</span>
          <h3>
            {ride.pickup} <ChevronRight size={15} /> {ride.drop}
          </h3>
          <p>
            <Car size={14} />{" "}
            <b>Assigned driver: {ride.driverName || "Driver not assigned"}</b> •{" "}
            {ride.vehicleNo || "Vehicle pending"} • {ride.driverPhone || ""}
          </p>
        </div>
        <span className="pill">{ride.status}</span>
      </div>
      <div className="rideMeta">
        <span>
          <Clock3 />{" "}
          {ride.scheduledAt
            ? new Date(ride.scheduledAt).toLocaleString("en-IN")
            : ""}
        </span>
        <span>
          <Activity /> {logs.length || ride.gpsCount || 0} GPS points
        </span>
        <span>
          <Navigation />{" "}
          {ride.lastGps
            ? `${Number(ride.lastGps.lat).toFixed(5)}, ${Number(ride.lastGps.lng).toFixed(5)}`
            : "Driver location waiting"}
        </span>
      </div>
      <div className="actions">
        {(ride.status === "ASSIGNED" || ride.status === "IN_PROGRESS") && (
          <button className="secondary dangerBtn" onClick={async()=>{if(!confirm("Send an emergency SOS to the transport command centre?"))return;try{await api("/safety-alerts",{method:"POST",body:JSON.stringify({type:"SOS",severity:"CRITICAL",tripId:ride.id,message:`Employee ${ride.employeeName||"passenger"} requested emergency assistance.`})});setMsg("SOS sent to the transport command centre.");}catch(e:any){setMsg(e.message)}}}>
            <ShieldAlert size={16}/> SOS Emergency
          </button>
        )}
        {ride.status === "ASSIGNED" && (
          <>
            <button className="secondary" onClick={confirm} disabled={busy}>
              Confirm driver
            </button>
            {ride.otp && (
              <div className="otpBox">
                OTP <b>{ride.otp}</b>
                <small>Share only with your assigned driver</small>
              </div>
            )}
          </>
        )}
        {ride.status === "IN_PROGRESS" && (
          <button className="primary" onClick={begin}>
            Start / view my trip
          </button>
        )}
        {ride.status === "IN_PROGRESS" && (
          <span className="miniLive">
            <span /> Driver tracking active
          </span>
        )}
      </div>
      <GoogleMap ride={ride} logs={logs} />
    </div>
  );
}
function DriverTrips({ user }: { user: any }) {
  const [rides, setRides] = useState<any[]>([]),
    [msg, setMsg] = useState("");
  const load = () =>
    api("/trip-records")
      .then(setRides)
      .catch((e) => setMsg(e.message));
  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="content">
      <div className="toolbar">
        <div>
          <span className="eyebrow">DRIVER ONLY</span>
          <h2>My Assigned Trips</h2>
        </div>
        <button className="secondary" onClick={load}>
          <RefreshCw size={15} /> Refresh
        </button>
      </div>
      {rides.map((r) => (
        <DriverCard key={r.id} ride={r} refresh={load} setMsg={setMsg} />
      ))}
      {!rides.length && (
        <div className="panel empty">No trips assigned to this driver.</div>
      )}
      {msg && <Toast text={msg} close={() => setMsg("")} />}
    </div>
  );
}
function DriverCard({
  ride,
  refresh,
  setMsg,
}: {
  ride: any;
  refresh: () => void;
  setMsg: (x: string) => void;
  key?: React.Key;
}) {
  const [otp, setOtp] = useState(""),
    [tracking, setTracking] = useState(false),
    [logs, setLogs] = useState<any[]>([]),
    [busy, setBusy] = useState(false);
  const watch = useRef<number | null>(null);
  useEffect(() => {
    api("/trips/" + ride.id + "/gps")
      .then(setLogs)
      .catch(() => {});
    return () => {
      if (watch.current !== null && navigator.geolocation)
        navigator.geolocation.clearWatch(watch.current);
    };
  }, [ride.id, ride.status]);
  const send = async (event: string) => {
    if (!navigator.geolocation) throw new Error("GPS unavailable");
    await new Promise<void>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const c = pos.coords;
            const g = await api("/trips/" + ride.id + "/gps", {
              method: "POST",
              body: JSON.stringify({
                lat: c.latitude,
                lng: c.longitude,
                accuracy: c.accuracy,
                speed: c.speed,
                bearing: c.heading,
                provider: "driver-browser",
                deviceTime: new Date(pos.timestamp).toISOString(),
                event,
              }),
            });
            setLogs((x) => [...x, g]);
            resolve();
          } catch (e) {
            reject(e);
          }
        },
        (e) => reject(new Error(e.message)),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 },
      );
    });
  };
  const startGps = () => {
    if (!navigator.geolocation) return setMsg("GPS unavailable");
    setTracking(true);
    watch.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const c = pos.coords;
        try {
          const g = await api("/trips/" + ride.id + "/gps", {
            method: "POST",
            body: JSON.stringify({
              lat: c.latitude,
              lng: c.longitude,
              accuracy: c.accuracy,
              speed: c.speed,
              bearing: c.heading,
              provider: "driver-browser",
              deviceTime: new Date(pos.timestamp).toISOString(),
              event: "GPS_PING",
            }),
          });
          setLogs((x) => [...x, g]);
        } catch {}
      },
      (e) => setMsg(e.message),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    );
  };
  const stopGps = () => {
    setTracking(false);
    if (watch.current !== null && navigator.geolocation)
      navigator.geolocation.clearWatch(watch.current);
    watch.current = null;
  };
  const action = async (kind: string) => {
    try {
      setBusy(true);
      if (kind === "accept")
        await api("/rides/" + ride.id + "/driver-accept", { method: "POST" });
      if (kind === "start") {
        await api("/trips/" + ride.id + "/verify-otp", {
          method: "POST",
          body: JSON.stringify({ otp }),
        });
        await api("/trips/" + ride.id + "/start", { method: "POST" });
        startGps();
      }
      if (kind === "pickup" || kind === "drop") {
        await send(kind === "pickup" ? "EMPLOYEE_PICKUP" : "EMPLOYEE_DROPOFF");
        await api("/trips/" + ride.id + "/event", {
          method: "POST",
          body: JSON.stringify({
            event: kind === "pickup" ? "EMPLOYEE_PICKUP" : "EMPLOYEE_DROPOFF",
          }),
        });
      }
      if (kind === "complete") {
        await send("TRIP_COMPLETED");
        stopGps();
        await api("/trips/" + ride.id + "/complete", { method: "POST" });
      }
      setMsg(
        kind === "start"
          ? "OTP verified. Trip started and GPS is live."
          : "Action completed",
      );
      refresh();
    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="panel rideCard">
      <div className="recordHead">
        <div>
          <span className="eyebrow">
            ASSIGNED EMPLOYEE • STOP #{ride.routeOrder || "—"} • {ride.id}
          </span>
          <h3>
            {ride.employeeName} <ChevronRight size={15} /> {ride.pickup} →{" "}
            {ride.drop}
          </h3>
          <p>
            <UserRound size={14} /> {ride.employeePhone} • {ride.vehicleNo} •{" "}
            {ride.vehicleType}
          </p>
        </div>
        <span className="pill">{ride.status}</span>
      </div>
      <div className="rideMeta">
        <span>
          <MapPin /> Pickup: {ride.pickup}
        </span>
        <span>
          <Navigation /> Drop: {ride.drop}
        </span>
        <span>
          <Activity /> {logs.length} GPS points
        </span>
      </div>
      <div className="actions">
        {ride.status === "ASSIGNED" && !ride.driverAccepted && (
          <button
            className="secondary"
            onClick={() => action("accept")}
            disabled={busy}
          >
            <Check /> Accept ride
          </button>
        )}
        {ride.status === "ASSIGNED" && ride.driverAccepted && (
          <>
            <input
              className="otpInput"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="Employee OTP"
            />
            <button
              className="primary"
              onClick={() => action("start")}
              disabled={busy}
            >
              <Play /> Verify OTP & Start
            </button>
          </>
        )}
        {ride.status === "IN_PROGRESS" && (
          <>
            <button
              className={tracking ? "secondary" : "primary"}
              onClick={tracking ? stopGps : startGps}
            >
              {tracking ? (
                <>
                  <Square /> Pause GPS
                </>
              ) : (
                <>
                  <LocateFixed /> Start GPS
                </>
              )}
            </button>
            <button className="secondary" onClick={() => action("pickup")}>
              <MapPin /> Pickup
            </button>
            <button className="secondary" onClick={() => action("drop")}>
              <MapPin /> Drop
            </button>
            <button className="primary" onClick={() => action("complete")}>
              <CheckCircle2 /> Complete
            </button>
          </>
        )}
      </div>
      {ride.status === "ASSIGNED" && (
        <div className="infoBanner">
          Employee OTP is required before trip start. Never accept an OTP from
          another employee.
        </div>
      )}
      <GoogleMap ride={ride} logs={logs} />
      <div className="history">
        <b>Employee trip history for this assigned ride</b>
        {(ride.events || []).map((e: any) => (
          <div key={e.id || e.at}>
            <span>{e.event}</span>
            <small>{new Date(e.at).toLocaleString("en-IN")}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

function GoogleMap({ ride, logs }: { ride: any; logs: any[] }) {
  const ref = useRef<HTMLDivElement>(null), map = useRef<any>(null), line = useRef<any>(null), marker = useRef<any>(null);
  const [key, setKey] = useState("");
  useEffect(() => { api("/maps/config").then((x) => setKey(x.browserApiKey)).catch(() => {}); }, []);
  useEffect(() => {
    if (!key || !ref.current) return;
    let script = document.querySelector("script[data-rideops-maps]") as HTMLScriptElement | null;
    const init = () => {
      if (!(window as any).google?.maps || !ref.current) return;
      const g = (window as any).google.maps;
      map.current = new g.Map(ref.current, { center: { lat: 18.5204, lng: 73.8567 }, zoom: 12, mapId: "DEMO_MAP_ID", fullscreenControl: true, streetViewControl: false, mapTypeControl: false });
      line.current = new g.Polyline({ map: map.current, path: [], strokeOpacity: 0.85, strokeWeight: 5 });
      marker.current = new g.Marker({ map: map.current, title: ride?.driverName || "Vehicle", icon: { path: g.SymbolPath.FORWARD_CLOSED_ARROW, scale: 6, fillOpacity: 1, strokeWeight: 2 } });
      update();
    };
    const update = () => {
      if (!map.current || !(window as any).google) return;
      const g = (window as any).google.maps;
      const path = logs.map((x) => ({ lat: Number(x.lat), lng: Number(x.lng) }));
      if (line.current) line.current.setPath(path);
      if (path.length) { const last=path[path.length-1]; marker.current?.setPosition(last); map.current.setCenter(last); map.current.setZoom(Math.max(map.current.getZoom() || 15, 15)); }
    };
    if (script) { script.addEventListener("load", init); if ((window as any).google?.maps) init(); }
    else { script=document.createElement("script"); script.dataset.rideopsMaps="1"; script.src=`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=geometry,marker&v=weekly`; script.async=true; script.defer=true; script.onload=init; document.head.appendChild(script); }
    return () => { script?.removeEventListener("load", init); };
  }, [key, ride?.id]);
  useEffect(() => {
    if (map.current && line.current) { const path=logs.map((x)=>({lat:Number(x.lat),lng:Number(x.lng)})); line.current.setPath(path); if(path.length){const last=path[path.length-1]; marker.current?.setPosition(last); map.current.setCenter(last);} }
  }, [logs]);
  return <div className="mapPanel"><div className="mapHeader"><b><Radio size={14}/> Live GPS map</b><span>{logs.length ? "GPS signal received" : "Waiting for GPS"} • {logs.length ? new Date(logs[logs.length-1].serverTime||Date.now()).toLocaleTimeString("en-IN") : "—"}</span></div><div ref={ref} className="googleMap">{!key && <div className="mapPlaceholder"><MapPinned size={28}/><b>Live map is ready</b><span>Set GOOGLE_MAPS_BROWSER_API_KEY to render Google Maps.</span></div>}</div></div>;
}

function FleetMap({ vehicles }: { vehicles: any[] }) {
  const ref=useRef<HTMLDivElement>(null), map=useRef<any>(null), markers=useRef<Record<string,any>>({});
  const [key,setKey]=useState("");
  useEffect(()=>{api("/maps/config").then((x)=>setKey(x.browserApiKey)).catch(()=>{});},[]);
  useEffect(()=>{
    if(!key||!ref.current)return;
    let script=document.querySelector("script[data-rideops-maps]") as HTMLScriptElement|null;
    const init=()=>{if(!(window as any).google?.maps||!ref.current)return; const g=(window as any).google.maps; map.current=new g.Map(ref.current,{center:{lat:18.5204,lng:73.8567},zoom:11,mapId:"DEMO_MAP_ID",fullscreenControl:true,streetViewControl:false,mapTypeControl:false}); update();};
    const update=()=>{if(!map.current||(window as any).google?.maps===undefined)return; const g=(window as any).google.maps; const bounds=new g.LatLngBounds(); let count=0; vehicles.forEach(v=>{const p=v.lastGps;if(!p)return; const pos={lat:Number(p.lat),lng:Number(p.lng)}; bounds.extend(pos);count++; if(!markers.current[v.id]) markers.current[v.id]=new g.Marker({map:map.current,position:pos,title:`${v.vehicleNo||"Vehicle"} • ${v.driverName||"Unassigned"}`,label:{text:"●",fontSize:"18px"}}); else markers.current[v.id].setPosition(pos);}); if(count===1) {map.current.setCenter(bounds.getCenter());map.current.setZoom(14);} else if(count>1) map.current.fitBounds(bounds,{top:70,right:70,bottom:70,left:70});};
    if(script){script.addEventListener("load",init);if((window as any).google?.maps)init();}else{script=document.createElement("script");script.dataset.rideopsMaps="1";script.src=`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=geometry,marker&v=weekly`;script.async=true;script.defer=true;script.onload=init;document.head.appendChild(script);} return()=>script?.removeEventListener("load",init);
  },[key]);
  useEffect(()=>{if(map.current){const g=(window as any).google?.maps;if(!g)return; const bounds=new g.LatLngBounds();let count=0;vehicles.forEach(v=>{const p=v.lastGps;if(!p)return;const pos={lat:Number(p.lat),lng:Number(p.lng)};bounds.extend(pos);count++;if(!markers.current[v.id])markers.current[v.id]=new g.Marker({map:map.current,position:pos,title:`${v.vehicleNo||"Vehicle"} • ${v.driverName||"Unassigned"}`});else markers.current[v.id].setPosition(pos);});if(count===1){map.current.setCenter(bounds.getCenter());map.current.setZoom(14)}else if(count>1)map.current.fitBounds(bounds,{top:70,right:70,bottom:70,left:70});}},[vehicles]);
  return <div className="fleetMap"><div ref={ref} className="googleMap"><div className="mapOverlay"><span className="liveDot"></span>{vehicles.filter(v=>v.gpsOnline).length} GPS ONLINE <span>•</span>{vehicles.length} active trips</div>{!key&&<div className="mapPlaceholder"><MapPinned size={34}/><b>Command-centre map</b><span>Configure GOOGLE_MAPS_BROWSER_API_KEY for live vehicle markers.</span></div>}</div></div>;
}

function LiveTracking({ user }: { user: any }) {
  const [data,setData]=useState<any>({vehicles:[],count:0,serverTime:""}),[selected,setSelected]=useState<any>(null);
  const load=()=>api("/live-tracking").then(setData).catch(()=>{});
  useEffect(()=>{load();const t=setInterval(load,2000);return()=>clearInterval(t);},[]);
  const vehicles=data.vehicles||[];
  return <div className="content liveConsole">
    <div className="commandHero"><div><span className="eyebrow">24×7 MOBILITY COMMAND CENTRE</span><h2>{user.role==="EMPLOYEE"?"Track your assigned vehicle":"Live fleet command centre"}</h2><p>Real-time trip visibility, GPS health and safety-ready operations in one screen.</p></div><div className="liveBadge"><span className="liveDot"></span> LIVE <small>{data.serverTime?new Date(data.serverTime).toLocaleTimeString("en-IN"):"—"}</small></div></div>
    {user.role!=="EMPLOYEE"&&<div className="liveKpis"><Stat label="Active trips" value={vehicles.length} icon={Car}/><Stat label="GPS online" value={vehicles.filter(v=>v.gpsOnline).length} icon={Radio}/><Stat label="GPS stale" value={vehicles.filter(v=>!v.gpsOnline&&v.lastGps).length} icon={Activity}/><Stat label="No GPS yet" value={vehicles.filter(v=>!v.lastGps).length} icon={LocateFixed}/></div>}
    <div className="liveLayout"><FleetMap vehicles={vehicles}/><div className="vehicleRail"><div className="railHead"><b>Live vehicles</b><span>{vehicles.length}</span></div>{vehicles.map(v=><button key={v.id} className={`vehicleItem ${selected?.id===v.id?"selected":""}`} onClick={()=>setSelected(v)}><div className="vehicleIcon"><Car size={17}/></div><div className="vehicleInfo"><b>{v.vehicleNo||"Vehicle pending"}</b><span>{v.driverName||"Unassigned"} • {v.employeeName||"—"}</span><small>{v.lastGps?`${v.gpsAgeSeconds}s ago • ${Number(v.lastGps.speed||0).toFixed(0)} km/h`:"Waiting for GPS"}</small></div><span className={v.gpsOnline?"signal online":"signal"}></span></button>)}{!vehicles.length&&<div className="railEmpty"><MapPinned size={25}/><b>No active vehicles</b><span>Start a driver trip and enable GPS to see it here.</span></div>}</div></div>
    {selected&&<div className="panel liveDetail"><div><span className="eyebrow">SELECTED TRIP</span><h3>{selected.vehicleNo} • {selected.driverName}</h3><p>{selected.pickup} → {selected.drop} • {selected.employeeName}</p></div><div className="rideMeta"><span><Radio/> GPS {selected.gpsOnline?"ONLINE":"STALE"}</span><span><LocateFixed/> {selected.lastGps?`${Number(selected.lastGps.lat).toFixed(5)}, ${Number(selected.lastGps.lng).toFixed(5)}`:"Waiting"}</span><span><Activity/> {selected.gpsCount||0} points</span></div></div>}
    {user.role==="EMPLOYEE"&&vehicles[0]&&<LiveCard ride={vehicles[0]}/>} 
  </div>;
}
function LiveCard({ ride }: { ride: any; key?: React.Key }) {
  const [logs, setLogs] = useState<any[]>([]);
  const load = () =>
    api("/trips/" + ride.id + "/gps")
      .then(setLogs)
      .catch(() => {});
  useEffect(() => {
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, [ride.id]);
  return (
    <div className="panel">
      <div className="recordHead">
        <div>
          <span className="eyebrow">{ride.id}</span>
          <h3>
            {ride.driverName} • {ride.vehicleNo}
          </h3>
          <p>
            {ride.pickup} → {ride.drop} • Employee: {ride.employeeName}
          </p>
        </div>
        <span className="miniLive">● LIVE</span>
      </div>
      <GoogleMap ride={ride} logs={logs} />
      <div className="rideMeta">
        <span>
          <Activity /> {logs.length} GPS points
        </span>
        <span>
          <LocateFixed />{" "}
          {logs.length
            ? `${Number(logs[logs.length - 1].lat).toFixed(5)}, ${Number(logs[logs.length - 1].lng).toFixed(5)}`
            : "Waiting"}
        </span>
        <span>
          <Clock3 />{" "}
          {ride.lastGpsAt
            ? new Date(ride.lastGpsAt).toLocaleTimeString("en-IN")
            : "—"}
        </span>
      </div>
    </div>
  );
}

function TripRecords({ user }: { user: any }) {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    api("/trip-records").then(setRows);
  }, []);
  return (
    <div className="content">
      <div className="toolbar">
        <h2>Trip Records</h2>
      </div>
      {rows.map((r) => (
        <div className="panel recordCard" key={r.id}>
          <b>
            {r.employeeName} → {r.driverName}
          </b>
          <p>
            {r.pickup} → {r.drop} • {r.status} • {r.gpsCount} GPS points
          </p>
        </div>
      ))}
      {!rows.length && <div className="panel empty">No trip records.</div>}
    </div>
  );
}
function Requests({ user }: { user: any }) {
  const [rows, setRows] = useState<any[]>([]),
    [drivers, setDrivers] = useState<any[]>([]),
    [msg, setMsg] = useState("");
  const load = () => api("/rides").then(setRows);
  useEffect(() => {
    load();
    api("/drivers").then(setDrivers);
  }, []);
  const assign = async (id: string, did: string) => {
    try {
      await api("/rides/" + id + "/assign", {
        method: "POST",
        body: JSON.stringify({ driverId: did }),
      });
      setMsg("Driver assigned");
      load();
    } catch (e: any) {
      setMsg(e.message);
    }
  };
  return (
    <div className="content">
      <div className="toolbar">
        <h2>Ride Requests</h2>
      </div>
      {rows.map((r) => (
        <div className="panel request" key={r.id}>
          <div>
            <b>{r.employeeName}</b>
            <p>
              {r.pickup} → {r.drop} • {r.status}
            </p>
          </div>
          <select
            value={r.driverId || ""}
            onChange={(e) => assign(r.id, e.target.value)}
          >
            <option value="">Assign driver</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.vehicleNo})
              </option>
            ))}
          </select>
        </div>
      ))}
      {msg && <Toast text={msg} close={() => setMsg("")} />}
    </div>
  );
}
function People({ page }: { page: string }) {
  const type = page === "Drivers" ? "drivers" : "employees",
    isDriver = type === "drivers";
  const empty = isDriver
    ? {
        driverCode: "",
        name: "",
        email: "",
        phone: "",
        licenseNo: "",
        vehicleNo: "",
        vehicleType: "Sedan",
        status: "AVAILABLE",
      }
    : {
        employeeCode: "",
        name: "",
        email: "",
        phone: "",
        department: "",
        gender: "UNKNOWN",
        pickup: "",
        drop: "",
        status: "ACTIVE",
      };
  const [rows, setRows] = useState<any[]>([]),
    [msg, setMsg] = useState(""),
    [busy, setBusy] = useState(false),
    [showForm, setShowForm] = useState(false),
    [editing, setEditing] = useState<any | null>(null),
    [form, setForm] = useState<any>(empty),
    [search, setSearch] = useState(""),
    [pageNo, setPageNo] = useState(1),
    [pageSize, setPageSize] = useState(25),
    [total, setTotal] = useState(0);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const load = async (p = pageNo, ps = pageSize, q = search) => {
    try {
      const d = await api(
        "/" +
          type +
          "?page=" +
          p +
          "&pageSize=" +
          ps +
          "&search=" +
          encodeURIComponent(q),
      );
      setRows(d.data || []);
      setTotal(d.total || 0);
      setPageNo(d.page || p);
    } catch (e: any) {
      setMsg(e.message);
    }
  };
  useEffect(() => {
    setPageNo(1);
    load(1, pageSize, "");
  }, [page]);
  useEffect(() => {
    const t = setTimeout(() => load(1, pageSize, search), 250);
    return () => clearTimeout(t);
  }, [search, pageSize, type]);
  const openAdd = () => {
    setEditing(null);
    setForm({ ...empty });
    setShowForm(true);
  };
  const openEdit = (r: any) => {
    setEditing(r);
    setForm({ ...r });
    setShowForm(true);
  };
  const saveManual = async () => {
    try {
      setBusy(true);
      const payload = { ...form };
      delete payload.id;
      delete payload.userId;
      delete payload.createdAt;
      if (editing)
        await api("/" + type + "/" + editing.id, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      else
        await api("/" + type, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      setMsg(editing ? "Updated successfully" : "Registered successfully");
      setShowForm(false);
      setEditing(null);
      await load(editing ? pageNo : 1, pageSize, search);
    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  };
  const remove = async (r: any) => {
    if (!confirm("Delete " + r.name + "? This cannot be undone.")) return;
    try {
      setBusy(true);
      await api("/" + type + "/" + r.id, { method: "DELETE" });
      setMsg("Deleted successfully");
      const next = rows.length === 1 && pageNo > 1 ? pageNo - 1 : pageNo;
      await load(next, pageSize, search);
    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  };
  const exportExcel = async () => {
    try {
      setBusy(true);
      const token = localStorage.getItem("rideops_token"),
        r = await fetch(API + "/export/" + type, {
          headers: { Authorization: "Bearer " + token },
        });
      if (!r.ok) throw new Error("Export failed");
      const blob = await r.blob(),
        url = URL.createObjectURL(blob),
        a = document.createElement("a");
      a.href = url;
      a.download = type + ".xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setMsg("Excel exported successfully");
    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  };
  const importExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setBusy(true);
        const r = await api("/" + type + "/import", {
          method: "POST",
          body: JSON.stringify({ fileBase64: String(reader.result || "") }),
        });
        setMsg(r.message || "Import completed");
        await load(1, pageSize, search);
      } catch (e: any) {
        setMsg(e.message);
      } finally {
        setBusy(false);
      }
    };
    reader.readAsDataURL(file);
  };
  const fields = isDriver
    ? [
        ["driverCode", "Driver ID"],
        ["name", "Driver Name"],
        ["email", "Email"],
        ["phone", "Phone"],
        ["licenseNo", "License No"],
        ["vehicleNo", "Vehicle Number"],
        ["vehicleType", "Vehicle Type"],
      ]
    : [
        ["employeeCode", "Employee ID"],
        ["name", "Employee Name"],
        ["email", "Email"],
        ["phone", "Phone"],
        ["department", "Department"],
        ["pickup", "Pickup Location"],
        ["drop", "Drop Location"],
      ];
  return (
    <div className="content">
      <div className="toolbar">
        <div>
          <span className="eyebrow">REGISTRATION MANAGEMENT</span>
          <h2>{page}</h2>
        </div>
        <div className="actions excelActions">
          <button className="primary" onClick={openAdd}>
            <Plus size={15} /> Add {isDriver ? "Driver" : "Employee"}
          </button>
          <label className="secondary fileBtn">
            <Upload size={15} /> Import Excel
            <input
              type="file"
              accept=".xlsx,.xls"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) importExcel(f);
                e.currentTarget.value = "";
              }}
            />
          </label>
          <button className="secondary" onClick={exportExcel} disabled={busy}>
            <Download size={15} /> Export Excel
          </button>
        </div>
      </div>
      <div className="panel">
        <div className="peopleControls">
          <div className="searchBox">
            <Search size={17} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                "Search " + (isDriver ? "drivers" : "employees") + "..."
              }
            />
          </div>
          <span className="muted">{total.toLocaleString()} total</span>
        </div>
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                {fields.map((f) => (
                  <th key={f[0]}>{f[1]}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  {fields.map((f) => (
                    <td key={f[0]}>{String(r[f[0]] ?? "")}</td>
                  ))}
                  <td>
                    <div className="rowActions">
                      <button
                        className="secondary small"
                        onClick={() => openEdit(r)}
                        disabled={busy}
                      >
                        Edit
                      </button>
                      <button
                        className="danger small"
                        onClick={() => remove(r)}
                        disabled={busy}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && <div className="empty">No {type} found.</div>}
        </div>
        <div className="pagination">
          <span>
            Showing {total ? (pageNo - 1) * pageSize + 1 : 0}–
            {Math.min(pageNo * pageSize, total)} of {total.toLocaleString()}
          </span>
          <label>
            Rows{" "}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPageNo(1);
              }}
            >
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>
          <button
            className="secondary small"
            disabled={pageNo <= 1 || busy}
            onClick={() => load(pageNo - 1, pageSize, search)}
          >
            Previous
          </button>
          <span>
            Page {pageNo} of {totalPages}
          </span>
          <button
            className="secondary small"
            disabled={pageNo >= totalPages || busy}
            onClick={() => load(pageNo + 1, pageSize, search)}
          >
            Next
          </button>
        </div>
      </div>
      {showForm && (
        <div className="modalBackdrop">
          <div className="modal">
            <div className="modalHead">
              <div>
                <span className="eyebrow">
                  {editing ? "EDIT" : "NEW"} REGISTRATION
                </span>
                <h3>
                  {editing ? "Edit" : "Add"} {isDriver ? "Driver" : "Employee"}
                </h3>
              </div>
              <button className="iconBtn" onClick={() => setShowForm(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="formGrid">
              {fields.map((f) => (
                <label key={f[0]}>
                  {f[1]}
                  <input
                    value={form[f[0]] || ""}
                    onChange={(e) =>
                      setForm({ ...form, [f[0]]: e.target.value })
                    }
                  />
                </label>
              ))}
              <label>
                Status
                <select
                  value={form.status || ""}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {(isDriver
                    ? ["AVAILABLE", "ON_TRIP", "OFFLINE"]
                    : ["ACTIVE", "INACTIVE"]
                  ).map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              {!isDriver && (
                <label>
                  Gender
                  <select
                    value={form.gender || "UNKNOWN"}
                    onChange={(e) =>
                      setForm({ ...form, gender: e.target.value })
                    }
                  >
                    <option>UNKNOWN</option>
                    <option>MALE</option>
                    <option>FEMALE</option>
                    <option>OTHER</option>
                  </select>
                </label>
              )}
            </div>
            <div className="modalActions">
              <button className="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button className="primary" onClick={saveManual} disabled={busy}>
                {editing ? "Save Changes" : "Register"}
              </button>
            </div>
          </div>
        </div>
      )}
      {msg && <Toast text={msg} close={() => setMsg("")} />}
    </div>
  );
}
function Simple({ page, user }: { page: string; user: any }) {
  return (
    <div className="content">
      <div className="panel">
        <span className="eyebrow">{page.toUpperCase()}</span>
        <h2>{page}</h2>
        <p>
          Role: {labels[user.role]}. This module uses the same authenticated
          RideOps backend.
        </p>
      </div>
    </div>
  );
}
function Toast({ text, close }: { text: string; close: () => void }) {
  return (
    <div className="toast">
      <CheckCircle2 size={17} />
      {text}
      <button onClick={close}>×</button>
    </div>
  );
}
createRoot(document.getElementById("root")!).render(<App />);


function EnterpriseModule({page}:{page:string}){
  const [rows,setRows]=useState<any[]>([]);
  const [report,setReport]=useState<any>({});
  const [msg,setMsg]=useState("");
  const [form,setForm]=useState<any>({});
  const endpoint:any={Fleet:"/fleet",Vendors:"/vendors",Shifts:"/shifts",Routes:"/routes",Safety:"/safety-alerts"};
  const load=async()=>{
    try{
      if(page==="Reports"){setReport(await api("/reports/summary"));return}
      const d=await api(endpoint[page]);
      setRows(d);
    }catch(e:any){setMsg(e.message)}
  };
  useEffect(()=>{load()},[page]);
  const create=async()=>{
    try{
      const body=page==="Routes"?{...form,stops:String(form.stops||"").split(",").map((x:string)=>x.trim()).filter(Boolean)}:form;
      await api(endpoint[page],{method:"POST",body:JSON.stringify(body)});
      setForm({});setMsg(`${page} record created successfully.`);load();
    }catch(e:any){setMsg(e.message)}
  };
  const titles:any={
    Fleet:["Fleet & Vehicles","Manage vehicle capacity, availability and compliance."],
    Vendors:["Transport Vendors","Manage fleet partners, SLA and contact information."],
    Shifts:["Shift Management","Configure employee transport windows and demand."],
    Routes:["Routes & Stops","Manage optimized transport corridors and pickup stops."],
    Safety:["Safety Command Centre","Monitor SOS and operational safety alerts."],
    Reports:["Mobility Analytics","Operational KPIs for your employee transportation network."]
  };
  if(page==="Reports") return <div className="content">
    <div className="toolbar"><div><span className="eyebrow">TRANSPORT INTELLIGENCE</span><h2>{titles.Reports[0]}</h2><p>{titles.Reports[1]}</p></div><button className="secondary" onClick={load}><RefreshCw size={15}/> Refresh</button></div>
    <div className="stats">
      {[
        ["Employees",report.employees],["Drivers",report.drivers],["Vehicles",report.vehicles],["Vendors",report.vendors],
        ["Total Trips",report.totalTrips],["Completed",report.completed],["Active",report.active],["Open Alerts",report.openAlerts]
      ].map(([l,v])=><Stat key={String(l)} label={String(l)} value={v??0} icon={BarChart3}/>)}
    </div>
    <div className="panel"><h3>Operations snapshot</h3><div className="reportGrid">
      <div><span>Routes</span><b>{report.routes??0}</b></div><div><span>Shifts</span><b>{report.shifts??0}</b></div>
      <div><span>GPS points</span><b>{report.gpsPoints??0}</b></div><div><span>Cancelled</span><b>{report.cancelled??0}</b></div>
      <div><span>Distance tracked</span><b>{report.totalDistanceKm??0} km</b></div>
    </div></div>
    {msg&&<Toast text={msg} close={()=>setMsg("")}/>}
  </div>;
  if(page==="Safety") return <div className="content">
    <div className="toolbar"><div><span className="eyebrow">24×7 SAFETY WORKSPACE</span><h2>{titles.Safety[0]}</h2><p>{titles.Safety[1]}</p></div><button className="secondary" onClick={load}><RefreshCw size={15}/> Refresh</button></div>
    {rows.map(a=><div className="panel alertRow" key={a.id}><div><span className="eyebrow">{a.type} • {a.severity}</span><h3>{a.message}</h3><p>{a.tripId||"No trip linked"} • {new Date(a.createdAt).toLocaleString("en-IN")}</p></div><span className="pill">{a.status}</span>{a.status==="OPEN"&&<button className="secondary" onClick={async()=>{await api("/safety-alerts/"+a.id+"/resolve",{method:"POST"});load()}}>Resolve</button>}</div>)}
    {!rows.length&&<div className="panel empty">No safety alerts.</div>}
    {msg&&<Toast text={msg} close={()=>setMsg("")}/>}
  </div>;
  return <div className="content">
    <div className="toolbar"><div><span className="eyebrow">ENTERPRISE MOBILITY</span><h2>{titles[page][0]}</h2><p>{titles[page][1]}</p></div><button className="secondary" onClick={load}><RefreshCw size={15}/> Refresh</button></div>
    <div className="panel">
      <div className="formGrid">
        {page==="Fleet"&&<><label>Vehicle number<input value={form.vehicleNo||""} onChange={e=>setForm({...form,vehicleNo:e.target.value})} placeholder="MH12 AB 1234"/></label><label>Type<select value={form.vehicleType||"Sedan"} onChange={e=>setForm({...form,vehicleType:e.target.value})}><option>Sedan</option><option>SUV</option><option>Hatchback</option><option>Shuttle Bus</option></select></label><label>Capacity<input type="number" value={form.capacity||4} onChange={e=>setForm({...form,capacity:e.target.value})}/></label><label>Fuel type<select value={form.fuelType||"CNG"} onChange={e=>setForm({...form,fuelType:e.target.value})}><option>CNG</option><option>EV</option><option>Diesel</option><option>Petrol</option></select></label></>}
        {page==="Vendors"&&<><label>Vendor name<input value={form.name||""} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Vendor company"/></label><label>Contact<input value={form.contact||""} onChange={e=>setForm({...form,contact:e.target.value})}/></label><label>Email<input value={form.email||""} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>Vehicles<input type="number" value={form.vehicles||0} onChange={e=>setForm({...form,vehicles:e.target.value})}/></label></>}
        {page==="Shifts"&&<><label>Shift name<input value={form.name||""} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Night Shift"/></label><label>Start<input type="time" value={form.start||""} onChange={e=>setForm({...form,start:e.target.value})}/></label><label>End<input type="time" value={form.end||""} onChange={e=>setForm({...form,end:e.target.value})}/></label><label>Employees<input type="number" value={form.employees||0} onChange={e=>setForm({...form,employees:e.target.value})}/></label></>}
        {page==="Routes"&&<><label>Route name<input value={form.name||""} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Kharadi → Hinjewadi"/></label><label>Direction<select value={form.direction||"OFFICE"} onChange={e=>setForm({...form,direction:e.target.value})}><option>OFFICE</option><option>HOME</option></select></label><label className="wide">Stops<input value={form.stops||""} onChange={e=>setForm({...form,stops:e.target.value})} placeholder="Kharadi, Viman Nagar, Yerwada, Hinjewadi"/></label><label>Distance km<input type="number" value={form.distanceKm||0} onChange={e=>setForm({...form,distanceKm:e.target.value})}/></label></>}
      </div>
      <button className="primary" onClick={create}><PlusCircle size={16}/> Add {page.slice(0,-1)||"Record"}</button>
      {msg&&<div className="successBox">{msg}</div>}
    </div>
    <div className="panel tableWrap"><table><thead><tr>{Object.keys(rows[0]||{}).filter(k=>!["id","userId"].includes(k)).slice(0,8).map(k=><th key={k}>{k}</th>)}</tr></thead><tbody>{rows.map((r:any)=><tr key={r.id}>{Object.keys(r).filter(k=>!["id","userId"].includes(k)).slice(0,8).map(k=><td key={k}>{Array.isArray(r[k])?r[k].join(" • "):String(r[k]??"")}</td>)}</tr>)}</tbody></table>{!rows.length&&<div className="empty">No records found.</div>}</div>
  </div>;
}
