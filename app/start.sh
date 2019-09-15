echo "hello" $1
echo $2
curl -F "outputFile"=$2 -F 'file=@'$1 http://localhost:3000/api/v1/weather
echo "============Ouput CSV is created======================"
echo "==================Downloading file from server==========="
curl -X GET http://localhost:3000/api/v1/weather/getFile/$2
echo "=======Download File from Browser http://localhost:3000/api/v1/weather/getFile/$2"
echo "=======$2 File availble in /api/v1/weather/upload/ouput Folder"
