const TABLE=process.env.SUPABASE_REVIEWS_TABLE||"revline_reviews";
function fail(res,status){res.setHeader("Cache-Control","private, no-store");res.setHeader("X-Content-Type-Options","nosniff");return res.status(status).end();}
module.exports=async function handler(req,res){
 if(req.method!=="GET"){res.setHeader("Allow","GET");return fail(res,405);}
 const id=typeof req.query?.id==="string"?req.query.id:"";
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id))return fail(res,404);
 const base=String(process.env.SUPABASE_URL||"").replace(/\/$/,""),key=process.env.SUPABASE_SERVICE_ROLE_KEY||"",bucket=process.env.SUPABASE_REVIEWS_BUCKET||"revline-review-photos";
 if(!base||!key)return fail(res,404);
 const h={apikey:key,Authorization:"Bearer "+key};
 try{
  const rowResponse=await fetch(base+"/rest/v1/"+TABLE+"?select=status,photo_path&id=eq."+encodeURIComponent(id)+"&limit=1",{headers:Object.assign({},h,{Accept:"application/json"}),signal:AbortSignal.timeout(10000)});
  if(!rowResponse.ok)return fail(res,404);
  const rows=await rowResponse.json();const row=rows[0];
  if(!row||row.status!=="approved"||!row.photo_path)return fail(res,404);
  const safePath=String(row.photo_path).split("/").map(encodeURIComponent).join("/");
  const imageResponse=await fetch(base+"/storage/v1/object/"+encodeURIComponent(bucket)+"/"+safePath,{headers:h,signal:AbortSignal.timeout(12000)});
  if(!imageResponse.ok)return fail(res,404);
  const type=imageResponse.headers.get("content-type")||"application/octet-stream";
  if(!["image/jpeg","image/png","image/webp"].includes(type))return fail(res,415);
  const bytes=Buffer.from(await imageResponse.arrayBuffer());
  if(!bytes.length||bytes.length>1024*1024)return fail(res,413);
  res.setHeader("Content-Type",type);res.setHeader("Content-Length",String(bytes.length));res.setHeader("Cache-Control","private, no-store");res.setHeader("X-Content-Type-Options","nosniff");res.setHeader("Content-Security-Policy","default-src 'none'; sandbox");
  return res.status(200).send(bytes);
 }catch(error){return fail(res,502);}
};