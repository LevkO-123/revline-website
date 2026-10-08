function send(res,status,payload){res.setHeader("Cache-Control","no-store");res.setHeader("X-Content-Type-Options","nosniff");return res.status(status).json(payload);}
module.exports=async function handler(req,res){
 if(req.method!=="GET"){res.setHeader("Allow","GET");return send(res,405,{error:"method_not_allowed"});}
 const publishableKey=String(process.env.STRIPE_PUBLISHABLE_KEY||"");
 const validPublishable=/^pk_(test|live)_[A-Za-z0-9]+$/.test(publishableKey);
 const secret=String(process.env.STRIPE_SECRET_KEY||"");
 const priceIds=(process.env.STRIPE_PRICE_IDS||"").split(",").map(value=>value.trim()).filter(value=>/^price_[A-Za-z0-9]+$/.test(value));
 return send(res,200,{stripeConfigured:Boolean(secret&&priceIds.length),publishableKey:validPublishable?publishableKey:null,hostedCheckout:true});
};