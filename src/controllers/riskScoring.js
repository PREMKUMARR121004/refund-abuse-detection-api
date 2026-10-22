


export const calculateRisk=(amount,recentRefundCount)=>{
let riskScore=0;
if(amount>5000){
    riskScore=riskScore+30
}
 if(recentRefundCount>=3){
    riskScore=riskScore+40
 }
  let riskLevel;
 if(riskScore>=60){
    riskLevel="high"
 }
 else if(riskScore>=30){
    riskLevel="meduim"
 }
 else{
    riskLevel="low"
 }

 return{
    riskScore:points,
    riskLevel:riskLevel
 }
 
}
