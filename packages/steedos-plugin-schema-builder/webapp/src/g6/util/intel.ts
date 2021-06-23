export default {
   get : (text1) => ({
       d : (text2) => {
          return text2 || text1
       }
   })
}