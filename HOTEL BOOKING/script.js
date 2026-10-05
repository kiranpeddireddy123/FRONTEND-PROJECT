const hotels=[
{id:1,n:"Grand Palace Hotel",c:"Hyderabad",p:2500,r:4.8,i:"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700"},
{id:2,n:"Ocean View Resort",c:"Goa",p:4500,r:4.9,i:"https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=700"},
{id:3,n:"Royal Garden Resort",c:"Bangalore",p:3200,r:4.7,i:"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=700"},
{id:4,n:"Sunrise Luxury Hotel",c:"Chennai",p:1800,r:4.5,i:"https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=700"},
{id:5,n:"City Star Hotel",c:"Delhi",p:2900,r:4.6,i:"https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=700"},
{id:6,n:"Mountain View Resort",c:"Manali",p:3800,r:4.8,i:"https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=700"}
];

let bookings=JSON.parse(localStorage.getItem("bookings")||"[]");
let selected=null;

const $=id=>document.getElementById(id);

function display(data=hotels){
$("list").innerHTML=data.map(h=>`
<div class="card">
<img src="${h.i}">
<div>
<h3>${h.n}</h3>
<p>📍 ${h.c}</p>
<p>⭐ ${h.r}</p>
<p class="price">₹${h.p}/night</p>
<button class="btn" onclick="openBook(${h.id})">Book Now</button>
</div>
</div>`).join("")||"<p>No hotels found</p>";
}

function filter(){
let s=$("search").value.toLowerCase();
let c=$("city").value;
let p=$("price").value;
display(hotels.filter(h=>
(h.n+h.c).toLowerCase().includes(s)&&
(!c||h.c===c)&&
(!p||h.p<=Number(p))
));
}

function showLogin(){
closeAll();
$("login").style.display="flex";
$("lm").innerText="";
}

function showSignup(){
closeAll();
$("signup").style.display="flex";
$("sm").innerText="";
}

function closeAll(){
document.querySelectorAll(".modal").forEach(m=>{
m.style.display="none";
});
}

function signup(){
let name=$("sn").value.trim();
let email=$("se").value.trim();
let phone=$("sp").value.trim();
let password=$("sx").value;
let confirm=$("sc").value;

if(!name||!email||!phone||!password){
$("sm").innerText="Please fill all fields";
return;
}

if(password!==confirm){
$("sm").innerText="Passwords do not match";
return;
}

if(!email.includes("@")){
$("sm").innerText="Enter a valid email";
return;
}

let user={
name:name,
email:email,
phone:phone,
password:password
};

localStorage.setItem("user",JSON.stringify(user));
localStorage.setItem("current",email);

$("sm").style.color="green";
$("sm").innerText="Account created successfully";

setTimeout(()=>{
closeAll();
alert("Account created and logged in!");
},700);
}

function login(){
let email=$("le").value.trim();
let password=$("lp").value;
let type=$("type").value;

$("lm").style.color="red";

if(!email||!password){
$("lm").innerText="Please enter email and password";
return;
}

if(type==="admin"){
if(email==="admin@gmail.com"&&password==="123456"){
closeAll();
showAdmin();
}else{
$("lm").innerText="Wrong admin email or password";
}
return;
}

let user=JSON.parse(
localStorage.getItem("user")||"null"
);

if(
user&&
user.email===email&&
user.password===password
){
localStorage.setItem("current",email);
closeAll();
alert("Customer login successful!");
}else{
$("lm").innerText="Wrong customer email or password";
}
}

function openBook(id){
if(!localStorage.getItem("current")){
alert("Please login before booking");
showLogin();
return;
}

selected=hotels.find(h=>h.id===id);

$("info").innerHTML=`
<h3>${selected.n}</h3>
<p>📍 ${selected.c}</p>
<p>⭐ ${selected.r}</p>
<p>₹${selected.p} per night</p>
`;

$("book").style.display="flex";
}

function book(){
let checkin=$("in").value;
let checkout=$("out").value;
let guests=Number($("guests").value);

if(!checkin||!checkout){
alert("Please select check-in and check-out dates");
return;
}

if(new Date(checkout)<=new Date(checkin)){
alert("Check-out must be after check-in");
return;
}

if(guests<1){
alert("Enter valid number of guests");
return;
}

let user=JSON.parse(
localStorage.getItem("user")||"null"
);

if(!user){
alert("Please login again");
showLogin();
return;
}

let nights=
(new Date(checkout)-new Date(checkin))
/86400000;

let booking={
id:"BK"+Date.now(),
customer:user.name,
email:user.email,
phone:user.phone,
hotel:selected.n,
city:selected.c,
in:checkin,
out:checkout,
guests:guests,
nights:nights,
amount:selected.p*nights,
status:"Confirmed"
};

bookings.push(booking);

localStorage.setItem(
"bookings",
JSON.stringify(bookings)
);

closeAll();

alert(
"Booking confirmed!\nTotal: ₹"+
booking.amount
);

myBookings();
}

function myBookings(){
$("my").style.display="block";

$("my").scrollIntoView({
behavior:"smooth"
});

let email=localStorage.getItem("current");

if(!email){
$("mylist").innerHTML=`
<div class="booking">
<h3>Please login first</h3>
<button class="btn" onclick="showLogin()">Login</button>
</div>`;
return;
}

let data=bookings.filter(
b=>b.email===email
);

if(!data.length){
$("mylist").innerHTML=`
<div class="booking">
<h3>No bookings found</h3>
<p>Book a hotel to see your reservation here.</p>
</div>`;
return;
}

$("mylist").innerHTML=data.reverse().map(b=>`
<div class="booking">
<h3>🏨 ${b.hotel}</h3>
<p><b>Booking ID:</b> ${b.id}</p>
<p><b>Customer:</b> ${b.customer}</p>
<p><b>Email:</b> ${b.email}</p>
<p><b>Phone:</b> ${b.phone}</p>
<p><b>Location:</b> ${b.city}</p>
<p><b>Check-in:</b> ${b.in}</p>
<p><b>Check-out:</b> ${b.out}</p>
<p><b>Nights:</b> ${b.nights}</p>
<p><b>Guests:</b> ${b.guests}</p>
<p><b>Amount:</b> ₹${b.amount}</p>
<p><b>Status:</b> ${b.status}</p>
</div>
`).join("");
}

function showAdmin(){
document.querySelectorAll("body>nav,body>.hero,body>.search,body>section,body>footer").forEach(e=>{
e.style.display="none";
});

$("admin").style.display="block";

adminData();
}

function adminData(){
let unique=[
...new Set(bookings.map(b=>b.email))
];

$("tb").innerText=bookings.length;
$("tc").innerText=unique.length;
$("cb").innerText=bookings.filter(
b=>b.status==="Confirmed"
).length;

$("tr").innerText="₹"+
bookings.reduce(
(total,b)=>total+Number(b.amount),
0
);

if(!bookings.length){
$("atable").innerHTML=`
<tr>
<td colspan="10">No customer bookings yet</td>
</tr>`;
return;
}

$("atable").innerHTML=bookings.map(b=>`
<tr>
<td>${b.id}</td>
<td>${b.customer}</td>
<td>${b.email}</td>
<td>${b.hotel}</td>
<td>${b.city}</td>
<td>${b.in}</td>
<td>${b.out}</td>
<td>${b.guests}</td>
<td>₹${b.amount}</td>
<td>${b.status}</td>
</tr>
`).join("");
}

function adminLogout(){
$("admin").style.display="none";
location.reload();
}

display();
