
var setCountry = function(){

    $.ajax({
        method : 'GET',
        url: 'http://127.0.0.1:3010/get/query?table=hostnameConfig'
    }).then(function(config){
        console.log('host:' + config)


        $.ajax({
            method: 'GET',
            url: 'http://dragonde-imac.local:3000/get/query?table=HAWB_Country'
    
        }).then(function (response) {
            var $country = $('#country')
            $country.append(`<option value="null"> -- </option>`)
            const arr = JSON.parse(response)
            arr.forEach(function (row) {
                //console.log(row.Country)
                var $countryItem = `<option value="${row.Country}">${row.Country}</option>`
                //console.log($countryItem)
                $country.append($countryItem)
            });
    
            //document.getElementById('#country') = country
        })
    })
    
}

var setCondition = function(){


    $.ajax({
        method: 'GET',
        url: 'http://dragonde-imac.local:3000/get/query?table=HAWB_ShptCondition'

    }).then(function (response) {
        var $country = $('#Condition')
        $country.append(`<option value="null"> -- </option>`)
        const arr = response
        arr.forEach(function (row) {
            //console.log(row.Country)
            var $countryItem = `<option value="${row.Country}">${row.Shpt_Condition}</option>`
            //console.log($countryItem)
            $country.append($countryItem)
        });

        //document.getElementById('#country') = country
    })
}

var setShipPoint = function(){


    $.ajax({
        method: 'GET',
        url: 'http://dragonde-imac.local:3000/get/query?table=HAWB_ShptPoint'

    }).then(function (response) {
        var $country = $('#Point')
        $country.append(`<option value="null"> -- </option>`)
        const arr = response
        arr.forEach(function (row) {
            //console.log(row.Country)
            var $countryItem = `<option value="${row.Shpt_Point}">${row.Shpt_Point}</option>`
            //console.log($countryItem)
            $country.append($countryItem)
        });

        //document.getElementById('#country') = country
    })
}

var setShipToCode = function(){


    $.ajax({
        method: 'GET',
        url: 'http://dragonde-imac.local:3000/get/query?table=HAWB_ShipTo'

    }).then(function (response) {
        var $country = $('#ShipTo')
        $country.append(`<option value="null"> -- </option>`)
        const arr = response
        arr.forEach(function (row) {
            //console.log(row.Country)
            var $countryItem = `<option value="${row.ShipTo}">${row.ShipTo}</option>`
            //console.log($countryItem)
            $country.append($countryItem)
        });

        //document.getElementById('#country') = country
    })
}

var setForward = function(){


    $.ajax({
        method: 'GET',
        url: 'http://dragonde-imac.local:3000/get/query?table=HAWB_Vendor'

    }).then(function (response) {
        var $country = $('#Forward')
        $country.append(`<option value="null"> -- </option>`)
        const arr = response
        arr.forEach(function (row) {
            //console.log(row.Country)
            var $countryItem = `<option value="${row.Vendor}">${row.Vendor}</option>`
            //console.log($countryItem)
            $country.append($countryItem)
        });

        //document.getElementById('#country') = country
    })
}


setCountry()
setCondition()
setShipPoint()
setShipToCode()
setForward()

