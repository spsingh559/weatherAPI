const csvjson = require('csvjson');
const Axios=require('axios');
const apiKey=require('./apiKey');
const readFile = require('fs').readFile;
const writeFile = require('fs').writeFile;
let helper = {};

helper.convertCSVToJson = async(fileName) => {
    console.log('fileName', fileName)
    return new Promise((resolve, reject) => {
        readFile(__dirname + '/upload/' + fileName, 'utf-8', (err, fileContent) => {
            if (err) return reject({
                msg: 'operation failed while parsing csv to json',
                code: 404
            })
            const jsonObj = csvjson.toObject(fileContent);
            resolve(jsonObj);
        });
    })
}

helper.getcurrentForecaset=async(data)=>{
    let zipCode=data['Zip Code'];
    let countryCode=data[' Country Code'];
let url="http://api.openweathermap.org/data/2.5/forecast?zip="+zipCode+","+countryCode+"&APPID="+apiKey.key;

return new Promise((resolve,reject)=>{
console.log(url);
    Axios({
        method: 'get',
        url: url
    })
    .then((response) => {
        console.log("API response of weather ============>zipCode<===============",zipCode);
        console.log("API response of weather", response.data.cod);
        let obj={
            zipCode:zipCode,
            countryCode:countryCode,
            weatherList:response.data.list
        }
        resolve(obj);

    }).catch((error) => {
        if(error.response.data.cod!=200) {
            let obj={
                zipCode:zipCode,
                countryCode:countryCode,
                weatherList:[]
            }
            resolve(obj);
        }        
    });
})
}


helper.loop=async(result,eachdata)=>{
    return new Promise((resolve,reject)=>{
            let obj={
                "Zip Code":result.zipCode,
                "Country Code":result.countryCode,
                "Weather Date":eachdata.dt_txt,
                "min":eachdata.main.temp_min,
               "max":eachdata.main.temp_max               
            }
            // console.log(obj);  
        resolve(obj);
    })
    
}

helper.convertJsonToCSV=(jsonData,fileName)=>{
    return new Promise((resolve,reject)=>{
        const csvData = csvjson.toCSV(jsonData, {
            headers: 'key'
        });
        writeFile(__dirname + '/upload/output/'+fileName, csvData, (err) => {
            if(err) {
                console.log(err); // Do something to handle the error or just throw it
                throw new Error(err);
            }
            console.log('Success!');
        });
        resolve("success");
    })
 
}
module.exports = helper;