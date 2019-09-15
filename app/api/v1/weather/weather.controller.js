let controller = {}
const helper = require('./helper');
controller.getWeather = (req, response) => {

    if (!req.file) return response.status(400).send({
        msg: "No CSV File uploaded"
    });
    console.log('---------Weather API-------------',req.body.outputFile);

    getWeather(req.file.filename,req.body.outputFile).then(
        res => {
            console.log('get weather operation success', res)
            response.status(200).send({
                msg: res.msg
            });
        }, err => {
            console.error('get weather operation success', err.message, err.code);
            response.status(err.code).send(err.message);
        }
    )

}

getWeather = async (fileName,outputFile) => {

    let result;
    try {
        result = await helper.convertCSVToJson(fileName);
    } catch (e) {
        console.log('error', e);
        let err = new Error(e);
        err.message = e.msg;
        err.code = e.code
        throw err;
    }

    // console.log('result after converting csv to json', result);
    let finalArray = [];
    let finalResult;
    await asyncForEach(result, async (data) => {
        try {
            result = await helper.getcurrentForecaset(data);
        } catch (e) {
            console.log('error', e);
            let err = new Error(e);
            err.message = e.msg;
            err.code = e.code
            throw err;
        }
        // console.log('getcurrentForecaset finish=======================================', result)
        // let arr=[];
        if (result.weatherList.length == 0) {
            finalArray.push({
                "Zip Code":result.zipCode,
                "Country Code":result.countryCode,
                "Weather Date":(new Date()).toString(),
                "min":"N/A",
                "max":"N/A"
            })
        }
        await asyncForEach(result.weatherList, async (data) => {
            // console.log("each data", data);
            if (new Date(data.dt_txt).getHours() === 0) {
                try {
                    finalResult = await helper.loop(result, data);
                } catch (e) {
                    console.log('error', e);
                }

                // console.log('result of loop', result)
                finalArray.push(finalResult);
            }
        });
    })

    // console.log('===================>result after calling api<=====================', finalArray);

    try {
        result = await helper.convertJsonToCSV(finalArray,outputFile);
    } catch (e) {
        console.log('error', e);
        let err = new Error(e);
        err.message = e.msg;
        err.code = e.code
        throw err;
    }

    return {
        msg: result
    }
}

const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}


controller.getOutput=(req,res)=>{

    console.log('get file from server', req.params.fileName);
    // res.download(__dirname + '/upload/output/'+req.params.fileName)
    
res.download(__dirname + '/upload/output/'+req.params.fileName, req.params.fileName, function (err) {
    if (err) {
      res.status(404).send({msg:'File not found'})
    } else {
      console.log('File downloaded')
    }
  })
}
module.exports = controller;