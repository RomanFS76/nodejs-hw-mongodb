export const handleSaveError = (error, data, next) => {
  console.log(error)
  const {code, name} = error;
      error.status = (name === 'MongoServerError' && code === 11000) ? 409 : 400;
    next();
  }


  export const setUpdateSettings =  function(next){
    this.options.runValidators = true;
    next();
  }
