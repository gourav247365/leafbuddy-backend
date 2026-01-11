export function generateOtp(length) {
  const str= "0123456789"
  let otp=""

  for(let i=0 ; i<length; i++) {
    otp+=str[Math.floor(Math.random()*10)]
  }
  return otp
}