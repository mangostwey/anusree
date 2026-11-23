const defaultResources = [
  {name:"Ultimaker S5 3D Printer",type:"Fabrication",dept:"Mechanical",meta:"Carbon fibre-ready · 4 units",icon:"⌁",color:"",status:"Available"},
  {name:"RTX 4090 AI Workstation",type:"Workstation",dept:"Computer Science",meta:"CUDA 12 · 2 units",icon:"◉",color:"purple",status:"Available"},
  {name:"Keysight Oscilloscope",type:"Equipment",dept:"Electrical",meta:"MSO-X 6000 · 6 units",icon:"⌇",color:"green",status:"Available"},
  {name:"DJI Robotics Kit",type:"Development kit",dept:"Robotics",meta:"Sensors, motors & flight stack · 8 units",icon:"◆",color:"",status:"Available"},
  {name:"Spectrum Analyser",type:"Equipment",dept:"Electronics",meta:"9 kHz–26.5 GHz · 3 units",icon:"◒",color:"amber",status:"Available"},
  {name:"Meta Quest 3 Lab",type:"Workstation",dept:"Computer Science",meta:"VR testing suite · 5 units",icon:"◫",color:"purple",status:"Available"},
  {name:"CNC Milling Station",type:"Fabrication",dept:"Mechanical",meta:"5-axis · 2 units",icon:"⌘",color:"green",status:"Maintenance"},
  {name:"FPGA Development Board",type:"Development kit",dept:"Electronics",meta:"Xilinx Zynq · 10 units",icon:"▦",color:"amber",status:"Available"},
  {name:"EV Battery Test Bench",type:"Equipment",dept:"Electrical",meta:"Bidirectional DC · 2 units",icon:"ϟ",color:"green",status:"Available"},
  {name:"Industrial Robot Arm",type:"Robotics",dept:"Robotics",meta:"UR5e · 1 unit",icon:"⌖",color:"purple",status:"Available"},
  {name:"Wind Tunnel",type:"Testing",dept:"Mechanical",meta:"Subsonic · 1 unit",icon:"≋",color:"",status:"Available"},
  {name:"Embedded Sensor Kit",type:"Development kit",dept:"Electronics",meta:"LoRa, BLE & IMU · 12 units",icon:"◎",color:"green",status:"Available"}
];

let resources = JSON.parse(localStorage.getItem("lablink_resources") || "null") || defaultResources;
let bookings = JSON.parse(localStorage.getItem("lablink_bookings") || "null") || [
  {title:"Robotics Lab",meta:"09:30 – 11:30 AM · Lab 204",color:"blue",date:"23"},
  {title:"Advanced Manufacturing",meta:"01:00 – 03:00 PM · Workshop B",color:"green",date:"23"}
];
let projects = JSON.parse(localStorage.getItem("lablink_projects") || "null") || [
  {title:"Solar Drone Navigation",desc:"Autonomous flight and energy optimisation",team:["AR","MK","JD"],progress:72,status:"Approved",deadline:"30 Nov"},
  {title:"EV Battery Monitoring",desc:"Thermal sensing and predictive analysis",team:["AR","SL"],progress:48,status:"In review",deadline:"12 Dec"}
];
let approvals = JSON.parse(localStorage.getItem("lablink_approvals") || "null") || [
  {initials:"MK",name:"Meera Kapoor",detail:"Ultimaker S5 · 24 Nov · 10:30 AM",purpose:"Cross-department · Mechanical capstone",time:"18 min ago"},
  {initials:"JD",name:"Jon Davis",detail:"RTX 4090 Workstation · 25 Nov · 02:00 PM",purpose:"Computer vision model training",time:"42 min ago"},
  {initials:"SL",name:"Sara Lee",detail:"Spectrum Analyser · 25 Nov · 11:00 AM",purpose:"Sensor circuit validation",time:"1 hr ago"},
  {initials:"PK",name:"Priya Kumar",detail:"FPGA Board · 26 Nov · 09:00 AM",purpose:"Cross-department · Robotics control",time:"2 hrs ago"}
];

function saveState(){
  localStorage.setItem("lablink_resources",JSON.stringify(resources));
  localStorage.setItem("lablink_bookings",JSON.stringify(bookings));
  localStorage.setItem("lablink_projects",JSON.stringify(projects));
  localStorage.setItem("lablink_approvals",JSON.stringify(approvals));
}

function navigate(page){
  document.querySelectorAll(".page").forEach(el=>el.classList.remove("active"));
  document.getElementById(page).classList.add("active");
  document.querySelectorAll(".nav-item[data-page]").forEach(el=>el.classList.toggle("active",el.dataset.page===page));
  const titles={dashboard:"Good morning, Alex",discover:"Discover resources",projects:"My projects",bookings:"My bookings",approvals:"Booking approvals",analytics:"Resource analytics",maintenance:"Maintenance"};
  const labels={dashboard:"Overview",discover:"Discover",projects:"Projects",bookings:"Bookings",approvals:"Approvals",analytics:"Analytics",maintenance:"Maintenance"};
  document.getElementById("pageTitle").textContent=titles[page];
  document.getElementById("breadcrumbPage").textContent=labels[page];
  document.getElementById("dateLabel").textContent=page==="dashboard"?"MONDAY, 23 NOVEMBER":"LABLINK AI CAMPUS";
}

function renderSchedule(){
  document.getElementById("scheduleList").innerHTML=bookings.slice(0,2).map((b,i)=>`
    <div class="schedule-item ${i?"green":"blue"}">
      <div class="time">${i?"01:00":"09:30"}<br>${i?"PM":"AM"}</div>
      <div class="schedule-info"><h3>${b.title}</h3><p>${i?"Prototype testing":"Autonomous Systems Project"}</p></div>
      <div class="schedule-meta"><span>${i?"Workshop B":"Lab 204"}</span><span>${i?"3 units":"8 units"}</span></div>
    </div>`).join("");
}

function renderRecommendations(){
  const items=[
    {name:"Ultimaker S5 3D Printer",meta:"Best match for rapid prototyping",icon:"⌁",match:"96%"},
    {name:"RTX 4090 AI Workstation",meta:"Ideal for autonomous vision models",icon:"◉",match:"91%"},
    {name:"DJI Robotics Kit",meta:"Available across Robotics dept.",icon:"◆",match:"87%"}
  ];
  document.getElementById("recommendationList").innerHTML=items.map((item,i)=>`
    <div class="rec-item"><div class="rec-icon">${item.icon}</div><div class="rec-info"><h3>${item.name}</h3><p>${item.meta}</p></div><div><span class="match">${item.match}</span><button class="book-mini" data-resource="${item.name}">Book</button></div></div>`).join("");
  bindBookButtons();
}

function renderChart(){
  const heights=[58,72,64,84,68,38,24];
  const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  document.getElementById("utilChart").innerHTML=heights.map((h,i)=>`<div class="bar-col ${i===2?"today":""}" style="height:124px"><i style="height:${h}%"></i><span>${days[i]}</span></div>`).join("");
}

function renderConflictPreview(){
  document.getElementById("conflictPreview").innerHTML=`
    <div class="conflict-card"><div><strong>RTX 4090 · 4 overlapping requests</strong><p>Deadline priority detected: 2 urgent projects</p></div><button class="resolve-btn" data-ai-conflict>Resolve with AI</button></div>
    <div class="conflict-card"><div><strong>Ultimaker S5 · 2 slot conflicts</strong><p>Alternative: Industrial lab at 03:30 PM</p></div><button class="resolve-btn" data-ai-conflict>View options</button></div>`;
  document.querySelectorAll("[data-ai-conflict]").forEach(b=>b.addEventListener("click",()=>openAiConflict()));
}

function renderResources(filter="All",query="",dept="All"){
  const grid=document.getElementById("resourceGrid");
  const filtered=resources.filter(r=>(filter==="All"||r.type===filter||r.status===filter)&&(dept==="All"||r.dept===dept)&&r.name.toLowerCase().includes(query.toLowerCase()));
  grid.innerHTML=filtered.map(r=>`
    <article class="resource-card ${r.status==="Maintenance"?"maintenance-card":""}">
      <div class="card-visual ${r.color}">${r.icon}</div>
      <div class="card-body"><div class="card-top"><h3>${r.name}</h3><span class="department-tag">${r.dept}</span></div><p>${r.meta}</p>
      <div class="card-footer"><span class="availability">${r.status==="Maintenance"?"Under maintenance":r.status}</span><button class="book-mini" data-resource="${r.name}" ${r.status==="Maintenance"?"disabled":""}>${r.status==="Maintenance"?"Unavailable":"Book"}</button></div></div>
    </article>`).join("");
  bindBookButtons();
}

function bindBookButtons(){
  document.querySelectorAll("[data-resource]").forEach(b=>b.addEventListener("click",()=>openBooking(b.dataset.resource)));
}

function openBooking(resourceName){
  document.getElementById("bookingModal").classList.remove("hidden");
  document.getElementById("bookingResource").value=resourceName||"";
  const d=new Date();d.setDate(d.getDate()+1);document.getElementById("bookingDate").value=d.toISOString().slice(0,10);
  checkAvailability();
}

function checkAvailability(){
  const time=document.getElementById("bookingTime").value;
  const resource=document.getElementById("bookingResource").value;
  const box=document.getElementById("availabilityCheck");
  const conflict=time==="10:30 AM"&&resource.includes("RTX");
  box.innerHTML=conflict?`<span style="background:#e49a57">!</span><div><strong>Potential conflict detected</strong><small>AI suggests 01:00 PM or the VR workstation alternative</small></div>`:`<span>✓</span><div><strong>Availability confirmed</strong><small>No double-booking conflicts detected</small></div>`;
}

function renderProjects(){
  document.getElementById("projectGrid").innerHTML=projects.map(p=>`
    <article class="project-card"><div class="project-card-head"><div><h3>${p.title}</h3><p>${p.desc}</p></div><span class="project-status ${p.status==="In review"?"review":""}">${p.status}</span></div>
    <div class="project-team">${p.team.map(t=>`<div class="mini-avatar">${t}</div>`).join("")}<span style="margin-left:12px;font-size:8px;color:#929baa">Deadline · ${p.deadline}</span></div>
    <div class="project-progress"><div class="progress-label"><span>Project readiness</span><b>${p.progress}%</b></div><div class="progress-track"><i style="width:${p.progress}%"></i></div></div></article>`).join("");
}

function renderCalendar(){
  const grid=document.getElementById("calendar");
  const days=[];
  for(let i=26;i<=31;i++)days.push(`<div class="day muted">${i}</div>`);
  for(let i=1;i<=30;i++)days.push(`<div class="day ${i===23?"selected":""}">${i}${i===23||i===25||i===27?' <b style="display:block;margin-top:5px;width:4px;height:4px;border-radius:50%;background:#6680d8;margin-left:auto;margin-right:auto"></b>':''}</div>`);
  grid.innerHTML=days.join("");
  document.getElementById("agendaList").innerHTML=`
    <div class="agenda-card"><div><h3>Robotics Lab · Lab 204</h3><p>09:30 – 11:30 AM · 8 resources</p></div><button>⋯</button></div>
    <div class="agenda-card green"><div><h3>Advanced Manufacturing</h3><p>01:00 – 03:00 PM · 3D Printer</p></div><button>⋯</button></div>
    <div class="agenda-card" style="border-color:#dfa167;background:#fff5e9"><div><h3>EV Battery Test Bench</h3><p>04:00 – 05:00 PM · Pending approval</p></div><button>⋯</button></div>`;
}

function renderApprovals(){
  document.getElementById("approvalList").innerHTML=approvals.map((a,i)=>`
    <article class="approval-card"><div class="request-avatar">${a.initials}</div><div class="approval-info"><h3>${a.name}</h3><p>${a.detail}</p><p>${a.purpose}</p></div><span class="approval-time">Submitted ${a.time}</span><div class="approval-actions"><button class="reject" data-reject="${i}">Decline</button><button class="approve" data-approve="${i}">Approve</button></div></article>`).join("");
  document.querySelectorAll("[data-approve]").forEach(b=>b.addEventListener("click",()=>resolveApproval(+b.dataset.approve,true)));
  document.querySelectorAll("[data-reject]").forEach(b=>b.addEventListener("click",()=>resolveApproval(+b.dataset.reject,false)));
}

function resolveApproval(index,approved){
  const item=approvals[index];if(!item)return;
  approvals.splice(index,1);saveState();renderApprovals();
  showToast(approved?"Request approved":"Request declined",approved?`${item.name}'s resource booking is confirmed.`:`${item.name} has been notified.`);
}

function renderTopResources(){
  const tops=[["1","AI Workstation","86 bookings"],["2","3D Printing Lab","72 bookings"],["3","Oscilloscope","61 bookings"],["4","FPGA Board","54 bookings"]];
  document.getElementById("topResources").innerHTML=tops.map(t=>`<div class="top-row"><b>${t[0]}</b><strong>${t[1]}</strong><span>${t[2]}</span></div>`).join("");
}

function renderMaintenance(){
  const list=resources.filter(r=>r.status==="Maintenance").map(r=>({name:r.name,detail:`${r.dept} · Last inspected 18 Nov`,status:"Maintenance · until 25 Nov"})).concat([
    {name:"Industrial Robot Arm",detail:"Robotics · Preventive inspection",status:"Scheduled · 28 Nov"},
    {name:"Spectrum Analyser",detail:"Electronics · Calibration",status:"Operational"}
  ]);
  document.getElementById("maintenanceList").innerHTML=list.map((m,i)=>`
    <article class="maintenance-card"><div class="maintenance-icon">${i===2?"✓":"⚙"}</div><div><h3>${m.name}</h3><p>${m.detail}</p></div><span class="maintenance-status">${m.status}</span><button class="toggle-maintenance">${i===2?"Mark unavailable":"View schedule"}</button></article>`).join("");
}

function openAiConflict(){
  openAiModal();
  document.getElementById("aiPrompt").value="Resolve the current conflict for the RTX 4090 workstation fairly, considering deadlines and available alternatives.";
  runAiSearch();
}

function openAiModal(){
  document.getElementById("aiModal").classList.remove("hidden");
  document.getElementById("aiResults").innerHTML="";
}

function runAiSearch(){
  const prompt=document.getElementById("aiPrompt").value.toLowerCase();
  let items;
  if(prompt.includes("drone")||prompt.includes("robot")||prompt.includes("autonomous")){
    items=[["DJI Robotics Kit","96% match","Flight controllers, sensors and motor testing · available now"],["RTX 4090 AI Workstation","91% match","Vision model training · Robotics department access"],["3D Printing Lab","88% match","Prototype frame fabrication · 3D printer available"]];
  }else if(prompt.includes("3d")||prompt.includes("printer")||prompt.includes("carbon")){
    items=[["Ultimaker S5 3D Printer","98% match","Carbon fibre compatible · 4 units available"],["CNC Milling Station","84% match","Best for metal enclosures · currently unavailable"]];
  }else if(prompt.includes("battery")||prompt.includes("electrical")||prompt.includes("ev")){
    items=[["EV Battery Test Bench","97% match","Bidirectional DC testing · cross-department approved"],["Spectrum Analyser","89% match","Power-noise and signal validation"]];
  }else{
    items=[["RTX 4090 AI Workstation","94% match","GPU compute for ML, simulation and rendering"],["FPGA Development Board","90% match","Rapid embedded and control-system prototyping"],["Oscilloscope","86% match","Circuit debugging and sensor validation"]];
  }
  document.getElementById("aiResults").innerHTML=items.map((item,i)=>`
    <div class="ai-result"><div class="rec-icon">${i===0?"✦":"◫"}</div><div><strong>${item[0]}</strong><p>${item[2]}</p></div><span class="match">${item[1]}</span></div>`).join("");
}

function showToast(title,message){
  document.getElementById("toastTitle").textContent=title;
  document.getElementById("toastMessage").textContent=message;
  document.getElementById("toast").classList.remove("hidden");
  setTimeout(()=>document.getElementById("toast").classList.add("hidden"),3500);
}

function sendChat(text){
  if(!text.trim())return;
  const messages=document.getElementById("chatMessages");
  messages.insertAdjacentHTML("beforeend",`<div class="user-message">${text.replace(/[<>]/g,"")}</div>`);
  let reply="I can help with that. Which department and deadline should I prioritize?";
  const t=text.toLowerCase();
  if(t.includes("3d"))reply="The Ultimaker S5 is available in the Mechanical department. It supports carbon-fibre composites; I recommend booking 3 hours.";
  else if(t.includes("workstation")||t.includes("gpu")||t.includes("ai"))reply="Two RTX 4090 workstations are available. The next open slot is 01:00 PM, and cross-department access requires faculty approval.";
  else if(t.includes("cross")||t.includes("department"))reply="Cross-department requests go through the host faculty member. I can rank equivalent equipment by suitability and queue priority.";
  else if(t.includes("conflict"))reply="I found four overlapping GPU requests. My fair allocation uses deadline urgency, prior access and project suitability.";
  else if(t.includes("book")||t.includes("booking"))reply="Choose Discover, select a resource, then submit a project-linked slot. Double bookings are blocked automatically.";
  setTimeout(()=>messages.insertAdjacentHTML("beforeend",`<div class="bot-message">${reply}</div>`),280);
  messages.scrollTop=messages.scrollHeight;
}

document.querySelectorAll(".nav-item[data-page]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.page)));
document.querySelectorAll("[data-link]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.link)));
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>document.getElementById(b.dataset.close).classList.add("hidden")));
document.getElementById("newRequestBtn").addEventListener("click",()=>document.getElementById("projectModal").classList.remove("hidden"));
document.getElementById("createProjectBtn").addEventListener("click",()=>document.getElementById("projectModal").classList.remove("hidden"));
document.getElementById("openAiSearch").addEventListener("click",openAiModal);
document.getElementById("aiRecommendBtn").addEventListener("click",openAiModal);
document.getElementById("runAiSearch").addEventListener("click",runAiSearch);
document.getElementById("bookingTime").addEventListener("change",checkAvailability);
document.getElementById("bookingResource").addEventListener("input",checkAvailability);
document.getElementById("equipmentSearch").addEventListener("input",e=>renderResources("All",e.target.value,document.querySelector(".chip.active").dataset.dept));
document.querySelectorAll(".chip").forEach(c=>c.addEventListener("click",()=>{document.querySelectorAll(".chip").forEach(x=>x.classList.remove("active"));c.classList.add("active");renderResources("All",document.getElementById("equipmentSearch").value,c.dataset.dept)}));
document.querySelectorAll(".segmented button").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".segmented button").forEach(x=>x.classList.remove("active"));b.classList.add("active")}));
document.getElementById("bookingForm").addEventListener("submit",e=>{
  e.preventDefault();
  const title=document.getElementById("bookingResource").value;
  const date=new Date(document.getElementById("bookingDate").value).getDate();
  bookings.unshift({title,meta:`${document.getElementById("bookingTime").value} · ${document.getElementById("bookingDuration").value}`,color:"blue",date:String(date)});
  saveState();renderSchedule();renderCalendar();
  document.getElementById("bookingModal").classList.add("hidden");
  showToast("Request submitted","Your booking is queued for faculty approval.");
  e.target.reset();
});
document.getElementById("projectForm").addEventListener("submit",e=>{
  e.preventDefault();
  const title=document.getElementById("projectTitle").value;
  const desc=document.getElementById("projectDescription").value;
  projects.unshift({title,desc,team:["AR","New"],progress:25,status:"Analyzing",deadline:"To be assigned"});
  saveState();renderProjects();document.getElementById("projectModal").classList.add("hidden");
  showToast("AI matching complete","Suitable resources and a team booking plan were generated.");
  openAiModal();
  document.getElementById("aiPrompt").value=desc;
  runAiSearch();
  e.target.reset();
});
document.getElementById("labmateBtn").addEventListener("click",()=>document.getElementById("chatPanel").classList.toggle("hidden"));
document.getElementById("closeChat").addEventListener("click",()=>document.getElementById("chatPanel").classList.add("hidden"));
document.getElementById("chatForm").addEventListener("submit",e=>{e.preventDefault();const input=document.getElementById("chatInput");sendChat(input.value);input.value=""});
document.querySelectorAll(".chat-suggestions button").forEach(b=>b.addEventListener("click",()=>sendChat(b.textContent)));
document.getElementById("roleSwitch").addEventListener("click",()=>{const b=document.querySelector("#roleSwitch b");b.textContent=b.textContent==="Student view"?"Faculty view":"Student view";navigate(b.textContent==="Faculty view"?"approvals":"dashboard")});
document.getElementById("notificationBtn").addEventListener("click",()=>showToast("Notifications","You have 2 pending approvals and 1 booking update."));
document.getElementById("addMaintenanceBtn").addEventListener("click",()=>showToast("Maintenance planner","Select an equipment card to schedule downtime."));
document.querySelector(".status-detail-btn").addEventListener("click",()=>navigate("maintenance"));

renderSchedule();renderRecommendations();renderChart();renderConflictPreview();renderResources();renderProjects();renderCalendar();renderApprovals();renderTopResources();renderMaintenance();
