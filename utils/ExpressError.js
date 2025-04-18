class ExpressError extends Error{
    constructor(Statuscode,message){
        super();
        this.Statuscode=Statuscode;
        this.message=message;
    }
}
module.exports=ExpressError;