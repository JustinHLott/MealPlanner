export function getFormattedDate(date) {
  //console.log("Made it to getFormattedDate");

  let date2 = new Date(getDateMinusDays(date,0));

  if (isValidDate(date2)){
    //console.log("valid date");
    //console.log(date2);
    return date2.toISOString().slice(0, 10);
  }else{
    // console.log("no date");
    // console.log(date2);
    return new Date().toISOString().slice(0, 10);
  }
  
}
export function isValidDate(date){
    return date instanceof Date && !isNaN(date);
  };

export function getDateMinusDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - days);
}
