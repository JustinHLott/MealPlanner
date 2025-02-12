export function getFormattedDate(date) {
  console.log("Made it to getFormattedDate");
  if (date){
    console.log(date);
    return date.toISOString().slice(0, 10);
  }else{
    return new Date().toISOString().slice(0, 10);
  }
  
}

export function getDateMinusDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - days);
}
