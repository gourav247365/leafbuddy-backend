export const  asyncHandler= (fn)=> async (req,res,next)=> {
  try {
    await fn(req,res,next)
  } catch (error) {
    console.error(error)
    res.status(typeof error.code === "number"? error.code : 500 || 500).json({
      success: false,
      message: error.message
    })
  }
}
 
