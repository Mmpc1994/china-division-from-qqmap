const QQ_MAP_KEY = '111';
const URL = `https://apis.map.qq.com/ws/district/v1/list?key=${QQ_MAP_KEY}`;

let { Province, City, Area } = require('./sqlite');
const axios = require('axios');


exports.fetch = async () => {
    console.log('......正在调用接口')
    axios.get(URL).then(async resp => {
        let [ provinces, cities, areas ] = resp.data.result;
        console.log(cities)
        console.log('.........正在写入数据库')
        await fetchProvinceData(provinces);
        await fetchCityData(provinces, cities);
        await fetchAreaData(provinces, cities, areas)

        console.log('............写入数据库完毕')
    })
   
}


async function fetchProvinceData(provinces) {
    let province_rows = []
    provinces.forEach(province => {
        province_rows.push({
            code: province.id,
            name: province.name,
            fullName: province.fullname,
            lat: province.location.lat,
            lng: province.location.lng
        })
    })
    await Province.bulkCreate(province_rows, { ignoreDuplicates: true })
}

async function fetchCityData(province, cities) {
    let city_rows = []
    province.forEach(province => {
        let city_begin = province.cidx[0],
            city_end   = province.cidx[1] + 1;
        cities.slice(city_begin, city_end).forEach(city => {
            city_rows.push({
                code: city.id,
                name: city.name,
                fullName: city.fullname,
                lat: city.location.lat,
                lng: city.location.lng,
                provinceCode: province.id
            }) 
        })
        
    })
    await City.bulkCreate(city_rows, { ignoreDuplicates: true })

}

async function fetchAreaData(province, cities, areas) {
    let area_rows = []
    province.forEach(province => {
        let city_begin = province.cidx[0],
            city_end   = province.cidx[1] + 1;
        cities.slice(city_begin, city_end).forEach(city => {
            if (city.cidx) {
                let area_begin = city.cidx[0],
                    area_end   = city.cidx[1] + 1;
                areas.slice(area_begin, area_end).forEach(area => {
                    area_rows.push({
                        code: area.id,
                        name: area.name,
                        fullName: area.fullname,
                        lat: area.location.lat,
                        lng: area.location.lng,
                        provinceCode: province.id,
                        cityCode: city.id
                    })
                })
            }
        })
    })
    await Area.bulkCreate(area_rows, { ignoreDuplicates: true })
}

