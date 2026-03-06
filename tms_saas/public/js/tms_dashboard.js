console.log("TMS Dashboard Loaded")

function qs(selector){
return root_element.querySelector(selector)
}

function setText(selector,value){
let el=qs(selector)
if(el) el.innerText=value
}

/* USER & COMPANY */

function loadUserInfo(){

let company = frappe.defaults.get_user_default("company") || "All Companies"
let user = frappe.session.user_fullname || frappe.session.user

setText("#tms_company",company)
setText("#tms_user",user)

}

/* LIVE CLOCK */

function startClock(){

function update(){

let now=new Date()

let formatted=now.toLocaleString("en-IN",{
weekday:"short",
day:"2-digit",
month:"short",
year:"numeric",
hour:"2-digit",
minute:"2-digit",
second:"2-digit"
})

setText("#tms_time",formatted)

}

update()
setInterval(update,1000)

}

/* DASHBOARD DATA */

function loadDashboard(){

frappe.call({

method:"tms_saas.api.dashboard.get_dashboard_data",

callback:function(r){

let d=r.message

setText("#total_trips",d.total_trips)
setText("#vehicles",d.vehicles)
setText("#drivers",d.drivers)

setText("#running_trips",d.running_trips)
setText("#completed_trips",d.completed_trips)
setText("#planned_trips",d.planned_trips)

setText("#pending_billing",d.pending_billing)

setText("#drivers_available",d.drivers_available)
setText("#drivers_on_trip",d.drivers_on_trip)
setText("#drivers_leave",d.drivers_leave)

setText("#vehicles_on_trip",d.vehicles_on_trip)
setText("#vehicles_empty",d.vehicles_empty)
setText("#vehicles_maintenance",d.vehicles_maintenance)

/* LATEST TRIPS */

let html=""

d.latest_trips.forEach(t=>{

html+=`
<tr>
<td>${t.name}</td>
<td>${t.vehicle || ""}</td>
<td>${t.driver || ""}</td>
<td>${t.from || ""}</td>
<td>${t.to || ""}</td>
<td>${t.current_location || ""}</td>
<td>${t.trip_status || ""}</td>
</tr>
`

})

qs("#trip_rows").innerHTML=html

}

})

}

/* CLICK ROUTES */

function bindRoutes(){

root_element.querySelectorAll(".clickable").forEach(el=>{

el.addEventListener("click",function(){

let route=this.getAttribute("data-route")

if(route){
frappe.set_route("List",route)
}

})

})

}

/* INIT */

setTimeout(()=>{

loadUserInfo()
startClock()
loadDashboard()
bindRoutes()

},600)
