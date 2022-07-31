const config = ()=>{

    const env = process.env.NODE_ENV || "dev";

    console.log(process.env.NODE_ENV )
    if(env == "prod"){
        return require("./prod.json")
    }else{
        return require("./dev.json")
    }
}

module.exports = config();