const PROFILE_URL="https://maps.app.goo.gl/XwvGo63LNbxMbi7NA?g_st=ic";
function send(res,status,payload,cache="private, no-store"){res.setHeader("Cache-Control",cache);res.setHeader("X-Content-Type-Options","nosniff");return res.status(status).json(payload);}
function normalizeId(value,prefix){const id=String(value||"").trim().replace(new RegExp("^"+prefix+"/"),"");return /^\d+$/.test(id)?id:"";}
module.exports=async function handler(req,res){
 if(req.method!=="GET"){res.setHeader("Allow","GET");return send(res,405,{error:"method_not_allowed"});}
 const clientId=process.env.GOOGLE_CLIENT_ID,clientSecret=process.env.GOOGLE_CLIENT_SECRET,refreshToken=process.env.GOOGLE_REFRESH_TOKEN;
 const accountId=normalizeId(process.env.GBP_ACCOUNT_ID,"accounts"),locationId=normalizeId(process.env.GBP_LOCATION_ID,"locations");
 if(!clientId||!clientSecret||!refreshToken||!accountId||!locationId)return send(res,200,{configured:false,reviews:[],profileUrl:PROFILE_URL});
 try{
  const tokenResponse=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({grant_type:"refresh_token",client_id:clientId,client_secret:clientSecret,refresh_token:refreshToken}),signal:AbortSignal.timeout(12000)});
  const token=await tokenResponse.json();
  if(!tokenResponse.ok||!token.access_token)return send(res,502,{configured:true,error:"google_auth_unavailable",reviews:[],profileUrl:PROFILE_URL});
  const endpoint="https://mybusiness.googleapis.com/v4/accounts/"+encodeURIComponent(accountId)+"/locations/"+encodeURIComponent(locationId)+"/reviews?pageSize=8&orderBy=updateTime%20desc";
  const reviewResponse=await fetch(endpoint,{headers:{Authorization:"Bearer "+token.access_token,Accept:"application/json"},signal:AbortSignal.timeout(12000)});
  const result=await reviewResponse.json();
  if(!reviewResponse.ok)return send(res,502,{configured:true,error:"google_reviews_unavailable",reviews:[],profileUrl:PROFILE_URL});
  const reviews=(Array.isArray(result.reviews)?result.reviews:[]).map(review=>({id:String(review.reviewId||""),authorName:String(review.reviewer?.displayName||review.authorName||"Google reviewer"),profilePhotoUrl:/^https:\/\/(?:lh\d+\.)?googleusercontent\.com\//.test(String(review.reviewer?.profilePhotoUrl||""))?String(review.reviewer.profilePhotoUrl):"",rating:review.starRating||"",text:String(review.comment||""),date:review.createTime||review.updateTime||""})).filter(review=>review.text);
  return send(res,200,{configured:true,reviews,profileUrl:PROFILE_URL},"public, s-maxage=600, stale-while-revalidate=3600");
 }catch(error){return send(res,502,{configured:true,error:"google_reviews_unavailable",reviews:[],profileUrl:PROFILE_URL});}
};