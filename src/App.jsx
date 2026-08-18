import React, { useMemo, useState } from "react";
import {
  Bell, BookOpen, CalendarDays, CheckCircle2, ClipboardList, Home,
  Moon, Plus, Search, Settings, Sun, Target, Trash2, X, ArrowLeft, ExternalLink, FileText
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "./App.css";

const initialTasks = [
  { id: 1, title: "Complete React Assignment", subject: "React", priority: "High", due: "18 May, 10:00 AM", completed: false, description: "Build custom hooks component." },
  { id: 2, title: "Prepare OS Lab Record", subject: "Operating Systems", priority: "Medium", due: "18 May, 12:00 PM", completed: false, description: "CPU scheduling algorithms." },
  { id: 3, title: "Submit Maths Assignment", subject: "Maths", priority: "Low", due: "17 May, 11:59 PM", completed: true, description: "Linear algebra problem set." },
  { id: 4, title: "Study DBMS Chapter 3", subject: "DBMS", priority: "High", due: "18 May, 03:00 PM", completed: false, description: "Normalization forms." },
  { id: 5, title: "Read Computer Graphics Notes", subject: "Computer Graphics", priority: "Medium", due: "18 May, 05:00 PM", completed: false, description: "Rasterization techniques." },
  { id: 6, title: "Revise Java OOP Concepts", subject: "Java", priority: "Low", due: "19 May, 09:00 AM", completed: false, description: "Polymorphism and Interfaces." }
];

const initialSubjects = [
  { name: "DBMS", color: "#20a866", link: "#" },
  { name: "Operating Systems", color: "#f5aa13", link: "#" },
  { name: "Computer Graphics", color: "#2d91e8", link: "#" },
  { name: "Maths", color: "#e84545", link: "#" },
  { name: "Java", color: "#9b59b6", link: "#" }
];

const navItems = [
  { label: "Dashboard", icon: Home },
  { label: "My Tasks", icon: ClipboardList },
  { label: "Subjects", icon: BookOpen },
  { label: "Calendar", icon: CalendarDays },
  { label: "Completed", icon: CheckCircle2 },
  { label: "Reminders", icon: Bell },
  { label: "Settings", icon: Settings }
];

function StatCard({ icon: Icon, value, label, tone }) {
  return (
    <div className={`stat-card ${tone}`}>
      <div className="stat-icon"><Icon size={22} /></div>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function Priority({ value }) {
  return <span className={`priority ${value ? value.toLowerCase() : "medium"}`}>{value}</span>;
}

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [subjects, setSubjects] = useState(initialSubjects);
  const [page, setPage] = useState("Dashboard");
  const [dark, setDark] = useState(false);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [filter, setFilter] = useState("All");
  const [selectedSubject, setSelectedSubject] = useState(null); // For Subject Detail view
  
  const [newTask, setNewTask] = useState({
    title: "", description: "", subject: "React", priority: "Medium", due: ""
  });

  const [newSubject, setNewSubject] = useState({
    name: "", color: "#6545df"
  });

  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.length - completed;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  const subjectData = useMemo(() => {
    return subjects.map(sub => {
      const count = tasks.filter(t => t.subject === sub.name).length;
      return { name: sub.name, value: count, color: sub.color };
    });
  }, [subjects, tasks]);

  const visibleTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === "All" ||
        (filter === "Pending" && !task.completed) ||
        (filter === "Completed" && task.completed);
      return matchesSearch && matchesFilter;
    });
  }, [tasks, search, filter]);

  function toggleTask(id) {
    setTasks(current => current.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  }
  
  function deleteTask(id) {
    setTasks(current => current.filter(t => t.id !== id));
  }

  function addTask(e) {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    setTasks(current => [
      ...current,
      {
        id: Date.now(),
        title: newTask.title,
        description: newTask.description,
        subject: newTask.subject,
        priority: newTask.priority,
        due: newTask.due || "No due date",
        completed: false
      }
    ]);
    setNewTask({ title: "", description: "", subject: "React", priority: "Medium", due: "" });
    setShowAdd(false);
  }

  function addSubject(e) {
    e.preventDefault();
    if (!newSubject.name.trim()) return;
    if (subjects.some(s => s.name.toLowerCase() === newSubject.name.toLowerCase())) return;
    
    setSubjects(current => [...current, newSubject]);
    setNewSubject({ name: "", color: "#6545df", link: "" });
    setShowAddSubject(false);
  }

  const pageTitle = page === "Dashboard" ? "Dashboard" : page;

  return (
    <div className={dark ? "app dark" : "app"}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">🎓</div>
          <div><h2>StudyTask</h2><small>Student To-Do App</small></div>
        </div>

        <nav>
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={page === label && !selectedSubject ? "nav-item active" : "nav-item"}
              onClick={() => { setPage(label); setSelectedSubject(null); }}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="profile">
          <div className="avatar">👨‍🎓</div>
          <div><strong>Arpan</strong><small>Computer Engineering</small><small>6th Semester</small></div>
        </div>

        <button className="theme-toggle" onClick={() => setDark(!dark)}>
          {dark ? <Sun size={18}/> : <Moon size={18}/>}
          <span>{dark ? "Light Mode" : "Dark Mode"}</span>
          <span className={`switch ${dark ? "on" : ""}`}><i /></span>
        </button>
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <h1>{pageTitle === "Dashboard" ? "Good Morning, Arpan! 👋" : pageTitle}</h1>
            <p>{pageTitle === "Dashboard" ? "Stay focused and complete your tasks" : "Manage your student tasks and stay organized."}</p>
          </div>
          <div className="header-actions">
            <div className="search">
              <Search size={18}/>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..." />
            </div>
          </div>
        </header>

        {/* --- SUBJECT DETAIL VIEW --- */}
        {selectedSubject ? (
          <section className="card page-card">
            <div className="page-toolbar" style={{ alignItems: "center", marginBottom: "20px" }}>
              <button className="secondary" onClick={() => setSelectedSubject(null)} style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <ArrowLeft size={16}/> Back to Subjects
              </button>
             
            </div>

            <div className="subject-detail-header" style={{ display: "flex", gap: "15px", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: selectedSubject.color }}></div>
              <h2>{selectedSubject.name} Dashboard</h2>
            </div>

            <div style={{ marginBottom: "25px" }}>
              <h3>Related Tasks</h3>
              <TaskList 
                tasks={tasks.filter(t => t.subject === selectedSubject.name)} 
                toggleTask={toggleTask} 
                deleteTask={deleteTask}
              />
            </div>
          </section>
        ) : (
          <>
            {/* --- DASHBOARD VIEW --- */}
            {page === "Dashboard" && (
              <>
                <section className="stats">
                  <StatCard icon={ClipboardList} value={tasks.length} label="Total Tasks" tone="purple"/>
                  <StatCard icon={Target} value={pending} label="Pending Tasks" tone="orange"/>
                  <StatCard icon={CheckCircle2} value={completed} label="Completed" tone="green"/>
                  <StatCard icon={CalendarDays} value="3" label="Due Today" tone="blue"/>
                </section>
            
                <section className="dashboard-grid">
                  <div className="card tasks-card">
                    <div className="card-heading"><h2>Today's Tasks</h2><button onClick={() => setPage("My Tasks")}>View All</button></div>
                    <TaskList tasks={visibleTasks.slice(0, 5)} toggleTask={toggleTask} deleteTask={deleteTask}/>
                    <div className="progress"> 
                      <div className="progress-label"><span>Today's Progress</span><b>{progress}%</b></div>
                      <div className="progress-track"><div style={{width: `${progress}%`}} /></div>
                    </div>
                  </div>

                  <div className="card chart-card">
                    <div className="card-heading"><h2>Tasks by Subject</h2></div>
                    <div className="chart-wrap">
                      <ResponsiveContainer width="100%" height={190}>
                        <PieChart>
                          <Pie data={subjectData} dataKey="value" innerRadius={52} outerRadius={78} paddingAngle={2}>
                            {subjectData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="chart-center"><strong>{tasks.length}</strong><span>Total</span></div>
                    </div>
                    <div className="legend">
                      {subjectData.map((s) => <div key={s.name}><i style={{background: s.color}}/>{s.name}<span>{s.value} Tasks</span></div>)}
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* --- SUBJECTS PAGE --- */}
            {page === "Subjects" && (
              <section className="card page-card">
                <div className="page-toolbar">
                  <h2>All Subjects</h2>
                  <button className="primary" onClick={() => setShowAddSubject(true)}><Plus size={18}/> Add Subject</button>
                </div>
                
                <div className="subjects-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px", marginTop: "20px" }}>
                  {subjects.map(sub => {
                    const subTasks = tasks.filter(t => t.subject === sub.name);
                    const subCompleted = subTasks.filter(t => t.completed).length;
                    const subProgress = subTasks.length ? Math.round((subCompleted / subTasks.length) * 100) : 0;

                    return (
                      <div 
                        key={sub.name} 
                        className="card subject-card" 
                        onClick={() => setSelectedSubject(sub)}
                        style={{ cursor: "pointer", borderTop: `4px solid ${sub.color}`, padding: "20px", transition: "transform 0.2s" }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                          <h3 style={{ margin: 0, fontSize: "18px" }}>{sub.name}</h3>
                          <span style={{ fontSize: "12px", padding: "3px 8px", background: "rgba(0,0,0,0.05)", borderRadius: "12px" }}>
                            {subCompleted} / {subTasks.length} Done
                          </span>
                        </div>
                        
                        <div className="progress" style={{ margin: "15px 0 5px 0" }}>
                          <div className="progress-track"><div style={{ width: `${subProgress}%`, background: sub.color }} /></div>
                        </div>
                        <small style={{ color: "var(--text-muted)", display: "flex", justifyContent: "flex-end" }}>{subProgress}% Completed</small>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {page === "My Tasks" && (
              <section className="card page-card">
                <div className="page-toolbar">
                  <div className="filters">
                    {["All", "Pending", "Completed"].map(f => <button className={filter === f ? "selected" : ""} onClick={() => setFilter(f)} key={f}>{f}</button>)}
                  </div>
                  <button className="primary" onClick={() => setShowAdd(true)}><Plus size={18}/> Add Task</button>
                </div>
                <TaskList tasks={visibleTasks} toggleTask={toggleTask} deleteTask={deleteTask}/>
              </section>
            )}

            {page === "Completed" && (
              <section className="card page-card">
                <h2>Completed Tasks</h2>
                <TaskList tasks={tasks.filter(t => t.completed)} toggleTask={toggleTask} deleteTask={deleteTask}/>
              </section>
            )}

            {page !== "Dashboard" && page !== "My Tasks" && page !== "Completed" && page !== "Subjects" && (
              <section className="card empty-page">
                <div className="empty-icon">{page === "Calendar" ? "📅" : page === "Reminders" ? "🔔" : "⚙️"}</div>
                <h2>{page}</h2>
                <p>This section is ready for you to expand next.</p>
                {page === "Reminders" && <button className="primary" onClick={() => setPage("My Tasks")}>View Tasks</button>}
              </section>
            )}
          </>
        )}
      </main>

      <button className="floating" onClick={() => setShowAdd(true)}><Plus size={28}/></button>

      {/* --- ADD TASK MODAL --- */}
      {showAdd && (
        <div className="modal-backdrop" onMouseDown={() => setShowAdd(false)}>
          <form className="modal" onSubmit={addTask} onMouseDown={e => e.stopPropagation()}>
            <div className="modal-heading"><h2>Add New Task</h2><button type="button" onClick={() => setShowAdd(false)}><X/></button></div>
            <label>Task Title<input required value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="Learn useEffect Hook"/></label>
            <label>Description<textarea value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} placeholder="Write task details..."/></label>
            <label>Subject
              <select value={newTask.subject} onChange={e => setNewTask({...newTask, subject: e.target.value})}>
                {subjects.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
            </label>
            <label>Priority<select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}><option>Low</option><option>Medium</option><option>High</option></select></label>
            <label>Due Date<input type="datetime-local" value={newTask.due} onChange={e => setNewTask({...newTask, due: e.target.value})}/></label>
            <button className="primary full" type="submit">Add Task</button>
          </form>
        </div>
      )}

      {/* --- ADD SUBJECT MODAL --- */}
      {showAddSubject && (
        <div className="modal-backdrop" onMouseDown={() => setShowAddSubject(false)}>
          <form className="modal" onSubmit={addSubject} onMouseDown={e => e.stopPropagation()}>
            <div className="modal-heading"><h2>Add New Subject</h2><button type="button" onClick={() => setShowAddSubject(false)}><X/></button></div>
            <label>Subject Name<input required value={newSubject.name} onChange={e => setNewSubject({...newSubject, name: e.target.value})} placeholder="e.g. Physics"/></label>
            <label>Badge Color<input type="color" value={newSubject.color} onChange={e => setNewSubject({...newSubject, color: e.target.value})} style={{ height: "40px", padding: "4px" }}/></label>
            
            <button className="primary full" type="submit">Create Subject</button>
          </form>
        </div>
      )}
    </div>
  );
}

function TaskList({ tasks, toggleTask, deleteTask }) {
  if (!tasks.length) return <div className="no-tasks">No tasks found.</div>;
  return (
    <div className="task-list">
      {tasks.map(task => (
        <div className={`task-row ${task.completed ? "done" : ""}`} key={task.id}>
          <button className="check" onClick={() => toggleTask(task.id)}>{task.completed ? "✓" : ""}</button>
          <div className="task-info"><strong>{task.title}</strong><small>Due: {task.due}</small></div>
          <Priority value={task.priority}/>
          <button className="delete" onClick={() => deleteTask(task.id)} title="Delete task"><Trash2 size={16}/></button>
        </div>
      ))}
    </div>
  );
}

export default App;