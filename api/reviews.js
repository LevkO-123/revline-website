const crypto=require("node:crypto");
const BUCKET=process.env.SUPABASE_REVIEWS_BUCKET||"revline-review-photos";
const TABLE=process.env.SUPABASE_REVIEWS_TABLE||"revline_reviews";
function send(res,status,payload){res.setHeader("Cache-Control","private, no-store");res.setHeader("X-Content-Type-Options","nosniff");return res.status(status).json(payload);}
function config(){const base=String(process.env.SUPABASE_URL||"").replace(/\/$/,"");const key=process.env.SUPABASE_SERVICE_ROLE_KEY||"";const table=/^[a-z][a-z0-9_]{0,62}$/.test(TABLE);return base&&key&&table?{base,key}:null;}
function headers(key,extra={}){return Object.assign({apikey:key,Authorization:"Bearer "+key},extra);}
function sameOrigin(req){const origin=req.headers.origin;if(!origin)return true;const host=req.headers["x-forwarded-host"]||req.headers.host;try{return new URL(origin).host===String(host||"").toLowerCase();}catch{return false;}}
function photoInfo(dataUrl){
 if(typeof dataUrl!=="string"||dataUrl.length>1450000)return null;
 const m=dataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/);if(!m)return null;
 const buffer=Buffer.from(m[2],"base64");if(!buffer.length||buffer.length>1024*1024)return null;
 const signatures={"image/jpeg":buffer.length>3&&buffer[0]===0xff&&buffer[1]===0xd8&&buffer[2]===0xff,"image/png":buffer.length>8&&buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),"image/webp":buffer.length>12&&buffer.toString("ascii",0,4)==="RIFF"&&buffer.toString("ascii",8,12)==="WEBP"};
 if(!signatures[m[1]])return null;
 return {buffer,type:m[1],extension:m[1]==="image/jpeg"?"jpg":m[1]==="image/png"?"png":"webp"};
}
async function storageFetch(cfg,path,init){return fetch(cfg.base+"/storage/v1/object/"+path,Object.assign({headers:headers(cfg.key)},init||{}));}
module.exports=async function handler(req,res){
 const cfg=config();
 if(req.method==="GET"){
  if(!cfg)return send(res,200,{configured:false,reviews:[]});
  try{
   const response=await fetch(cfg.base+"/rest/v1/"+TABLE+"?select=id,reviewer_name,rating,review_text,vehicle_label,photo_path,created_at&status=eq.approved&order=created_at.desc&limit=12",{headers:headers(cfg.key,{Accept:"application/json"}),signal:AbortSignal.timeout(12000)});
   if(!response.ok)return send(res,502,{error:"reviews_unavailable",reviews:[]});
   const rows=await response.json();
   return send(res,200,{configured:true,reviews:(Array.isArray(rows)?rows:[]).map(row=>({id:row.id,name:row.reviewer_name,rating:row.rating,review:row.review_text,vehicle:row.vehicle_label||"",createdAt:row.created_at,photoUrl:row.photo_path?"/api/review-photo?id="+encodeURIComponent(row.id):""}))});
  }catch(error){return send(res,502,{error:"reviews_unavailable",reviews:[]});}
 }
 if(req.method!=="POST"){res.setHeader("Allow","GET, POST");return send(res,405,{error:"method_not_allowed"});}
 if(!cfg)return send(res,503,{error:"reviews_not_configured"});
 if(!sameOrigin(req))return send(res,403,{error:"origin_not_allowed"});
 const body=req.body&&typeof req.body==="object"?req.body:{};
 if(typeof body.website==="string"&&body.website.trim())return send(res,201,{ok:true,status:"pending"});
 const name=String(body.name||"").trim().replace(/\s+/g," ").slice(0,80);
 const review=String(body.review||"").trim();
 const vehicle=String(body.vehicle||"").trim().slice(0,100);
 const rating=Number(body.rating);
 if(name.length<2||name.length>80||!Number.isInteger(rating)||rating<1||rating>5||review.length<12||review.length>2000)return send(res,400,{error:"invalid_review"});
 if(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(name+review+vehicle))return send(res,400,{error:"invalid_text"});
 let photoPath=null;
 const photo=body.photoData?photoInfo(body.photoData):null;
 if(body.photoData&&!photo)return send(res,400,{error:"invalid_photo"});
 if(photo){
  photoPath="pending/"+crypto.randomUUID()+"."+photo.extension;
  try{
   const uploaded=await storageFetch(cfg,encodeURIComponent(BUCKET)+"/"+photoPath.split("/").map(encodeURIComponent).join("/"),{method:"POST",headers:headers(cfg.key,{"Content-Type":photo.type,"x-upsert":"false"}),body:photo.buffer,signal:AbortSignal.timeout(15000)});
   if(!uploaded.ok)return send(res,502,{error:"photo_upload_failed"});
  }catch(error){return send(res,502,{error:"photo_upload_failed"});}
 }
 try{
  const response=await fetch(cfg.base+"/rest/v1/"+TABLE,{method:"POST",headers:headers(cfg.key,{"Content-Type":"application/json","Prefer":"return=minimal"}),body:JSON.stringify({reviewer_name:name,rating,review_text:review,vehicle_label:vehicle||null,photo_path:photoPath,status:"pending"}),signal:AbortSignal.timeout(12000)});
  if(!response.ok){
   if(photoPath)await storageFetch(cfg,encodeURIComponent(BUCKET)+"/"+photoPath.split("/").map(encodeURIComponent).join("/"),{method:"DELETE"}).catch(()=>{});
   return send(res,502,{error:"review_save_failed"});
  }
  return send(res,201,{ok:true,status:"pending"});
 }catch(error){return send(res,502,{error:"review_save_failed"});}
};