

var getHost = function(){
    
    $.ajax({
        method:'GET',
        url:'http://127.0.0.1:3010/get/query/?table=hostnameConfig'
    }).then(function(response){
        console.log(response)
        
        response.forEach(function(row){
            //row.hostname
            //host.push(row.hostname)
            setPlant(row.hostname)
            

        })



        
    })
    
    
}




var setPlant = function (hostname) {



    console.log('host:' +hostname)

    $.ajax({
        method: 'GET',
        url: 'http://' + hostname + ':3000/get/query?table=service_KPI'

    }).then(function (response) {
        var $country = $('#service')
        
        const arr = response
        arr.forEach(function (row) {
            console.log(row)
            var $countryItem = `<tr>><td>${row.plant}</td><td>${row['DP']}</td><td>${row.Condition}</td><td>${row.Orde}</td><td>${row['SO']}</td><td>${row.CountryContro}</td><td>${row.WithoutHolday}</td><td>${row.Service}</td></tr>`
            //console.log($countryItem)
            $country.append($countryItem)
        });

        //document.getElementById('#country') = country
    })


}





getHost()