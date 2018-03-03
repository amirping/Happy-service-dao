module.exports = {
    getApi : function(req, res){
       // return 200 when api services is UP
       res.status(200).json({
         msg: 'OK'
       })
    }
}
