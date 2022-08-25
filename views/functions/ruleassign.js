

var getHost = function(){
    //setCountry()

    $.ajax({
        method:'GET',
        url:'http://127.0.0.1:3010/get/query/?table=hostnameConfig'
    }).then(function(response){
        console.log(response)
        
        response.forEach(function(row){
            //row.hostname
            //host.push(row.hostname)
            setCountry(row.address)
            setCondition(row.address)
            setShipPoint(row.address)
            setShipToCode(row.address)
            setForward(row.address)

        })



        
    })
    
    
    
}




var setCountry = function (hostname) {

    

    console.log('host:' +hostname)

    $.ajax({
        method: 'GET',
        url: 'http://' + hostname +':3000/get/query?table=HAWB_Country',
        //type:'GET'

    }).then(function (response) {
        //console.log('Country:'+ response)
        var $country = $('#country')
        $country.append(`<option value="null"> -- </option>`)
        //const arr = JSON.parse(response)
        
        response.forEach(function (row) {
            //console.log(row.Country)
            var $countryItem = `<option value="${row.Country}">${row.Country}</option>`
            //console.log($countryItem)
            $country.append($countryItem)
        });

        //document.getElementById('#country') = country
    })


}

var setCondition = function (hostname) {


    $.ajax({
        method: 'GET',
        url: 'http://' + hostname +':3000/get/query?table=HAWB_ShptCondition'

    }).then(function (response) {
        var $country = $('#condition')
        $country.append(`<option value="null"> -- </option>`)
        const arr = response
        arr.forEach(function (row) {
            //console.log(row.Country)
            var $countryItem = `<option value="${row.Shpt_Condition}">${row.Shpt_Condition}</option>`
            console.log($countryItem)
            $country.append($countryItem)
        });

        //document.getElementById('#country') = country
    })
}

var setShipPoint = function (hostname) {


    $.ajax({
        method: 'GET',
        url: 'http://' + hostname +':3000/get/query?table=HAWB_ShptPoint'

    }).then(function (response) {
        var $country = $('#Point')
        $country.append(`<option value="null"> -- </option>`)
        const arr = response
        arr.forEach(function (row) {
            //console.log(row.Country)
            var $countryItem = `<option value="${row.Shpt_Point}">${row.Shpt_Point}</option>`
            console.log($countryItem)
            $country.append($countryItem)
        });

        //document.getElementById('#country') = country
    })
}

var setShipToCode = function (hostname) {


    $.ajax({
        method: 'GET',
        url: 'http://' + hostname +':3000/get/query?table=HAWB_ShipTo'

    }).then(function (response) {
        var $country = $('#ShipTo')
        $country.append(`<option value="null"> -- </option>`)
        const arr = response
        arr.forEach(function (row) {
            //console.log(row.Country)
            var $countryItem = `<option value="${row.ShipTo}">${row.ShipTo}</option>`
            console.log($countryItem)
            $country.append($countryItem)
        });

        //document.getElementById('#country') = country
    })
}

var setForward = function (hostname) {


    $.ajax({
        method: 'GET',
        url: 'http://' + hostname +':3000/get/query?table=HAWB_Vendor'

    }).then(function (response) {
        var $country = $('#Forward')
        $country.append(`<option value="null"> -- </option>`)
        const arr = response
        arr.forEach(function (row) {
            //console.log(row.Country)
            var $countryItem = `<option value="${row.Vendor}">${row.Vendor}</option>`
            console.log($countryItem)
            $country.append($countryItem)
        });

        //document.getElementById('#country') = country
    })
}





var submitBtn = function() {



    const country = document.getElementById('country').value
    const condition = document.getElementById('condition').value
    const Point = document.getElementById('Point').value
    const ShipTo = document.getElementById('ShipTo').value
    const forward = document.getElementById('Forward').value

    const mon_check = document.getElementById('mon').checked
    const tue_check = document.getElementById('tue').checked
    const wed_check = document.getElementById('wed').checked
    const thu_check = document.getElementById('thu').checked
    const fri_check = document.getElementById('fri').checked
    const sat_check = document.getElementById('sat').checked
    const sun_check = document.getElementById('sun').checked

    var mon = 0
    var tue = 0
    var wed = 0
    var thu = 0
    var fri = 0
    var sat = 0
    var sun = 0

    if ( country == 'null' || condition == 'null' || forward == 'null') {
        alert('Contry / Condition / Forward no entry')

    }else{
        if( mon_check  == true ) {
            mon = 1
        }
        if( tue_check  == true ) {
            tue = 1
        }
        if( wed_check  == true ) {
            wed = 1
        }
        if( thu_check  == true ) {
            thu = 1
        }
        if( fri_check  == true ) {
            fri = 1
        }
        if( sat_check  == true ) {
            sat = 1
        }
        if( sun_check  == true ) {
            sun = 1
        }
        
        $.ajax({
            method : 'GET',
            url:'http://127.0.0.1:3010/get/query/?table=hostnameConfig'
        }).then(function(response){
            response.forEach(function(row){
                'insert into HAWB_Rule'
                $.ajax({
                    method:'POST',
                    url:`/post/set/rule?country=${country}&condition=${condition}&shpt=${Point}&shipto=${ShipTo}&forward=${forward}&mon=${mon}&tue=${tue}&wed=${wed}&thu=${thu}&fri=${fri}&sat=${sat}&sun=${sun}`
                }).then(function(response){
                    response.forEach(function(row){
                        console.log(row)

                    })
                    
                })
                
                    
                
            })
        });
        



        console.log('Country is '+ mon)
    }
}

getHost()