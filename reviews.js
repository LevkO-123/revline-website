(function(){
"use strict";
const googleList=document.getElementById("googleReviewsList");
const googleStatus=document.getElementById("googleReviewsStatus");
const revlineList=document.getElementById("revlineReviewsList");
const revlineStatus=document.getElementById("revlineReviewsStatus");
const form=document.getElementById("websiteReviewForm");
const formStatus=document.getElementById("websiteReviewStatus");
const fileInput=document.getElementById("reviewPhoto");
const escapeText=value=>String(value||"").trim();
function dateText(value){const date=new Date(value);return Number.isNaN(date.getTime())?"":date.toLocaleDateString(undefined,{year:"numeric",month:"long",day:"numeric"});}
function ratingNumber(value){if(typeof value==="number")return Math.max(1,Math.min(5,Math.round(value)));const ratings={ONE:1,TWO:2,THREE:3,FOUR:4,FIVE:5};return ratings[String(value||"").toUpperCase()]||0;}
function makeCard(review,isGoogle){
 const article=document.createElement("article");article.className="review-card";
 const header=document.createElement("div");header.className="review-card-head";
 const person=document.createElement("div");const name=document.createElement("h3");name.textContent=escapeText(review.authorName||review.name)||"REVLINE customer";person.appendChild(name);
 const source=document.createElement("span");source.className="review-source";source.textContent=isGoogle?"Google review":"REVLINE review";person.appendChild(source);
 const rating=document.createElement("span");rating.className="review-stars";const stars=ratingNumber(review.rating);rating.textContent=stars?"★".repeat(stars)+"☆".repeat(5-stars):"";rating.setAttribute("aria-label",stars?stars+" out of 5 stars":"Rating not provided");
 header.append(person,rating);article.appendChild(header);
 if(isGoogle&&/^https:\/\/(?:lh\d+\.)?googleusercontent\.com\//.test(String(review.profilePhotoUrl||""))){const avatar=document.createElement("img");avatar.src=review.profilePhotoUrl;avatar.alt="Google profile photo for "+(escapeText(review.authorName)||"reviewer");avatar.loading="lazy";avatar.decoding="async";avatar.referrerPolicy="no-referrer";avatar.className="review-photo";header.insertBefore(avatar,person);}
 if(review.vehicle){const vehicle=document.createElement("p");vehicle.className="review-vehicle";vehicle.textContent=escapeText(review.vehicle);article.appendChild(vehicle);}
 const text=document.createElement("p");text.textContent=escapeText(review.text||review.review);article.appendChild(text);
 if(review.photoUrl){const photo=document.createElement("img");photo.src=review.photoUrl;photo.alt="Customer-submitted REVLINE review photo";photo.loading="lazy";photo.decoding="async";photo.className="review-photo";article.appendChild(photo);}
 const rawDate=review.date||review.createdAt;const formatted=dateText(rawDate);if(formatted){const time=document.createElement("time");time.dateTime=new Date(rawDate).toISOString();time.textContent=formatted;article.appendChild(time);}
 if(isGoogle){const link=document.createElement("a");link.className="text-link";link.href="https://maps.app.goo.gl/XwvGo63LNbxMbi7NA?g_st=ic";link.target="_blank";link.rel="noopener";link.textContent="View REVLINE on Google →";article.appendChild(link);}
 return article;
}
async function loadFeed(url,list,status,isGoogle){
 try{
  const response=await fetch(url,{headers:{Accept:"application/json"},cache:"no-store"});
  const data=await response.json();
  if(!response.ok)throw new Error("feed_unavailable");
  if(data.configured===false){status.textContent=isGoogle?"Google review import is waiting for the authorized Business Profile connection. You can still open REVLINE’s Google profile.":"Website reviews are temporarily unavailable while REVLINE connects private moderation storage.";return;}
  const reviews=Array.isArray(data.reviews)?data.reviews:[];
  list.replaceChildren();
  reviews.forEach(review=>list.appendChild(makeCard(review,isGoogle)));
  status.textContent=reviews.length?(isGoogle?"Current reviews from REVLINE’s Google Business Profile.":"Approved REVLINE website reviews."):(isGoogle?"No Google reviews were returned by the connected profile.":"No website reviews have been approved for publication yet.");
 }catch(error){status.textContent=isGoogle?"Current Google reviews could not be loaded. Open the official profile to view them.":"Approved REVLINE reviews could not be loaded right now.";}
}
loadFeed("/api/google-reviews",googleList,googleStatus,true);
loadFeed("/api/reviews",revlineList,revlineStatus,false);
if(fileInput)fileInput.addEventListener("change",()=>{const file=fileInput.files&&fileInput.files[0];fileInput.setCustomValidity(file&&file.size>1024*1024?"Choose one photo smaller than 1 MB.":"");});
function readPhoto(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result||""));reader.onerror=()=>reject(new Error("photo_read_failed"));reader.readAsDataURL(file);});}
form?.addEventListener("submit",async event=>{
 event.preventDefault();
 if(!form.reportValidity())return;
 const submit=form.querySelector('button[type="submit"]');if(submit){submit.disabled=true;submit.textContent="Submitting…";}
 if(formStatus)formStatus.textContent="Sending your review privately for moderation…";
 try{
  const data={name:document.getElementById("reviewName").value.trim(),rating:Number(document.getElementById("reviewRating").value),review:document.getElementById("reviewText").value.trim(),vehicle:document.getElementById("reviewVehicle").value.trim(),website:document.getElementById("website").value.trim()};
  const file=fileInput?.files?.[0];if(file)data.photoData=await readPhoto(file);
  const response=await fetch("/api/reviews",{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(data)});
  const result=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(result.error||"submit_failed");
  form.reset();if(formStatus)formStatus.textContent="Thank you. REVLINE received your review as Pending; it will appear only if approved.";
  if(window.revlineTrack)window.revlineTrack("testimonial_submitted",{form:"supabase_website_review"});
 }catch(error){if(formStatus)formStatus.textContent=error.message==="reviews_not_configured"?"Website reviews are not accepting submissions yet. Please use the separate Google review link or contact REVLINE directly.":"We couldn’t submit this review. Please try again later or contact REVLINE.";}
 finally{if(submit){submit.disabled=false;submit.textContent="Submit for review";}}
});
})();