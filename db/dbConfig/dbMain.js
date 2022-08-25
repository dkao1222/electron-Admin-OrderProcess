
const { app } = require('electron')
const { devNull } = require('os')

const path = require('path')
const { fileURLToPath } = require('url')


const sqlite3 = require('sqlite3').verbose()



let db = new sqlite3.Database(path.resolve(__dirname, '../../db/main.db'), sqlite3.OPEN_READWRITE)

const getPosts = function (query) {
    return new Promise(function (resolve, reject) {

        console.log(query)
        db.serialize(function () {
            db.all(query, function (err, rows) {

                if (!err) {
                    resolve(rows)
                } else {
                    reject(err)
                }
            })
        })
    })

    //db.close()
}

const setUpdate = function (query) {
    return new Promise(function (resolve, reject) {

        console.log(query)
        db.serialize(function () {
            db.run(query, function (err, rows) {

                if (!err) {
                    resolve(rows)
                } else {
                    reject(err)
                }
            })
        })
    })
    //db.close()
}

const setInsert = function (query) {
    return new Promise(function (resolve, reject) {

        console.log(query)
        db.serialize(function () {
            db.exec(query, function (err, rows) {

                if (!err) {
                    resolve('close')
                } else {
                    reject(err)
                }
            })
        })
    })
    //db.close()
}
const setInsert043FromTemp = function () {
    //return new Promise(function (resolve, reject) {

    /*db.serialize(function(){
        
    })
    db.serialize(function(){
        var updateHistory = `

        update TBL_ZAVGR043_Prod
        set OvrGMStus = t.OverallGMStatus
        , OvrPickingStus = t.OverallPickingStatus
        , OvrWMStus = t.OverallWMStatus
        , EntryDate = t.EntryDate
        , PGITime = t.PGITime
        , ProformaD = t.ProformaD
        from (
            select * from ZAVGR043_Temp
        ) t
        where TBL_ZAVGR043_Prod.ShipmentNo = t.ShipmentNo
        and TBL_ZAVGR043_Prod.ShipmentNo is not null;

        `
        db.exec(updateHistory, function(err, row){
            if(!err){
                console.log('update TBL_ZAVGR043_Prod row: ' + row)
            } else {
                console.log('update TBL_ZAVGR043_Prod err: ' + err)
            }   
        })
    })


    db.serialize(function(){
        var insertHistory = `

        INSERT INTO TBL_ZAVGR043_Prod (
            Shpt
            ,DP
            ,Delivery
            ,Country
            ,"Items"
            ,Ordes
            ,StorageLocation
            ,"ShipTo"
            ,Consignee
            ,CreateOn
            ,"CreateTime"
            ,TransferOrder
            ,TO_CreateDate
            ,TO_CreateTime
            ,ShipmentNo
            ,ShipmentCreateDate
            ,ShipmentCreateTime
            ,SHPCondition
            ,ProformaD
            ,Route
            ,SOrg
            ,Billoflading
            ,OvrPickingStus
            ,OvrWMStus
            ,OvrGMStus
            ,DivT
            ,CustomerPONo
            ,WaveGrpNo
            ,ShippingInstructions
            )
        SELECT Shpt
            ,DP
            ,Delivery
            ,Country
            ,"#Items"
            ,Orde
            ,StorageLocation
            ,"Ship-To"
            ,Consignee
            ,Createdon
            ,"Time"
            ,TransferOrder
            ,TOCreateDate
            ,TOCreateTime
            ,ShipmentNo
            ,ShipmentCreateDate
            ,ShipmentCreateTime
            ,ShippingCondition
            ,ProformaD
            ,Route
            ,SOrg
            ,Billoflading
            ,OverallPickingStatus
            ,OverallWMStatus
            ,OverallGMStatus
            ,DlvT
            ,"CustomerPONo."
            ,"WaveGrpNo."
            ,ShippingInstructions
        FROM ZAVGR043_Temp
        WHERE  OverallPickingStatus = 'C'
            and OverallGMStatus = 'A'
            AND ShipmentNo <> ''
            AND ShipmentNo NOT IN (
                SELECT ShipmentNo
                FROM TBL_ZAVGR043_Prod
                );

        `

        

        db.exec(insertHistory, function(err, row){
            if(!err){
                console.log('inser TBL_ZAVGR043_Prod row: ' + row)
            } else {
                console.log('inser TBL_ZAVGR043_Prod err: ' + err)
            }   
        })

        db.exec(`update TBL_ZAVGR043_Prod
        set Team_Name = t."Name"
        from (
            select * from TBL_TeamName
        ) t
        where TBL_ZAVGR043_Prod.Shpt = t.Shpt
        and TBL_ZAVGR043_Prod.Team_Name is NULL;`, function(err, row) {
            if(err) {
                console.log('update TBL_ZAVGR043_Prod Team_Name err: ' + err)
            }
        })

        db.exec(`update TBL_ZAVGR043_Prod
        set Team_Name = case when Shpt like '5%' and DP = 1 and SHPCondition = 1 then 'Super Downs'
        when Shpt like '5%' and DP in (1, 3) and SHPCondition <> 1 then '54 Downs'
        when Shpt like '5%' and DP = 4 and Country = 'TW' and length(Ordes) > 0  then '54 TPM-SO'
        when Shpt like '5%' and DP = 4 and Country = 'TW' and length(Ordes) = 0  then '54 TPM'
        when Shpt like '5%' and DP = 4 and Country <> 'TW' and length(Ordes) > 0  then '54 Non-Downs SO'
        when Shpt like '5%' and DP = 4 and Country <> 'TW' and length(Ordes) = 0  then '54 Non-Downs'
        when Shpt like '8%' and DP in (1, 3) then '89 Downs' 
        when Shpt like '8%' and DP = 4 and Country = 'TW' and length(Ordes) > 0  then '89 TPM-SO'
        when Shpt like '8%' and DP = 4 and Country = 'TW' and length(Ordes) = 0  then '89 TPM'
        else null end
        where TBL_ZAVGR043_Prod.Team_Name is NULL;`, function(err, row) {
            if(err) {
                console.log('update TBL_ZAVGR043_Prod Team_Name err: ' + err)
            }
        })

        
    })

    db.serialize(function(){
        var insertHistoryDowns = `


        insert into HAWB_ShipmentData (Shpt, DP, SHPCondition, Delivery, Country, "Items", Ordes,  StorageLocation, ShipTo, ShipmentNo )
        select Shpt, DP,ShippingCondition, Delivery, Country, "#Items", Orde, StorageLocation, "Ship-To", ShipmentNo from ZAVGR043_Temp where dp in (1, 3) and OverallPickingStatus = 'C'
        and OverallGMStatus = 'A' and ShipmentNo <>'' and Shpt like '5%' and Country not in ('TW') and ShipmentNo not in (select ShipmentNo from Order_ShipmentData_Downs) ;

        `

        var insertHistoryRegular = `


        insert into HAWB_ShipmentData (Shpt, DP, SHPCondition, Delivery, Country, "Items", Ordes,  StorageLocation, ShipTo, ShipmentNo )
        select Shpt, DP,ShippingCondition, Delivery, Country, "#Items", Orde, StorageLocation, "Ship-To", ShipmentNo from ZAVGR043_Temp where dp in (4) and OverallPickingStatus = 'C'
        and OverallGMStatus = 'A' and ShipmentNo <>'' and Shpt like '5%' and Country not in ('TW') and ShipmentNo not in (select ShipmentNo from Order_ShipmentData_Regular) ;

        `

        db.exec(insertHistoryDowns, function(err, row){
            if(err){
                console.log('inser HAWB_ShipmentData Downs row: ' + err)
            } 
        })

        db.exec(insertHistoryRegular, function(err, row){
            if(err){
                console.log('inser HAWB_ShipmentData Regular row: ' + err)
            }  
        })
    })

    // insert child table
    db.serialize(function(){
        var insertHistoryDowns = `insert into Order_ShipmentData_Downs (Shpt, DP, SHPCondition, Country, Ordes,  StorageLocation, ShipTo, ShipmentNo )
        select Shpt, DP,ShippingCondition, Country, Orde, StorageLocation, "Ship-To", ShipmentNo from ZAVGR043_Temp 
        where dp in (1, 3) and OverallPickingStatus = 'C'
        and OverallGMStatus = 'A' and  ShipmentNo <>''  and Shpt like '5%' and ShipmentNo not in (select ShipmentNo from Order_ShipmentData_Downs) 
        group by Shpt, DP,ShippingCondition, Country, Orde, StorageLocation, "Ship-To", ShipmentNo ;
        `
        var insertHistoryRegular = `insert into Order_ShipmentData_Regular (Shpt, DP, SHPCondition, Country, Ordes,  StorageLocation, ShipTo, ShipmentNo )
        select Shpt, DP,ShippingCondition, Country, Orde, StorageLocation, "Ship-To", ShipmentNo from ZAVGR043_Temp 
        where dp in (4) and OverallPickingStatus = 'C'
        and OverallGMStatus = 'A' and  ShipmentNo <>''  and Shpt like '5%' and Country not in ('TW') and ShipmentNo not in (select ShipmentNo from Order_ShipmentData_Regular) 
        group by Shpt, DP,ShippingCondition, Country, Orde, StorageLocation, "Ship-To", ShipmentNo ;
        `
        var insertHistoryRegularTW = `insert into Order_ShipmentData_RegularTW (Shpt, DP, SHPCondition, Country, Ordes,  StorageLocation, ShipTo, ShipmentNo )
        select Shpt, DP,ShippingCondition, Country, Orde, StorageLocation, "Ship-To", ShipmentNo from ZAVGR043_Temp 
        where dp in (4) and OverallPickingStatus = 'C'
        and OverallGMStatus = 'A' and  ShipmentNo <>''  and Shpt like '5%' and Country in ('TW') and ShipmentNo not in (select ShipmentNo from Order_ShipmentData_RegularTW) 
        group by Shpt, DP,ShippingCondition, Country, Orde, StorageLocation, "Ship-To", ShipmentNo ;
        `

        var insertHistoryAMTdowns = `insert into Order_ShipmentData_AMT_Downs (Shpt, DP, SHPCondition, Country, Ordes,  StorageLocation, ShipTo, ShipmentNo )
        select Shpt, DP,ShippingCondition, Country, Orde, StorageLocation, "Ship-To", ShipmentNo from ZAVGR043_Temp 
        where dp in (1, 3) and OverallPickingStatus = 'C'
        and OverallGMStatus = 'A' and  ShipmentNo <>''  and Shpt not like '5%' and ShipmentNo not in (select ShipmentNo from Order_ShipmentData_AMT_Downs) 
        group by Shpt, DP,ShippingCondition, Country, Orde, StorageLocation, "Ship-To", ShipmentNo ;
        `
        var insertHistoryAMT = `insert into Order_ShipmentData_AMT (Shpt, DP, SHPCondition, Country, Ordes,  StorageLocation, ShipTo, ShipmentNo )
        select Shpt, DP,ShippingCondition, Country, Orde, StorageLocation, "Ship-To", ShipmentNo from ZAVGR043_Temp 
        where dp in (4) and OverallPickingStatus = 'C'
        and OverallGMStatus = 'A' and  ShipmentNo <>''  and Shpt not like '5%' and ShipmentNo not in (select ShipmentNo from Order_ShipmentData_AMT) 
        group by Shpt, DP,ShippingCondition, Country, Orde, StorageLocation, "Ship-To", ShipmentNo ;
        `

        db.exec(insertHistoryDowns, function(err, row){
            if(err){
                console.log('inser Order_ShipmentData_Downs row: ' + err)
            } 
        })
        db.exec(insertHistoryRegular, function(err, row){
            if(err){
                console.log('inser Order_ShipmentData_Regular row: ' + err)
            }  
        })
        db.exec(insertHistoryRegularTW, function(err, row){
            if(err){
                console.log('inser Order_ShipmentData_RegularTW row: ' + err)
            }   
        })
        db.exec(insertHistoryAMTdowns, function(err, row){
            if(err){
                console.log('inser Order_ShipmentData_AMT_Downs row: ' + err)
            }   
        })
        db.exec(insertHistoryAMT, function(err, row){
            if(err){
                console.log('inser Order_ShipmentData_AMT row: ' + err)
            }  
        })
        db.exec(`delete from Order_ShipmentData_AMT
        where ShipmentNo in (select ShipmentNo from TBL_ZAVGR043_Prod where Team_Name in ('FSL - TXG', 'FSL - TNN', 'TKM'));`,function(err, row){
            if(err){
                console.log('remove FSL - TXG , FSL - TNN from Order_ShipmentData_AMT : ' + err)
            }  
        })

        db.exec(`delete from Order_ShipmentData_AMT_Downs
        where ShipmentNo in (select ShipmentNo from TBL_ZAVGR043_Prod where Team_Name in ('FSL - TXG', 'FSL - TNN', 'TKM'));`,function(err, row){
            if(err){
                console.log('remove FSL - TXG , FSL - TNN from Order_ShipmentData_AMT_Downs ' + err)
            }  
        })
    })
    // update ID
    db.serialize(function(){
        var insertHistory = `
            update HAWB_ShipmentData
            set Country_Id = (select AutoId from HAWB_Country where HAWB_Country.Country = HAWB_ShipmentData.Country)
            ,Shpt_Id = (select autoid from HAWB_ShptPoint where HAWB_ShptPoint.Shpt_Point = HAWB_ShipmentData.Shpt)
            ,Shipto_Id = (select autoid from HAWB_ShipTo where HAWB_ShipTo.ShipTo = HAWB_ShipmentData.ShipTo)
            ,SHPCondition_id =  (select autoid from HAWB_ShptCondition where HAWB_ShptCondition.Shpt_Condition = HAWB_ShipmentData.SHPCondition)
            , Confirm = 1
            where Confirm = 0
        `
        db.exec(insertHistory, function(err, row){
            if(err){
                console.log('update HAWB_ShipmentData Country, Shpt, Shipto, SHPCondition ID : ' + row)
            }   
        })
    })
    //update plant
    db.serialize(function(){
        var updateService = `
            update Order_ShipmentData_Downs
            set plant = case when Shpt like '5%' then '54' else null end
            where plant is null
        `
        var updateServiceReg = `
            update Order_ShipmentData_Regular
            set plant = case when Shpt like '5%' then '54' else null end
            where plant is null
        `
        var updateService89 = `
            update Order_ShipmentData_AMT
            set plant = case when Shpt not like '5%' then '89' else null end
            where plant is null
        `
        db.exec(updateService, function(err, row){
            if(err){
                console.log('update Order_ShipmentData_Downs plant: ' + row)
            }  
        })
        db.exec(updateServiceReg, function(err, row){
            if(err){
                console.log('update Order_ShipmentData_Regular plant: ' + row)
            } 
        })

        db.exec(updateService89, function(err, row){
            if(err){
                console.log('update Order_ShipmentData_AMT plant: ' + row)
            } 
        })

        var updateService = `
            Update Order_ShipmentData_Downs
            set Bonded = t.NonBonded
            ,NonBonded = t.Bonded
            ,TotalItem = t.total
            from (
            select 

            count(case when TBL_LT22_Prod.Source_Typ <> 'UNR' and TBL_LT22_Prod.Source_Typ like '%N%' then 'NB'  end ) as NonBonded 
            ,count(case when TBL_LT22_Prod.Source_Typ = 'UNR' or TBL_LT22_Prod.Source_Typ not like '%N%' then 'B'  end ) as Bonded 
            ,count(TBL_LT22_Prod.Material) as total

            , TBL_ZAVGR043_Prod.ShipmentNo
            from TBL_ZAVGR043_Prod inner join TBL_LT22_Prod
            on TBL_ZAVGR043_Prod.Delivery = TBL_LT22_Prod.Dest_Bin
            where TBL_ZAVGR043_Prod.ShipmentNo <> '' and TBL_LT22_Prod.Source_Typ not in ('922')
            and TBL_ZAVGR043_Prod.WaveGrpNo not like '200%'
            group by  TBL_ZAVGR043_Prod.ShipmentNo ) as t
            where Order_ShipmentData_Downs.ShipmentNo = t.ShipmentNo
            and Order_ShipmentData_Downs.Bonded + Order_ShipmentData_Downs.NonBonded = 0;
        `
        db.exec(updateService, function(err, row){
            if(err){
                console.log('update Order_ShipmentData_Downs BNB row: ' + row)
            }  
        })
 
        db.exec(`Update Order_ShipmentData_AMT
        set Bonded = t.NonBonded
        ,NonBonded = t.Bonded
        ,TotalItem = t.total
        from (
        select 
        
        count(case when TBL_LT22_Prod.Source_Typ <> 'UNR' and TBL_LT22_Prod.Source_Typ like '%N%' then 'NB'  end ) as NonBonded 
        ,count(case when TBL_LT22_Prod.Source_Typ = 'UNR' or TBL_LT22_Prod.Source_Typ not like '%N%' then 'B'  end ) as Bonded 
        ,count(TBL_LT22_Prod.Material) as total
        
        , TBL_ZAVGR043_Prod.ShipmentNo
        from TBL_ZAVGR043_Prod inner join TBL_LT22_Prod
        on TBL_ZAVGR043_Prod.Delivery = TBL_LT22_Prod.Dest_Bin
        where TBL_ZAVGR043_Prod.ShipmentNo <> '' and TBL_LT22_Prod.Source_Typ not in ('922')
        and TBL_ZAVGR043_Prod.WaveGrpNo not like '200%'
        group by  TBL_ZAVGR043_Prod.ShipmentNo ) as t
        where Order_ShipmentData_AMT.ShipmentNo = t.ShipmentNo
        and Order_ShipmentData_AMT.Bonded + Order_ShipmentData_AMT.NonBonded = 0;`, function(err, row){
            if(err){
                console.log('update Order_ShipmentData_AMT BNB row: ' + row)
            }  
        });

        db.exec(`Update Order_ShipmentData_AMT_Downs
        set Bonded = t.NonBonded
        ,NonBonded = t.Bonded
        ,TotalItem = t.total
        from (
        select 
        
        count(case when TBL_LT22_Prod.Source_Typ <> 'UNR' and TBL_LT22_Prod.Source_Typ like '%N%' then 'NB'  end ) as NonBonded 
        ,count(case when TBL_LT22_Prod.Source_Typ = 'UNR' or TBL_LT22_Prod.Source_Typ not like '%N%' then 'B'  end ) as Bonded 
        ,count(TBL_LT22_Prod.Material) as total
        
        , TBL_ZAVGR043_Prod.ShipmentNo
        from TBL_ZAVGR043_Prod inner join TBL_LT22_Prod
        on TBL_ZAVGR043_Prod.Delivery = TBL_LT22_Prod.Dest_Bin
        where TBL_ZAVGR043_Prod.ShipmentNo <> '' and TBL_LT22_Prod.Source_Typ not in ('922')
        and TBL_ZAVGR043_Prod.WaveGrpNo not like '200%'
        group by  TBL_ZAVGR043_Prod.ShipmentNo ) as t
        where Order_ShipmentData_AMT_Downs.ShipmentNo = t.ShipmentNo
        and Order_ShipmentData_AMT_Downs.Bonded + Order_ShipmentData_AMT_Downs.NonBonded = 0;`, function(err, row){
            if(!err){
                console.log('update Order_ShipmentData_AMT_Downs BNB row: ' + row)
            } else {
                console.log('update Order_ShipmentData_AMT_Downs BNB err: ' + err)
            }   
        })

        db.exec(`Update Order_ShipmentData_Regular
        set Bonded = t.NonBonded
        ,NonBonded = t.Bonded
        ,TotalItem = t.total
        from (
        select 
        
        count(case when TBL_LT22_Prod.Source_Typ <> 'UNR' and TBL_LT22_Prod.Source_Typ like '%N%' then 'NB'  end ) as NonBonded 
        ,count(case when TBL_LT22_Prod.Source_Typ = 'UNR' or TBL_LT22_Prod.Source_Typ not like '%N%' then 'B'  end ) as Bonded 
        ,count(TBL_LT22_Prod.Material) as total
        
        , TBL_ZAVGR043_Prod.ShipmentNo
        from TBL_ZAVGR043_Prod inner join TBL_LT22_Prod
        on TBL_ZAVGR043_Prod.Delivery = TBL_LT22_Prod.Dest_Bin
        where TBL_ZAVGR043_Prod.ShipmentNo <> '' and TBL_LT22_Prod.Source_Typ not in ('922')
        and TBL_ZAVGR043_Prod.WaveGrpNo not like '200%'
        group by  TBL_ZAVGR043_Prod.ShipmentNo ) as t
        where Order_ShipmentData_Regular.ShipmentNo = t.ShipmentNo
        and Order_ShipmentData_Regular.Bonded + Order_ShipmentData_Regular.NonBonded = 0;`, function(err, row){
            if(!err){
                console.log('update Order_ShipmentData_Regular BNB row: ' + row)
            } else {
                console.log('update Order_ShipmentData_Regular BNB err: ' + err)
            }   
        })

        db.exec(`Update Order_ShipmentData_RegularTW
        set Bonded = t.NonBonded
        ,NonBonded = t.Bonded
        ,TotalItem = t.total
        from (
        select 
        
        count(case when TBL_LT22_Prod.Source_Typ <> 'UNR' and TBL_LT22_Prod.Source_Typ like '%N%' then 'NB'  end ) as NonBonded 
        ,count(case when TBL_LT22_Prod.Source_Typ = 'UNR' or TBL_LT22_Prod.Source_Typ not like '%N%' then 'B'  end ) as Bonded 
        ,count(TBL_LT22_Prod.Material) as total
        
        , TBL_ZAVGR043_Prod.ShipmentNo
        from TBL_ZAVGR043_Prod inner join TBL_LT22_Prod
        on TBL_ZAVGR043_Prod.Delivery = TBL_LT22_Prod.Dest_Bin
        where TBL_ZAVGR043_Prod.ShipmentNo <> '' and TBL_LT22_Prod.Source_Typ not in ('922')
        and TBL_ZAVGR043_Prod.WaveGrpNo not like '200%'
        group by  TBL_ZAVGR043_Prod.ShipmentNo ) as t
        where Order_ShipmentData_RegularTW.ShipmentNo = t.ShipmentNo
        and Order_ShipmentData_RegularTW.Bonded + Order_ShipmentData_RegularTW.NonBonded = 0;`, function(err, row){
            if(!err){
                console.log('update Order_ShipmentData_RegularTW BNB row: ' + row)
            } else {
                console.log('update Order_ShipmentData_RegularTW BNB err: ' + err)
            }   
        })


        db.exec(`Update Order_ShipmentData_Downs
        set Bonded = tt.NonBonded
        ,NonBonded = tt.Bonded
        ,TotalItem = tt.total
        from (
        select  NonBonded, Bonded , "total", Dest_Bin, TBL_ZAVGR043_Prod.ShipmentNo, TBL_ZAVGR043_Prod.WaveGrpNo from (
        select 
        count(case when TBL_LT22_Prod.Source_Typ <> 'UNR' and TBL_LT22_Prod.Source_Typ like '%N%' then 'NB'  end )  as NonBonded
        ,count(case when TBL_LT22_Prod.Source_Typ = 'UNR' or TBL_LT22_Prod.Source_Typ not like '%N%' then 'B'  end ) as Bonded 
        ,count(TBL_LT22_Prod.Material) as total
        , TBL_LT22_Prod.Dest_Bin
        from TBL_LT22_Prod
        group by TBL_LT22_Prod.Dest_Bin
        ) as t inner join TBL_ZAVGR043_Prod
        on t.Dest_Bin = TBL_ZAVGR043_Prod.WaveGrpNo
        ) as tt
        where Order_ShipmentData_Downs.ShipmentNo = tt.ShipmentNo
        and Order_ShipmentData_Downs.Bonded + Order_ShipmentData_Downs.NonBonded = 0;`, function(err, row){
            if(!err){
                console.log('update Order_ShipmentData_RegularTW BNB row: ' + row)
            } else {
                console.log('update Order_ShipmentData_RegularTW BNB err: ' + err)
            }   
        })

        db.exec(`Update Order_ShipmentData_AMT
        set Bonded = tt.NonBonded
        ,NonBonded = tt.Bonded
        ,TotalItem = tt.total
        from (
        select  NonBonded, Bonded , "total", Dest_Bin, TBL_ZAVGR043_Prod.ShipmentNo, TBL_ZAVGR043_Prod.WaveGrpNo from (
        select 
        count(case when TBL_LT22_Prod.Source_Typ <> 'UNR' and TBL_LT22_Prod.Source_Typ like '%N%' then 'NB'  end )  as NonBonded
        ,count(case when TBL_LT22_Prod.Source_Typ = 'UNR' or TBL_LT22_Prod.Source_Typ not like '%N%' then 'B'  end ) as Bonded 
        ,count(TBL_LT22_Prod.Material) as total
        , TBL_LT22_Prod.Dest_Bin
        from TBL_LT22_Prod
        group by TBL_LT22_Prod.Dest_Bin
        ) as t inner join TBL_ZAVGR043_Prod
        on t.Dest_Bin = TBL_ZAVGR043_Prod.WaveGrpNo
        ) as tt
        where Order_ShipmentData_AMT.ShipmentNo = tt.ShipmentNo
        and Order_ShipmentData_AMT.Bonded + Order_ShipmentData_AMT.NonBonded = 0;`, function(err, row){
            if(!err){
                console.log('update Order_ShipmentData_RegularTW BNB row: ' + row)
            } else {
                console.log('update Order_ShipmentData_RegularTW BNB err: ' + err)
            }   
        })

        db.exec(`Update Order_ShipmentData_AMT_Downs
        set Bonded = tt.NonBonded
        ,NonBonded = tt.Bonded
        ,TotalItem = tt.total
        from (
        select  NonBonded, Bonded , "total", Dest_Bin, TBL_ZAVGR043_Prod.ShipmentNo, TBL_ZAVGR043_Prod.WaveGrpNo from (
        select 
        count(case when TBL_LT22_Prod.Source_Typ <> 'UNR' and TBL_LT22_Prod.Source_Typ like '%N%' then 'NB'  end )  as NonBonded
        ,count(case when TBL_LT22_Prod.Source_Typ = 'UNR' or TBL_LT22_Prod.Source_Typ not like '%N%' then 'B'  end ) as Bonded 
        ,count(TBL_LT22_Prod.Material) as total
        , TBL_LT22_Prod.Dest_Bin
        from TBL_LT22_Prod
        group by TBL_LT22_Prod.Dest_Bin
        ) as t inner join TBL_ZAVGR043_Prod
        on t.Dest_Bin = TBL_ZAVGR043_Prod.WaveGrpNo
        ) as tt
        where Order_ShipmentData_AMT_Downs.ShipmentNo = tt.ShipmentNo
        and Order_ShipmentData_AMT_Downs.Bonded + Order_ShipmentData_AMT_Downs.NonBonded = 0;`, function(err, row){
            if(!err){
                console.log('update Order_ShipmentData_RegularTW BNB row: ' + row)
            } else {
                console.log('update Order_ShipmentData_RegularTW BNB err: ' + err)
            }   
        })

        db.exec(`Update Order_ShipmentData_Regular
        set Bonded = tt.NonBonded
        ,NonBonded = tt.Bonded
        ,TotalItem = tt.total
        from (
        select  NonBonded, Bonded , "total", Dest_Bin, TBL_ZAVGR043_Prod.ShipmentNo, TBL_ZAVGR043_Prod.WaveGrpNo from (
        select 
        count(case when TBL_LT22_Prod.Source_Typ <> 'UNR' and TBL_LT22_Prod.Source_Typ like '%N%' then 'NB'  end )  as NonBonded
        ,count(case when TBL_LT22_Prod.Source_Typ = 'UNR' or TBL_LT22_Prod.Source_Typ not like '%N%' then 'B'  end ) as Bonded 
        ,count(TBL_LT22_Prod.Material) as total
        , TBL_LT22_Prod.Dest_Bin
        from TBL_LT22_Prod
        group by TBL_LT22_Prod.Dest_Bin
        ) as t inner join TBL_ZAVGR043_Prod
        on t.Dest_Bin = TBL_ZAVGR043_Prod.WaveGrpNo
        ) as tt
        where Order_ShipmentData_Regular.ShipmentNo = tt.ShipmentNo
        and Order_ShipmentData_Regular.Bonded + Order_ShipmentData_Regular.NonBonded = 0;`, function(err, row){
            if(!err){
                console.log('update Order_ShipmentData_RegularTW BNB row: ' + row)
            } else {
                console.log('update Order_ShipmentData_RegularTW BNB err: ' + err)
            }   
        })

        db.exec(`Update Order_ShipmentData_RegularTW
        set Bonded = tt.NonBonded
        ,NonBonded = tt.Bonded
        ,TotalItem = tt.total
        from (
        select  NonBonded, Bonded , "total", Dest_Bin, TBL_ZAVGR043_Prod.ShipmentNo, TBL_ZAVGR043_Prod.WaveGrpNo from (
        select 
        count(case when TBL_LT22_Prod.Source_Typ <> 'UNR' and TBL_LT22_Prod.Source_Typ like '%N%' then 'NB'  end )  as NonBonded
        ,count(case when TBL_LT22_Prod.Source_Typ = 'UNR' or TBL_LT22_Prod.Source_Typ not like '%N%' then 'B'  end ) as Bonded 
        ,count(TBL_LT22_Prod.Material) as total
        , TBL_LT22_Prod.Dest_Bin
        from TBL_LT22_Prod
        group by TBL_LT22_Prod.Dest_Bin
        ) as t inner join TBL_ZAVGR043_Prod
        on t.Dest_Bin = TBL_ZAVGR043_Prod.WaveGrpNo
        ) as tt
        where Order_ShipmentData_RegularTW.ShipmentNo = tt.ShipmentNo
        and Order_ShipmentData_RegularTW.Bonded + Order_ShipmentData_RegularTW.NonBonded = 0;`, function(err, row){
            if(!err){
                console.log('update Order_ShipmentData_RegularTW BNB row: ' + row)
            } else {
                console.log('update Order_ShipmentData_RegularTW BNB err: ' + err)
            }   
        })

        db.exec(`update TBL_ZAVGR043_Prod
        set TO_ConfirmDate = case when t.Conf_date = '' then NULL else t.Conf_date end
        ,TO_ConfirmTime = case when t.Conf_time = '00:00:00' then NULL else t.Conf_time end
        from (
            select * from TBL_LT22_Prod
        ) as t
        where TBL_ZAVGR043_Prod.Delivery = t.Dest_Bin
        and TBL_ZAVGR043_Prod.TO_ConfirmDate is null;`, function(err, row){
            if(!err){
                console.log('update Order_ShipmentData_RegularTW BNB row: ' + row)
            } else {
                console.log('update Order_ShipmentData_RegularTW BNB err: ' + err)
            }   
        })
        db.exec(`update TBL_LT22_Prod
        set CN_Ctrl_Parts = 1
        from ( 
        select * from TBL_CN_Ctrl_List
        )as t 
        where TBL_LT22_Prod.Material = t.Material`)

        db.exec(`Update TBL_ZAVGR043_Prod
        set CN_Ctrl_Parts = 1
        from (
            select ShipmentNo from TBL_ZAVGR043_Prod
        where Delivery in (select Dest_Bin from TBL_LT22_Prod where TBL_LT22_Prod.CN_Ctrl_Parts = 1 )
        group by ShipmentNo
        ) as t
        where TBL_ZAVGR043_Prod.ShipmentNo = t.ShipmentNo;`)
        
        db.exec(`Update TBL_ZAVGR043_Prod
        set CN_Ctrl_Parts = 1
        from (
            select ShipmentNo from TBL_ZAVGR043_Prod
        where WaveGrpNo in (select Dest_Bin from TBL_LT22_Prod where TBL_LT22_Prod.CN_Ctrl_Parts = 1 )
        group by ShipmentNo
        ) as t
        where TBL_ZAVGR043_Prod.ShipmentNo = t.ShipmentNo`)

        var updateService = `
        update HAWB_ShipmentData
        set Vendor = t.Forward
        ,HAWB_Expand = t.HAWB_Expand
        , confirmForward = 1
        , Cut_Time = t.Cut_Time
        , Pickup_Time = t.Pickup_Time
        , Cus_Import = t.Cus_Import
        from (
            select AutoId
            ,Country_Id
            ,Condition_Id
            ,Shpt_Id
            ,Shipto_Id
            ,Forward
            ,HAWB_Expand
            ,Cut_Time
            ,Pickup_Time
            ,Cus_Import
            ,case WHEN Mon = 1 then '1' END as Mons
            ,case when Tue = 1 then '2' END as Tues
            ,case when Wed = 1 then '3' END as Weds
            ,case when Thu = 1 then '4' END as Thus
            ,case when Fri = 1 then '5' END as Fris
            ,case when Sat = 1 then '6' END as Sats
            ,case when Sun = 1 then '7' END as Suns
            from HAWB_Rule 
        ) as t 
        where ifnull(HAWB_ShipmentData.Country_Id,0) ||'-'||ifnull(HAWB_ShipmentData.SHPCondition_id,0)||'-'||ifnull(HAWB_ShipmentData.Shpt_Id,0)||'-'||ifnull(HAWB_ShipmentData.Shipto_Id,0)
        = ifnull(t.Country_Id,0) ||'-'||ifnull(t.Condition_Id,0)||'-'||ifnull(t.Shpt_Id,0)||'-'||ifnull(t.Shipto_Id,0)
        and confirmForward = 0 and Vendor is null
        --and instr(t.Mons||','||t.Tues||','||t.Weds||','||t.Thus||','||t.Fris||','||t.Sats||','||t.Suns, strftime('%w',datetime(HAWB_ShipmentData.ImportDateTime,'+8 hours'))) > 0
        `

        var updateService2 = `
        update HAWB_ShipmentData
        set Vendor = t.Forward
        ,HAWB_Expand = t.HAWB_Expand
        , confirmForward = 1
        , Cut_Time = t.Cut_Time
        , Pickup_Time = t.Pickup_Time
        , Cus_Import = t.Cus_Import
        from (
            select AutoId
            ,Country_Id
            ,Condition_Id
            ,Shpt_Id
            ,Shipto_Id
            ,Forward
            ,HAWB_Expand
            ,Cut_Time
            ,Pickup_Time
            ,Cus_Import
            ,case WHEN Mon = 1 then '1' END as Mons
            ,case when Tue = 1 then '2' END as Tues
            ,case when Wed = 1 then '3' END as Weds
            ,case when Thu = 1 then '4' END as Thus
            ,case when Fri = 1 then '5' END as Fris
            ,case when Sat = 1 then '6' END as Sats
            ,case when Sun = 1 then '7' END as Suns
            from HAWB_Rule 

        ) as t 
        where ifnull(HAWB_ShipmentData.SHPCondition_id,0)||'-'||ifnull(HAWB_ShipmentData.Shpt_Id,0)
        = ifnull(t.Condition_Id,0)||'-'||ifnull(t.Shpt_Id,0)
        and confirmForward = 0 and Vendor is null
        --and instr(t.Mons||','||t.Tues||','||t.Weds||','||t.Thus||','||t.Fris||','||t.Sats||','||t.Suns, strftime('%w',datetime(HAWB_ShipmentData.ImportDateTime,'+8 hours'))) > 0
        `

        var updateService3 = `
        update HAWB_ShipmentData
        set Vendor = t.Forward
        ,HAWB_Expand = t.HAWB_Expand
        , confirmForward = 1
        , Cut_Time = t.Cut_Time
        , Pickup_Time = t.Pickup_Time
        , Cus_Import = t.Cus_Import
        from (
            select AutoId
            ,Country_Id
            ,Condition_Id
            ,Shpt_Id
            ,Shipto_Id
            ,Forward
            ,HAWB_Expand
            ,Cut_Time
            ,Pickup_Time
            ,Cus_Import
            ,case WHEN Mon = 1 then '1' END as Mons
            ,case when Tue = 1 then '2' END as Tues
            ,case when Wed = 1 then '3' END as Weds
            ,case when Thu = 1 then '4' END as Thus
            ,case when Fri = 1 then '5' END as Fris
            ,case when Sat = 1 then '6' END as Sats
            ,case when Sun = 1 then '7' END as Suns
            from HAWB_Rule 

        ) as t 
        where ifnull(HAWB_ShipmentData.Country_Id,0) ||'-'||ifnull(HAWB_ShipmentData.SHPCondition_id,0)
        = ifnull(t.Country_Id,0) ||'-'||ifnull(t.Condition_Id,0)
        and confirmForward = 0 and Vendor is null
        --and instr(t.Mons||','||t.Tues||','||t.Weds||','||t.Thus||','||t.Fris||','||t.Sats||','||t.Suns, strftime('%w',datetime(HAWB_ShipmentData.ImportDateTime,'+8 hours'))) > 0
        `

        var updateService4 = `
        update HAWB_ShipmentData
        set R_CutTime = case when Cut_Time is null then strftime('%Y-%m-%d %H:%M',strftime('%Y-%m-%d %H:%M',datetime(ImportDateTime,'+10 hours')))
            when Cut_Time is not null and strftime('%Y-%m-%d %H:%M',datetime(ImportDateTime,'+8 hours')) < strftime('%Y-%m-%d %H:%M',strftime('%Y-%m-%d',strftime('%Y-%m-%d %H:%M',datetime(ImportDateTime,'+8 hours')))||' '||Cut_Time) 
            then strftime('%Y-%m-%d %H:%M',strftime('%Y-%m-%d',strftime('%Y-%m-%d %H:%M',datetime(ImportDateTime,'+8 hours')))||' '||Cut_Time) 
            ELSE strftime('%Y-%m-%d %H:%M',date(strftime('%Y-%m-%d',strftime('%Y-%m-%d %H:%M',datetime(ImportDateTime,'+8 hours'))),'+1 day')||' '||Cut_Time)
            end
        , R_PickupTime = case when Pickup_Time is not null and strftime('%Y-%m-%d %H:%M',datetime(ImportDateTime,'+8 hours')) < strftime('%Y-%m-%d %H:%M',strftime('%Y-%m-%d',strftime('%Y-%m-%d %H:%M',datetime(ImportDateTime,'+8 hours')))||' '||Cut_Time)
            then strftime('%Y-%m-%d %H:%M',strftime('%Y-%m-%d',strftime('%Y-%m-%d %H:%M',datetime(ImportDateTime,'+8 hours')))||' '||Pickup_Time)
            when Pickup_Time is null and Cus_Import is not null then strftime('%Y-%m-%d %H:%M',datetime(strftime('%Y-%m-%d %H:%M',datetime(ImportDateTime,'+8 hours'))), cus_import) 
            else strftime('%Y-%m-%d %H:%M',date(strftime('%Y-%m-%d',strftime('%Y-%m-%d %H:%M',datetime(ImportDateTime,'+8 hours'))),'+1 day')||' '||Pickup_Time)
            end
            
        where R_CutTime is NULL;
        `

        


        db.exec(updateService, function(err, row){
            if(!err){
                console.log('update Order_ShipmentData_Downs forward row: ' + row)
            } else {
                console.log('update Order_ShipmentData_Downs forward err: ' + err)
            }   
        })
        db.exec(updateService2, function(err, row){
            if(!err){
                console.log('update Order_ShipmentData_Downs forward row: ' + row)
            } else {
                console.log('update Order_ShipmentData_Downs forward err: ' + err)
            }   
        })
        db.exec(updateService3, function(err, row){
            if(!err){
                console.log('update Order_ShipmentData_Downs forward row: ' + row)
            } else {
                console.log('update Order_ShipmentData_Downs forward err: ' + err)
            }   
        })
        db.exec(updateService4, function(err, row){
            if(!err){
                console.log('update Order_ShipmentData_Downs forward row: ' + row)
            } else {
                console.log('update Order_ShipmentData_Downs forward err: ' + err)
            }   
        })
        
        db.exec(`update HAWB_ShipmentData
        set plant = t.plant
        from (
            select * from TBL_Plant
        ) t
        where HAWB_ShipmentData.Shpt = t.Shpt and HAWB_ShipmentData.plant is null;`, function(err, row){
            if(!err){
                console.log('update HAWB_Shipment Plant row: ' + row)
            } else {
                console.log('update HAWB_Shipment Plant err: ' + err)
            }   
        })
        db.exec(`update HAWB_ShipmentData
        set plant = case when Shpt like '5%' then '5400'
        when Shpt like '8%' then '5400'
        else NULL end 
        where plant is null; `, function(err, row){
            if(!err){
                console.log('update HAWB_Shipment Plant row: ' + row)
            } else {
                console.log('update HAWB_Shipment Plant err: ' + err)
            }   
        })
        db.exec(`update HAWB_ShipmentData
        set plant = 5400
        
        where plant like'54%' and plant not in ('5401','5402');`, function(err, row){
            if(!err){
                console.log('update HAWB_Shipment Plant row: ' + row)
            } else {
                console.log('update HAWB_Shipment Plant err: ' + err)
            }   
        })
        db.exec(`
        update HAWB_ShipmentData
        set plant = 8900
        
        where plant like'89%' and plant not in ('8930','8960');`, function(err, row){
            if(!err){
                console.log('update HAWB_Shipment Plant row: ' + row)
            } else {
                console.log('update HAWB_Shipment Plant err: ' + err)
            }   
        })

        db.exec(`UPDATE HAWB_ShipmentData
        set Start_With = t.Start_With
        from (
            select * from HAWB_Import_Check
        ) as t
        where HAWB_ShipmentData.Vendor = t.Vendor
        and HAWB_ShipmentData.DP = t.DP
        and HAWB_ShipmentData.SHPCondition = t.SHPCondition
        and HAWB_ShipmentData.plant = t.plant
        and HAWB_ShipmentData.Vendor is not null
        AND HAWB_ShipmentData.Start_With IS NULL;
        `, function(err, row){
            if(!err){
                console.log('update HAWB_Shipment Start_With row: ' + row)
            } else {
                console.log('update HAWB_Shipment Start_With err: ' + err)
            }   
        })
        db.exec(`UPDATE HAWB_ShipmentData
        set Start_With = t.Start_With
        from (
            select * from HAWB_Import_Check
        ) as t
        where HAWB_ShipmentData.Vendor = t.Vendor
        and HAWB_ShipmentData.DP = t.DP
        and t.SHPCondition is null
        and HAWB_ShipmentData.plant = t.plant
        and HAWB_ShipmentData.Vendor is not null
        AND HAWB_ShipmentData.Start_With IS NULL;`, function(err, row){
            if(!err){
                console.log('update HAWB_Shipment Start_With row: ' + row)
            } else {
                console.log('update HAWB_Shipment Start_With err: ' + err)
            }   
        })

        db.exec(`delete from TempRuleAssign;`)
        db.exec(`WITH RECURSIVE
        cnt( ShipmentNo, Vendor, M_HAWB, D_HAWB, ImportDateTime, AutoId ) AS ( select ShipmentNo, Vendor, M_HAWB, D_HAWB, ImportDateTime, AutoId from HAWB_ShipmentData where HAWB_Expand = 0 order by ImportDateTime, AutoId )
        insert into TempRuleAssign select AutoId, ImportDateTime,  ShipmentNo, Vendor, M_HAWB, D_HAWB from cnt;`)

        db.exec(`delete from TempRuleRunTime;`)
        db.exec(`delete from TempRuleAssignExpand;`)

        db.exec(`insert into TempRuleAssignExpand ( AutoId, ImportDateTime,  ShipmentNo, shipto, Vendor , Cut_Time, DP, SHPCondition, Start_With ) 
        select MAX(AutoId), ImportDateTime,  ShipmentNo, shipto, Vendor, R_CutTime , DP, SHPCondition, Start_With
        from HAWB_ShipmentData where HAWB_Expand = 1 and length(ShipmentNo) = 8  
        group by ImportDateTime,  ShipmentNo, shipto, Vendor, R_CutTime , DP, SHPCondition, Start_With
        order by  MAX(AutoId), ShipTo ;`)

        var updateHistory = `

        delete from audit;

        `
        db.exec(updateHistory, function(err, row){
            if(!err){
                console.log('delete Audit row: ' + row)
            } else {
                console.log('delete Audit err: ' + err)
            }   
        })

        db.exec(`
        UPDATE TBL_ZAVGR043_Prod
        set CreateOn = replace(CreateOn, '/','-')
        ,ShipmentCreateDate = replace(ShipmentCreateDate, '/','-')
        ,EntryDate = replace(EntryDate,'/','-')
        ,TO_ConfirmDate = replace(TO_ConfirmDate,'/','-')
        ,TO_CreateDate = replace(TO_CreateDate,'/','-');
        
        update TBL_ZAVGR043_Prod
        set KPI_Hour = t.Service
        , KPI_Ctrl = 1
        , WithoutHolday = t.WithoutHolday
        , CountryContro = t.CountryContro
        from ( select * from service_KPI ) as t
        where case when TBL_ZAVGR043_Prod.Shpt like '5%' then '54'
        when  TBL_ZAVGR043_Prod.Shpt like '8%' then '89'
        when TBL_ZAVGR043_Prod.Shpt = '317' then '89'
        else null end = t.plant
        and TBL_ZAVGR043_Prod.DP = t.DP
        --and ifnull(TBL_ZAVGR043_Prod.SHPCondition,0) = ifnull(t.Condition,0)
        and TBL_ZAVGR043_Prod.KPI_Ctrl = 0;
        
        update TBL_ZAVGR043_Prod
        set Service_Start = datetime(ShipmentCreateDate ||' '|| ShipmentCreateTime, (select'+'||TimeZoneValues||' Hours'))
        , start_Week_Day = case when strftime('%w',datetime(ShipmentCreateDate ||' '|| ShipmentCreateTime, (select'+'||TimeZoneValues||' Hours'))) = '0' then '7' else strftime('%w',datetime(ShipmentCreateDate ||' '|| ShipmentCreateTime, (select'+'||TimeZoneValues||' Hours'))) end
        where Service_Start is null;
        
        UPDATE TBL_ZAVGR043_Prod
        set Service_End = datetime(Service_Start, (select'+'||KPI_Hour||' Hours'))
        , end_Week_Day = case when strftime('%w',datetime(Service_Start, (select'+'||KPI_Hour||' Hours'))) = '0' then '7' else strftime('%w',datetime(Service_Start, (select'+'||KPI_Hour||' Hours'))) end
        where Service_End is null ;
        
        
        update TBL_ZAVGR043_Prod
        set diff_work_Day = case WHEN start_Week_Day = '4' then '1'
        WHEN start_Week_Day = '5' then '2'
        WHEN start_Week_Day = '6' then '3'
        WHEN start_Week_Day = '7' then '3'
        else end_Week_Day - start_Week_Day end
        , kpi_work_day = KPI_Hour / 8
        where start_Week_Day is NULL;`, (err, row) => {
            if(err) {
                console.log('update service time err')
            }
        })

        db.all('select * from Audit order by AutoId desc limit 20000', function(err, row){
            if(!err){
                resolve(row)
            } else {
                reject(err)
            } 
        })
        
    })
    
    db.close
    */

    db.serialize(async function () {

        db.serialize(function () {
            db.exec(`-- remove audit TABLE
            delete from audit;`, function (err, rows) {
                if (err) {
                    console.log(err.message)
                }
                console.log('remove audit TABLE')
            })

            db.exec(`-- Update TBL_ZAVGR043_Prod status
            update TBL_ZAVGR043_Prod
            set OvrGMStus = t.OverallGMStatus
            , OvrPickingStus = t.OverallPickingStatus
            , OvrWMStus = t.OverallWMStatus
            , EntryDate = t.EntryDate
            , PGITime = t.PGITime
            , ProformaD = t.ProformaD
            , ShippingInstructions = t.ShippingInstructions
            from (
                select * from ZAVGR043_Temp
            ) t
            where TBL_ZAVGR043_Prod.ShipmentNo = t.ShipmentNo
            and TBL_ZAVGR043_Prod.ShipmentNo is not null;`, function (err, rows) {
                if (err) {
                    console.log(err.message)
                }
                console.log('Update TBL_ZAVGR043_Prod status')
            })

            db.exec(`-- Update ZAVGR043_Temp Wave not finish
            update ZAVGR043_Temp
            set OrderNotFinish_Control = 1
            from (
            select * from (
            select ShipmentNo
            ,rank() over ( PARTITION by  ShipmentNo order by  case when "WaveGrpNo." like '5%' then NULL 
            when "WaveGrpNo." = '' then NULL 
            else "WaveGrpNo." end ) as logNum
            ,case when "WaveGrpNo." like '5%' then NULL 
            when "WaveGrpNo." = '' then NULL 
            else "WaveGrpNo." end as WaveGrpNo
            from ZAVGR043_Temp

            group by ShipmentNo
            ,case when "WaveGrpNo." like '5%' then NULL 
            when "WaveGrpNo." = '' then NULL 
            else "WaveGrpNo." end
            order by ShipmentNo
            )  t
            where t.logNum > 1
            ) tt
            where ZAVGR043_Temp.ShipmentNo = tt.ShipmentNo;`, function (err, rows) {
                if (err) {
                    console.log(err.message)
                }
                console.log('Update ZAVGR043_Temp Wave not finish')
            })

            db.exec(`-- Update ZAVGR043_Temp create item nonWave
            update ZAVGR043_Temp
            set TOCreateItem = t.Total
            from (

                select 
                ZAVGR043_Temp.Delivery
                ,count(TBL_LT22_Prod.AutiId) as Total
                from ZAVGR043_Temp inner join TBL_LT22_Prod
                on ZAVGR043_Temp.Delivery = TBL_LT22_Prod.Dest_Bin
                where TBL_LT22_Prod."CS" is null 
                and TBL_LT22_Prod.Dest_Typ not in ('TSP')
                and TBL_LT22_Prod.Source_Typ not in ('TSP','922')
                group by ZAVGR043_Temp.Delivery
                
            ) t 
            where ZAVGR043_Temp.Delivery = t.Delivery;`, function (err, rows) {
                if (err) {
                    console.log(err.message)
                }
                console.log('Update ZAVGR043_Temp Wave not finish')
            })
            db.exec(`-- Update ZAVGR043_Temp create item Wave
            update ZAVGR043_Temp
            set TOCreateItem = t.Total
            from (

                select 
                ZAVGR043_Temp."WaveGrpNo."
                ,count(TBL_LT22_Prod.AutiId) as Total
                from ZAVGR043_Temp inner join TBL_LT22_Prod
                on ZAVGR043_Temp."WaveGrpNo." = TBL_LT22_Prod.Dest_Bin
                where TBL_LT22_Prod."CS" is null 
                and TBL_LT22_Prod.Dest_Typ in ('TSP')
                --and TBL_LT22_Prod.Source_Typ not in ('TSP','922')
                group by ZAVGR043_Temp."WaveGrpNo."
                
            ) t 
            where ZAVGR043_Temp."WaveGrpNo." = t."WaveGrpNo.";`, function (err, rows) {
                if (err) {
                    console.log(err.message)
                }
                console.log('Update ZAVGR043_Temp Wave not finish')
            })

            db.exec(`-- Update ZAVGR043_Temp Pieces not match
            update ZAVGR043_Temp
            set Piece_Control = 1
            from (
            select a."#Items"
            , a.Delivery
            ,a.ShipmentNo
            ,a."#Pieces"
            ,b.T_Item
            ,b.Dest_Bin
            ,b.T_Qty
            from ZAVGR043_Temp  as a inner join (

            select count(t.AutiId)  as T_Item, t.Dest_Bin, sum(Sourcetargetqty) as T_Qty
            from (
            select AutiId
            ,Sourcetargetqty
            ,Dest_Bin
            from TBL_LT22_Prod
            where  Dest_Typ not in ('TSP')
            and Source_Typ not in ('TSP','922')
            and CS is null
            group by AutiId, Dest_Bin, Sourcetargetqty
            ) t
            group by t.Dest_Bin
            ) as b
            on a.Delivery = b.Dest_Bin
            where a."#Pieces" <> b.T_Qty
            ) tt
            where ZAVGR043_Temp.ShipmentNo = tt.ShipmentNo;`, function (err, rows) {
                if (err) {
                    console.log(err.message)
                }
                console.log('Update ZAVGR043_Temp Pieces not match')
            })
            db.exec(`-- Update China Control parts
            update TBL_LT22_Prod
            set CN_Ctrl_Parts = 1
            from ( 
            select * from TBL_CN_Ctrl_List
            )as t 
            where TBL_LT22_Prod.Material = t.Material;

            update TBL_LT22_Prod
            set W_Parts_Control = 1
            where Material like '%W';

            update TBL_LT22_Prod
            set UNR_Control = 1
            where Source_Typ in ('UNR','REG');

            update TBL_LT22_Prod
            set HAZ_Control = 1
            from (
                select * from TBL_HAZ_Ctrl_List
            ) as t
            where TBL_LT22_Prod.Material = t.Material;
            ----`, function (err, rows) {
                if (err) {
                    console.log(err.message)
                }
                console.log('Update LT22 Parts status')
            })
        })

        db.serialize(function () {
            db.exec(`
            -- non Wav check
            Update ZAVGR043_Temp
            set CN_Ctrl_Parts = 1
            from (
                select ShipmentNo from ZAVGR043_Temp
            where Delivery in (select Dest_Bin from TBL_LT22_Prod where TBL_LT22_Prod.CN_Ctrl_Parts = 1 )
            group by ShipmentNo
            ) as t
            where ZAVGR043_Temp.ShipmentNo = t.ShipmentNo;

            Update ZAVGR043_Temp
            set W_Parts_Control = 1
            from (
                select ShipmentNo from ZAVGR043_Temp
            where Delivery in (select Dest_Bin from TBL_LT22_Prod where TBL_LT22_Prod.W_Parts_Control = 1  )
            group by ShipmentNo
            ) as t
            where ZAVGR043_Temp.ShipmentNo = t.ShipmentNo;

            Update ZAVGR043_Temp
            set UNR_Control = 1
            from (
                select ShipmentNo from ZAVGR043_Temp
            where Delivery in (select Dest_Bin from TBL_LT22_Prod where TBL_LT22_Prod.UNR_Control = 1  )
            group by ShipmentNo
            ) as t
            where ZAVGR043_Temp.ShipmentNo = t.ShipmentNo;

            Update ZAVGR043_Temp
            set HAZ_Control = 1
            from (
                select ShipmentNo from ZAVGR043_Temp
            where Delivery in (select Dest_Bin from TBL_LT22_Prod where TBL_LT22_Prod.HAZ_Control = 1 )
            group by ShipmentNo
            ) as t
            where ZAVGR043_Temp.ShipmentNo = t.ShipmentNo;
            -- wave check
            Update ZAVGR043_Temp
            set CN_Ctrl_Parts = 1
            from (
                select ShipmentNo from ZAVGR043_Temp
            where "WaveGrpNo." in (select Dest_Bin from TBL_LT22_Prod where TBL_LT22_Prod.CN_Ctrl_Parts = 1 )
            group by ShipmentNo
            ) as t
            where ZAVGR043_Temp.ShipmentNo = t.ShipmentNo;
            
            Update ZAVGR043_Temp
            set W_Parts_Control = 1
            from (
                select ShipmentNo from ZAVGR043_Temp
            where "WaveGrpNo." in (select Dest_Bin from TBL_LT22_Prod where TBL_LT22_Prod.W_Parts_Control = 1 )
            group by ShipmentNo
            ) as t
            where ZAVGR043_Temp.ShipmentNo = t.ShipmentNo;
            
            Update ZAVGR043_Temp
            set UNR_Control = 1
            from (
                select ShipmentNo from ZAVGR043_Temp
            where "WaveGrpNo." in (select Dest_Bin from TBL_LT22_Prod where TBL_LT22_Prod.UNR_Control = 1 )
            group by ShipmentNo
            ) as t
            where ZAVGR043_Temp.ShipmentNo = t.ShipmentNo;
            
            Update ZAVGR043_Temp
            set HAZ_Control = 1
            from (
                select ShipmentNo from ZAVGR043_Temp
            where "WaveGrpNo." in (select Dest_Bin from TBL_LT22_Prod where TBL_LT22_Prod.HAZ_Control = 1 )
            group by ShipmentNo
            ) as t
            where ZAVGR043_Temp.ShipmentNo = t.ShipmentNo;`, function (err, rows) {
                if (err) {
                    console.log(err.message)
                }
                console.log('remove audit TABLE')
            })
        })

        db.serialize(function () {
            db.exec(`delete from ZAVGR043_Temp where ShipmentNo in ( Select ShipmentNo from TBL_ZAVGR043_Prod group by ShipmentNo )`, function (err) {
                if (err) {
                    console.log(err.message)
                }
                console.log('remove ZAVGR043_Temp duplicate in TBL_ZAVGR043_Prod')
            })
            db.exec(`-- insert new data to TBL_ZAVGR043_Prod
            INSERT INTO TBL_ZAVGR043_Prod (
            Shpt
            ,DP
            ,Delivery
            ,Country
            ,"Items"
            ,Ordes
            ,StorageLocation
            ,"ShipTo"
            ,Consignee
            ,CreateOn
            ,"CreateTime"
            ,TransferOrder
            ,TO_CreateDate
            ,TO_CreateTime
            ,ShipmentNo
            ,ShipmentCreateDate
            ,ShipmentCreateTime
            ,SHPCondition
            ,ProformaD
            ,Route
            ,SOrg
            ,Billoflading
            ,OvrPickingStus
            ,OvrWMStus
            ,OvrGMStus
            ,DivT
            ,CustomerPONo
            ,WaveGrpNo
            ,ShippingInstructions
            ,Pieces
            )
            SELECT Shpt
            ,DP
            ,Delivery
            ,Country
            ,"#Items"
            ,Orde
            ,StorageLocation
            ,"Ship-To"
            ,Consignee
            ,Createdon
            ,"Time"
            ,TransferOrder
            ,TOCreateDate
            ,TOCreateTime
            ,ShipmentNo
            ,ShipmentCreateDate
            ,ShipmentCreateTime
            ,ShippingCondition
            ,ProformaD
            ,Route
            ,SOrg
            ,Billoflading
            ,OverallPickingStatus
            ,OverallWMStatus
            ,OverallGMStatus
            ,DlvT
            ,"CustomerPONo."
            ,"WaveGrpNo."
            ,ShippingInstructions
            ,"#Pieces"
            FROM ZAVGR043_Temp
            WHERE  CN_Ctrl_Parts = 0 and HAZ_Control = 0 and W_Parts_Control = 0 and UNR_Control = 0 and OrderNotFinish_Control = 0 and Piece_Control = 0 and TOCreateItem > 0
            --and OverallPickingStatus = 'C'
            and OverallGMStatus = 'A'
            AND ShipmentNo <> ''
            AND ShipmentNo NOT IN (
                SELECT ShipmentNo
                FROM TBL_ZAVGR043_Prod
                );`, function (err, rows) {
                if (err) {
                    console.log(err.message)
                }
                console.log('insert new data to TBL_ZAVGR043_Prod')
            })
        })

        db.serialize(function () {
            db.exec(`-- Update Team name to TBL_ZAVGR043_Prod
            update TBL_ZAVGR043_Prod
            set Team_Name = t."Name"
            from (
                select * from TBL_TeamName
            ) t
            where TBL_ZAVGR043_Prod.Shpt = t.Shpt
            and TBL_ZAVGR043_Prod.Team_Name is NULL;`, function (err, rows) {
                if (err) {
                    console.log(err.message)
                }
                console.log('Update Team name to TBL_ZAVGR043_Prod 1st')
            })
        })
        db.serialize(function () {
            db.exec(`-- Update Team name to TBL_ZAVGR043_Prod
            update TBL_ZAVGR043_Prod
            set Team_Name = case when Shpt like '5%' and DP = 1 and SHPCondition = 1 then 'Super Downs'
            when Shpt like '5%' and DP in (1, 3) and SHPCondition <> 1 then '54 Downs'
            when Shpt like '5%' and DP = 4 and Country = 'TW' and length(Ordes) > 0  then '54 TPM-SO'
            when Shpt like '5%' and DP = 4 and Country = 'TW' and length(Ordes) = 0  then '54 TPM'
            when Shpt like '5%' and DP = 4 and Country <> 'TW' and length(Ordes) > 0  then '54 Non-Downs SO'
            when Shpt like '5%' and DP = 4 and Country <> 'TW' and length(Ordes) = 0  then '54 Non-Downs'
            when Shpt like '8%' and DP in (1, 3) then '89 Downs' 
            when Shpt like '8%' and DP = 4 and Country = 'TW' and length(Ordes) > 0  then '89 TPM-SO'
            when Shpt like '8%' and DP = 4 and Country = 'TW' and length(Ordes) = 0  then '89 TPM'
            else null end
            where TBL_ZAVGR043_Prod.Team_Name is NULL;`, function (err, rows) {
                if (err) {
                    console.log(err.message)
                }
                console.log('Update Team name to TBL_ZAVGR043_Prod 2nd')
            })
        })

        db.serialize(function () {
            db.run(`-- insert new data to HAWB_ShipmentData
            insert into HAWB_ShipmentData (Shpt, DP, SHPCondition, Delivery, Country, "Items", Ordes,  StorageLocation, ShipTo, ShipmentNo )
            select Shpt, DP,ShippingCondition, Delivery, Country, "#Items", Orde, StorageLocation, "Ship-To", ShipmentNo from ZAVGR043_Temp where dp in (1, 3) and CN_Ctrl_Parts = 0 and HAZ_Control = 0 and W_Parts_Control = 0 and UNR_Control = 0 and OrderNotFinish_Control = 0 and Piece_Control = 0 and TOCreateItem > 0
            --and OverallPickingStatus = 'C'
            and OverallGMStatus = 'A' and ShipmentNo <>'' and Shpt like '5%' and Country not in ('TW') and  ShipmentNo not in (select ShipmentNo from Order_ShipmentData_Downs);`, function (err, rows) {
                if (err) {
                    console.log(err.message)
                }
                console.log('insert new data to HAWB_ShipmentData 1')
            })

            db.run(`-- insert new data to HAWB_ShipmentData
            insert into HAWB_ShipmentData (Shpt, DP, SHPCondition, Delivery, Country, "Items", Ordes,  StorageLocation, ShipTo, ShipmentNo )
            select Shpt, DP,ShippingCondition, Delivery, Country, "#Items", Orde, StorageLocation, "Ship-To", ShipmentNo from ZAVGR043_Temp where dp in (4) and CN_Ctrl_Parts = 0 and HAZ_Control = 0 and W_Parts_Control = 0 and UNR_Control = 0 and OrderNotFinish_Control = 0 and Piece_Control = 0 and TOCreateItem > 0
            --and OverallPickingStatus = 'C'
            and OverallGMStatus = 'A' and ShipmentNo <>'' and Shpt like '5%' and Country not in ('TW') and  ShipmentNo not in (select ShipmentNo from Order_ShipmentData_Regular);`, function (err, rows) {
                if (err) {
                    console.log(err.message)
                }
                console.log('insert new data to HAWB_ShipmentData 1')
            })

            db.run(`-- insert new data to Order_ShipmentData_Downs
            insert into Order_ShipmentData_Downs (Shpt, DP, SHPCondition, Country, Ordes,  StorageLocation, ShipTo, ShipmentNo )
            select Shpt, DP,ShippingCondition, Country, Orde, StorageLocation, "Ship-To", ShipmentNo from ZAVGR043_Temp
            where dp in (1,3)  and CN_Ctrl_Parts = 0 and HAZ_Control = 0 and W_Parts_Control = 0 and UNR_Control = 0  and OrderNotFinish_Control = 0 and Piece_Control = 0 and TOCreateItem > 0 
            --and OverallPickingStatus = 'C'
            and OverallGMStatus = 'A' and  ShipmentNo <>''  and Shpt like '5%' and ShipmentNo not in (select ShipmentNo from Order_ShipmentData_Downs) 
            group by Shpt, DP,ShippingCondition, Country, Orde, StorageLocation, "Ship-To", ShipmentNo ;`, function (err, rows) {
                if (err) {
                    console.log(err.message)
                }
                console.log('insert new data to HAWB_ShipmentData 2')
            })

            db.run(`-- insert new data to Order_ShipmentData_Regular
            insert into Order_ShipmentData_Regular (Shpt, DP, SHPCondition, Country, Ordes,  StorageLocation, ShipTo, ShipmentNo )
            select Shpt, DP,ShippingCondition, Country, Orde, StorageLocation, "Ship-To", ShipmentNo from ZAVGR043_Temp  
            where dp in (4) and CN_Ctrl_Parts = 0 and HAZ_Control = 0 and W_Parts_Control = 0 and UNR_Control = 0 and OrderNotFinish_Control = 0 and Piece_Control = 0 and TOCreateItem > 0 
            --and OverallPickingStatus = 'C'
            and OverallGMStatus = 'A' and  ShipmentNo <>''  and Shpt like '5%' and Country not in ('TW') and ShipmentNo not in (select ShipmentNo from Order_ShipmentData_Regular) 
            group by Shpt, DP,ShippingCondition, Country, Orde, StorageLocation, "Ship-To", ShipmentNo ;`, function (err, rows) {
                if (err) {
                    console.log(err.message)
                }
                console.log('insert new data to HAWB_ShipmentData 3')
            })

            db.run(`-- insert new data to Order_ShipmentData_RegularTW
            insert into Order_ShipmentData_RegularTW (Shpt, DP, SHPCondition, Country, Ordes,  StorageLocation, ShipTo, ShipmentNo )
            select Shpt, DP,ShippingCondition, Country, Orde, StorageLocation, "Ship-To", ShipmentNo from ZAVGR043_Temp 
            where dp in (4)  and CN_Ctrl_Parts = 0 and HAZ_Control = 0 and W_Parts_Control = 0 and UNR_Control = 0 and OrderNotFinish_Control = 0 and Piece_Control = 0 and TOCreateItem > 0 
            --and OverallPickingStatus = 'C'
            and OverallGMStatus = 'A' and  ShipmentNo <>''  and Shpt like '5%' and Country in ('TW') and ShipmentNo not in (select ShipmentNo from Order_ShipmentData_RegularTW) 
            group by Shpt, DP,ShippingCondition, Country, Orde, StorageLocation, "Ship-To", ShipmentNo ;`, function (err, rows) {
                if (err) {
                    console.log(err.message)
                }
                console.log('insert new data to HAWB_ShipmentData 4')
            })

            db.run(`-- Order_ShipmentData_AMT_Downs
            insert into Order_ShipmentData_AMT_Downs (Shpt, DP, SHPCondition, Country, Ordes,  StorageLocation, ShipTo, ShipmentNo )
            select Shpt, DP,ShippingCondition, Country, Orde, StorageLocation, "Ship-To", ShipmentNo from ZAVGR043_Temp 
            where dp in (1, 3) and CN_Ctrl_Parts = 0 and HAZ_Control = 0 and W_Parts_Control = 0 and UNR_Control = 0 and OrderNotFinish_Control = 0 and Piece_Control = 0 and TOCreateItem > 0 
            --and OverallPickingStatus = 'C'
            and OverallGMStatus = 'A' and  ShipmentNo <>''  and Shpt not like '5%' and ShipmentNo not in (select ShipmentNo from Order_ShipmentData_AMT_Downs) 
            group by Shpt, DP,ShippingCondition, Country, Orde, StorageLocation, "Ship-To", ShipmentNo ;`, function (err, rows) {
                if (err) {
                    console.log(err.message)
                }
                console.log('insert new data to HAWB_ShipmentData 5')
            })

            db.run(`-- insert new data to Order_ShipmentData_AMT
            insert into Order_ShipmentData_AMT (Shpt, DP, SHPCondition, Country, Ordes,  StorageLocation, ShipTo, ShipmentNo )
            select Shpt, DP,ShippingCondition, Country, Orde, StorageLocation, "Ship-To", ShipmentNo from ZAVGR043_Temp 
            where dp in (4) and CN_Ctrl_Parts = 0 and HAZ_Control = 0 and W_Parts_Control = 0 and UNR_Control = 0 and OrderNotFinish_Control = 0 and Piece_Control = 0 and TOCreateItem > 0 
            --and OverallPickingStatus = 'C'
            and OverallGMStatus = 'A' and  ShipmentNo <>''  and Shpt not like '5%' and ShipmentNo not in (select ShipmentNo from Order_ShipmentData_AMT) 
            group by Shpt, DP,ShippingCondition, Country, Orde, StorageLocation, "Ship-To", ShipmentNo ;`, function (err, rows) {
                if (err) {
                    console.log(err.message)
                }
                console.log('insert new data to HAWB_ShipmentData 6')
            })
        })

        db.serialize(function () {
            db.exec(`-- remvoe TXG and TNN from Order_ShipmentData_AMT
            delete from Order_ShipmentData_AMT
            where ShipmentNo in (select ShipmentNo from TBL_ZAVGR043_Prod where Team_Name in ('FSL - TXG', 'FSL - TNN', 'TKM'));
            
            -- remvoe TXG and TNN from Order_ShipmentData_AMT_Downs
            delete from Order_ShipmentData_AMT_Downs
            where ShipmentNo in (select ShipmentNo from TBL_ZAVGR043_Prod where Team_Name in ('FSL - TXG', 'FSL - TNN', 'TKM'));
            
            -- Update ID to HAWB_ShipmentData
            update HAWB_ShipmentData
            set Country_Id = (select AutoId from HAWB_Country where HAWB_Country.Country = HAWB_ShipmentData.Country)
            ,Shpt_Id = (select autoid from HAWB_ShptPoint where HAWB_ShptPoint.Shpt_Point = HAWB_ShipmentData.Shpt)
            ,Shipto_Id = (select autoid from HAWB_ShipTo where HAWB_ShipTo.ShipTo = HAWB_ShipmentData.ShipTo)
            ,SHPCondition_id =  (select autoid from HAWB_ShptCondition where HAWB_ShptCondition.Shpt_Condition = HAWB_ShipmentData.SHPCondition)
            , Confirm = 1
            where Confirm = 0;`, function (err, rows) {
                if (err) {
                    console.log(err.message)
                }
                console.log('remvoe TXG and TNN from Order_ShipmentData_AMT')
            })
        })

        db.serialize(function () {
            db.exec(`-- plant
                update Order_ShipmentData_Downs
                set plant = case when Shpt like '5%' then '54' else null end
                where plant is null;
                
                update Order_ShipmentData_Regular
                set plant = case when Shpt like '5%' then '54' else null end
                where plant is null;
                
                update Order_ShipmentData_AMT
                set plant = case when Shpt not like '5%' then '89' else null end
                where plant is null;
                
                `, function (err, rows) {
                if (err) {
                    console.log(err.message)
                }
                console.log('Update plant')
            })

            db.exec(`-- Update Bond / non-Bonded
                Update Order_ShipmentData_Downs
                set Bonded =  t.Bonded
                ,NonBonded = t.NonBonded
                ,TotalItem = t.total
                from (
                select 
                
                count(case when TBL_LT22_Prod.Source_Typ <> 'UNR' and TBL_LT22_Prod.Source_Typ like '%N%' then 'NB'  end ) as NonBonded 
                ,count(case when TBL_LT22_Prod.Source_Typ = 'UNR' or TBL_LT22_Prod.Source_Typ not like '%N%' then 'B'  end ) as Bonded 
                ,count(TBL_LT22_Prod.Material) as total
                
                , TBL_ZAVGR043_Prod.ShipmentNo
                from TBL_ZAVGR043_Prod inner join TBL_LT22_Prod
                on TBL_ZAVGR043_Prod.Delivery = TBL_LT22_Prod.Dest_Bin
                where TBL_ZAVGR043_Prod.ShipmentNo <> '' and TBL_LT22_Prod.Source_Typ not in ('922')
                and TBL_ZAVGR043_Prod.WaveGrpNo not like '200%'
                group by  TBL_ZAVGR043_Prod.ShipmentNo ) as t
                where Order_ShipmentData_Downs.ShipmentNo = t.ShipmentNo
                and Order_ShipmentData_Downs.Bonded + Order_ShipmentData_Downs.NonBonded = 0;
                
                Update Order_ShipmentData_AMT
                set Bonded =  t.Bonded
                ,NonBonded = t.NonBonded
                ,TotalItem = t.total
                from (
                select 
                
                count(case when TBL_LT22_Prod.Source_Typ <> 'UNR' and TBL_LT22_Prod.Source_Typ like '%N%' then 'NB'  end ) as NonBonded 
                ,count(case when TBL_LT22_Prod.Source_Typ = 'UNR' or TBL_LT22_Prod.Source_Typ not like '%N%' then 'B'  end ) as Bonded 
                ,count(TBL_LT22_Prod.Material) as total
                
                , TBL_ZAVGR043_Prod.ShipmentNo
                from TBL_ZAVGR043_Prod inner join TBL_LT22_Prod
                on TBL_ZAVGR043_Prod.Delivery = TBL_LT22_Prod.Dest_Bin
                where TBL_ZAVGR043_Prod.ShipmentNo <> '' and TBL_LT22_Prod.Source_Typ not in ('922')
                and TBL_ZAVGR043_Prod.WaveGrpNo not like '200%'
                group by  TBL_ZAVGR043_Prod.ShipmentNo ) as t
                where Order_ShipmentData_AMT.ShipmentNo = t.ShipmentNo
                and Order_ShipmentData_AMT.Bonded + Order_ShipmentData_AMT.NonBonded = 0;
                
                Update Order_ShipmentData_AMT_Downs
                set Bonded =  t.Bonded
                ,NonBonded = t.NonBonded
                ,TotalItem = t.total
                from (
                select 
                
                count(case when TBL_LT22_Prod.Source_Typ <> 'UNR' and TBL_LT22_Prod.Source_Typ like '%N%' then 'NB'  end ) as NonBonded 
                ,count(case when TBL_LT22_Prod.Source_Typ = 'UNR' or TBL_LT22_Prod.Source_Typ not like '%N%' then 'B'  end ) as Bonded 
                ,count(TBL_LT22_Prod.Material) as total
                
                , TBL_ZAVGR043_Prod.ShipmentNo
                from TBL_ZAVGR043_Prod inner join TBL_LT22_Prod
                on TBL_ZAVGR043_Prod.Delivery = TBL_LT22_Prod.Dest_Bin
                where TBL_ZAVGR043_Prod.ShipmentNo <> '' and TBL_LT22_Prod.Source_Typ not in ('922')
                and TBL_ZAVGR043_Prod.WaveGrpNo not like '200%'
                group by  TBL_ZAVGR043_Prod.ShipmentNo ) as t
                where Order_ShipmentData_AMT_Downs.ShipmentNo = t.ShipmentNo
                and Order_ShipmentData_AMT_Downs.Bonded + Order_ShipmentData_AMT_Downs.NonBonded = 0;
                
                Update Order_ShipmentData_Regular
                set Bonded =  t.Bonded
                ,NonBonded = t.NonBonded
                ,TotalItem = t.total
                from (
                select 
                
                count(case when TBL_LT22_Prod.Source_Typ <> 'UNR' and TBL_LT22_Prod.Source_Typ like '%N%' then 'NB'  end ) as NonBonded 
                ,count(case when TBL_LT22_Prod.Source_Typ = 'UNR' or TBL_LT22_Prod.Source_Typ not like '%N%' then 'B'  end ) as Bonded 
                ,count(TBL_LT22_Prod.Material) as total
                
                , TBL_ZAVGR043_Prod.ShipmentNo
                from TBL_ZAVGR043_Prod inner join TBL_LT22_Prod
                on TBL_ZAVGR043_Prod.Delivery = TBL_LT22_Prod.Dest_Bin
                where TBL_ZAVGR043_Prod.ShipmentNo <> '' and TBL_LT22_Prod.Source_Typ not in ('922')
                and TBL_ZAVGR043_Prod.WaveGrpNo not like '200%'
                group by  TBL_ZAVGR043_Prod.ShipmentNo ) as t
                where Order_ShipmentData_Regular.ShipmentNo = t.ShipmentNo
                and Order_ShipmentData_Regular.Bonded + Order_ShipmentData_Regular.NonBonded = 0;
                
                Update Order_ShipmentData_RegularTW
                set Bonded =  t.Bonded
                ,NonBonded = t.NonBonded
                ,TotalItem = t.total
                from (
                select 
                
                count(case when TBL_LT22_Prod.Source_Typ <> 'UNR' and TBL_LT22_Prod.Source_Typ like '%N%' then 'NB'  end ) as NonBonded 
                ,count(case when TBL_LT22_Prod.Source_Typ = 'UNR' or TBL_LT22_Prod.Source_Typ not like '%N%' then 'B'  end ) as Bonded 
                ,count(TBL_LT22_Prod.Material) as total
                
                , TBL_ZAVGR043_Prod.ShipmentNo
                from TBL_ZAVGR043_Prod inner join TBL_LT22_Prod
                on TBL_ZAVGR043_Prod.Delivery = TBL_LT22_Prod.Dest_Bin
                where TBL_ZAVGR043_Prod.ShipmentNo <> '' and TBL_LT22_Prod.Source_Typ not in ('922')
                and TBL_ZAVGR043_Prod.WaveGrpNo not like '200%'
                group by  TBL_ZAVGR043_Prod.ShipmentNo ) as t
                where Order_ShipmentData_RegularTW.ShipmentNo = t.ShipmentNo
                and Order_ShipmentData_RegularTW.Bonded + Order_ShipmentData_RegularTW.NonBonded = 0;
                
                Update Order_ShipmentData_Downs
                set Bonded =  tt.Bonded
                ,NonBonded = tt.NonBonded
                ,TotalItem = tt.total
                from (
                select  NonBonded, Bonded , "total", Dest_Bin, TBL_ZAVGR043_Prod.ShipmentNo, TBL_ZAVGR043_Prod.WaveGrpNo from (
                select 
                count(case when TBL_LT22_Prod.Source_Typ <> 'UNR' and TBL_LT22_Prod.Source_Typ like '%N%' then 'NB'  end )  as NonBonded
                ,count(case when TBL_LT22_Prod.Source_Typ = 'UNR' or TBL_LT22_Prod.Source_Typ not like '%N%' then 'B'  end ) as Bonded 
                ,count(TBL_LT22_Prod.Material) as total
                , TBL_LT22_Prod.Dest_Bin
                from TBL_LT22_Prod
                group by TBL_LT22_Prod.Dest_Bin
                ) as t inner join TBL_ZAVGR043_Prod
                on t.Dest_Bin = TBL_ZAVGR043_Prod.WaveGrpNo
                ) as tt
                where Order_ShipmentData_Downs.ShipmentNo = tt.ShipmentNo
                and Order_ShipmentData_Downs.Bonded + Order_ShipmentData_Downs.NonBonded = 0;
                
                Update Order_ShipmentData_AMT
                set Bonded =  tt.Bonded
                ,NonBonded = tt.NonBonded
                ,TotalItem = tt.total
                from (
                select  NonBonded, Bonded , "total", Dest_Bin, TBL_ZAVGR043_Prod.ShipmentNo, TBL_ZAVGR043_Prod.WaveGrpNo from (
                select 
                count(case when TBL_LT22_Prod.Source_Typ <> 'UNR' and TBL_LT22_Prod.Source_Typ like '%N%' then 'NB'  end )  as NonBonded
                ,count(case when TBL_LT22_Prod.Source_Typ = 'UNR' or TBL_LT22_Prod.Source_Typ not like '%N%' then 'B'  end ) as Bonded 
                ,count(TBL_LT22_Prod.Material) as total
                , TBL_LT22_Prod.Dest_Bin
                from TBL_LT22_Prod
                group by TBL_LT22_Prod.Dest_Bin
                ) as t inner join TBL_ZAVGR043_Prod
                on t.Dest_Bin = TBL_ZAVGR043_Prod.WaveGrpNo
                ) as tt
                where Order_ShipmentData_AMT.ShipmentNo = tt.ShipmentNo
                and Order_ShipmentData_AMT.Bonded + Order_ShipmentData_AMT.NonBonded = 0;
                
                Update Order_ShipmentData_AMT_Downs
                set Bonded =  tt.Bonded
                ,NonBonded = tt.NonBonded
                ,TotalItem = tt.total
                from (
                select  NonBonded, Bonded , "total", Dest_Bin, TBL_ZAVGR043_Prod.ShipmentNo, TBL_ZAVGR043_Prod.WaveGrpNo from (
                select 
                count(case when TBL_LT22_Prod.Source_Typ <> 'UNR' and TBL_LT22_Prod.Source_Typ like '%N%' then 'NB'  end )  as NonBonded
                ,count(case when TBL_LT22_Prod.Source_Typ = 'UNR' or TBL_LT22_Prod.Source_Typ not like '%N%' then 'B'  end ) as Bonded 
                ,count(TBL_LT22_Prod.Material) as total
                , TBL_LT22_Prod.Dest_Bin
                from TBL_LT22_Prod
                group by TBL_LT22_Prod.Dest_Bin
                ) as t inner join TBL_ZAVGR043_Prod
                on t.Dest_Bin = TBL_ZAVGR043_Prod.WaveGrpNo
                ) as tt
                where Order_ShipmentData_AMT_Downs.ShipmentNo = tt.ShipmentNo
                and Order_ShipmentData_AMT_Downs.Bonded + Order_ShipmentData_AMT_Downs.NonBonded = 0;
                
                Update Order_ShipmentData_Regular
                set Bonded =  tt.Bonded
                ,NonBonded = tt.NonBonded
                ,TotalItem = tt.total
                from (
                select  NonBonded, Bonded , "total", Dest_Bin, TBL_ZAVGR043_Prod.ShipmentNo, TBL_ZAVGR043_Prod.WaveGrpNo from (
                select 
                count(case when TBL_LT22_Prod.Source_Typ <> 'UNR' and TBL_LT22_Prod.Source_Typ like '%N%' then 'NB'  end )  as NonBonded
                ,count(case when TBL_LT22_Prod.Source_Typ = 'UNR' or TBL_LT22_Prod.Source_Typ not like '%N%' then 'B'  end ) as Bonded 
                ,count(TBL_LT22_Prod.Material) as total
                , TBL_LT22_Prod.Dest_Bin
                from TBL_LT22_Prod
                group by TBL_LT22_Prod.Dest_Bin
                ) as t inner join TBL_ZAVGR043_Prod
                on t.Dest_Bin = TBL_ZAVGR043_Prod.WaveGrpNo
                ) as tt
                where Order_ShipmentData_Regular.ShipmentNo = tt.ShipmentNo
                and Order_ShipmentData_Regular.Bonded + Order_ShipmentData_Regular.NonBonded = 0;
                
                Update Order_ShipmentData_RegularTW
                set Bonded =  tt.Bonded
                ,NonBonded = tt.NonBonded
                ,TotalItem = tt.total
                from (
                select  NonBonded, Bonded , "total", Dest_Bin, TBL_ZAVGR043_Prod.ShipmentNo, TBL_ZAVGR043_Prod.WaveGrpNo from (
                select 
                count(case when TBL_LT22_Prod.Source_Typ <> 'UNR' and TBL_LT22_Prod.Source_Typ like '%N%' then 'NB'  end )  as NonBonded
                ,count(case when TBL_LT22_Prod.Source_Typ = 'UNR' or TBL_LT22_Prod.Source_Typ not like '%N%' then 'B'  end ) as Bonded 
                ,count(TBL_LT22_Prod.Material) as total
                , TBL_LT22_Prod.Dest_Bin
                from TBL_LT22_Prod
                group by TBL_LT22_Prod.Dest_Bin
                ) as t inner join TBL_ZAVGR043_Prod
                on t.Dest_Bin = TBL_ZAVGR043_Prod.WaveGrpNo
                ) as tt
                where Order_ShipmentData_RegularTW.ShipmentNo = tt.ShipmentNo
                and Order_ShipmentData_RegularTW.Bonded + Order_ShipmentData_RegularTW.NonBonded = 0;
                
                update TBL_ZAVGR043_Prod
                set Customer_Name = t.Name
                , Customer_Feb = t.Feb
                , Location = t.AirPort_Code
                , pkg_description = t."Remark"
                , Dimensions_Set = t.Dimensions_Set
                , Weight_Set = t.Weight_Set
                , OutboundSet_set = t.OutboundSet_set
                , COO_Set = t.COO_Set
                , PackingRequest_Set = t.PackingRequest_Set
                , Attention_Set = t.Attention_Set
                , BooingNotice_Set = t.BooingNotice_Set
                from (
                    select * from Local_CustomerShipto
                ) t
                where TBL_ZAVGR043_Prod.ShipTo = t.Shipto;
                
                update TBL_ZAVGR043_Prod
                set Shpt_Remark = t."Remark"
                from ( SELECT * from Shpt_Remark ) t
                where TBL_ZAVGR043_Prod.Shpt = t.Shpt`, function (err, rows) {
                if (err) {
                    console.log(err.message)
                }
                console.log('Update Bonded / N-Bonded')
            })
        })

        db.serialize(function () {
            db.exec(`update HAWB_ShipmentData
            set BNB_Control = 1
            from (
                select a.ShipmentNo from HAWB_ShipmentData a inner join Order_ShipmentData_Downs b
                on a.ShipmentNo = b.ShipmentNo
                WHERE b.Bonded > 0 and b.NonBonded > 0
            ) t
            where HAWB_ShipmentData.ShipmentNo = t.ShipmentNo;`, function (err, rows) {
                if (err) {
                    console.log(err.message)
                }
                console.log('Update BNB_Control')
            })
        })

        db.serialize(function () {
            db.exec(`-- Update Transfer Order confirm date/time
                update TBL_ZAVGR043_Prod
                set TO_ConfirmDate = case when t.Conf_date = '' then NULL else t.Conf_date end
                ,TO_ConfirmTime = case when t.Conf_time = '00:00:00' then NULL else t.Conf_time end
                from (
                    select * from TBL_LT22_Prod
                ) as t
                where TBL_ZAVGR043_Prod.Delivery = t.Dest_Bin
                and TBL_ZAVGR043_Prod.TO_ConfirmDate is null;
                
                
                Update TBL_ZAVGR043_Prod
                set CN_Ctrl_Parts = 1
                from (
                    select ShipmentNo from TBL_ZAVGR043_Prod
                where Delivery in (select Dest_Bin from TBL_LT22_Prod where TBL_LT22_Prod.CN_Ctrl_Parts = 1  )
                group by ShipmentNo
                ) as t
                where TBL_ZAVGR043_Prod.ShipmentNo = t.ShipmentNo;

                Update TBL_ZAVGR043_Prod
                set W_Parts_Control = 1
                from (
                    select ShipmentNo from TBL_ZAVGR043_Prod
                where Delivery in (select Dest_Bin from TBL_LT22_Prod where TBL_LT22_Prod.W_Parts_Control = 1  )
                group by ShipmentNo
                ) as t
                where TBL_ZAVGR043_Prod.ShipmentNo = t.ShipmentNo;

                Update TBL_ZAVGR043_Prod
                set UNR_Control = 1
                from (
                    select ShipmentNo from TBL_ZAVGR043_Prod
                where Delivery in (select Dest_Bin from TBL_LT22_Prod where TBL_LT22_Prod.UNR_Control = 1 )
                group by ShipmentNo
                ) as t
                where TBL_ZAVGR043_Prod.ShipmentNo = t.ShipmentNo;

                Update TBL_ZAVGR043_Prod
                set HAZ_Control = 1
                from (
                    select ShipmentNo from TBL_ZAVGR043_Prod
                where Delivery in (select Dest_Bin from TBL_LT22_Prod where TBL_LT22_Prod.HAZ_Control = 1  )
                group by ShipmentNo
                ) as t
                where TBL_ZAVGR043_Prod.ShipmentNo = t.ShipmentNo;
                ----
                Update TBL_ZAVGR043_Prod
                set CN_Ctrl_Parts = 1
                from (
                    select ShipmentNo from TBL_ZAVGR043_Prod
                where WaveGrpNo in (select Dest_Bin from TBL_LT22_Prod where TBL_LT22_Prod.CN_Ctrl_Parts = 1  )
                group by ShipmentNo
                ) as t
                where TBL_ZAVGR043_Prod.ShipmentNo = t.ShipmentNo;

                Update TBL_ZAVGR043_Prod
                set W_Parts_Control = 1
                from (
                    select ShipmentNo from TBL_ZAVGR043_Prod
                where WaveGrpNo in (select Dest_Bin from TBL_LT22_Prod where TBL_LT22_Prod.W_Parts_Control = 1  )
                group by ShipmentNo
                ) as t
                where TBL_ZAVGR043_Prod.ShipmentNo = t.ShipmentNo;

                Update TBL_ZAVGR043_Prod
                set UNR_Control = 1
                from (
                    select ShipmentNo from TBL_ZAVGR043_Prod
                where WaveGrpNo in (select Dest_Bin from TBL_LT22_Prod where TBL_LT22_Prod.UNR_Control = 1  )
                group by ShipmentNo
                ) as t
                where TBL_ZAVGR043_Prod.ShipmentNo = t.ShipmentNo;

                Update TBL_ZAVGR043_Prod
                set HAZ_Control = 1
                from (
                    select ShipmentNo from TBL_ZAVGR043_Prod
                where WaveGrpNo in (select Dest_Bin from TBL_LT22_Prod where TBL_LT22_Prod.HAZ_Control = 1  )
                group by ShipmentNo
                ) as t
                where TBL_ZAVGR043_Prod.ShipmentNo = t.ShipmentNo;`, function (err, rows) {
                if (err) {
                    console.log(err.message)
                }
                console.log('Update Transfer Order confirm date/time')
            })

            db.exec(`-- Update Vendor 
            UPDATE HAWB_ShipmentData
SET Vendor = tt.Forward
	,HAWB_Expand = tt.HAWB_Expand
	,confirmForward = 1
	,Cut_Time = tt.Cut_Time
	,Pickup_Time = tt.Pickup_Time
	,Cus_Import = tt.Cus_Import
FROM (
	select * from (
		SELECT AutoId
			,Country_Id
			,Condition_Id
			,Shpt_Id
			,Shipto_Id
			,Forward
			,HAWB_Expand
			,Cut_Time
			,Pickup_Time
			,Cus_Import
            ,BNB_Control
			,CASE 
				WHEN Mon = 1
					THEN '1'
				END AS Mons
			,CASE 
				WHEN Tue = 1
					THEN '2'
				END AS Tues
			,CASE 
				WHEN Wed = 1
					THEN '3'
				END AS Weds
			,CASE 
				WHEN Thu = 1
					THEN '4'
				END AS Thus
			,CASE 
				WHEN Fri = 1
					THEN '5'
				END AS Fris
			,CASE 
				WHEN Sat = 1
					THEN '6'
				END AS Sats
			,CASE 
				WHEN Sun = 1
					THEN '7'
				END AS Suns
		FROM HAWB_Rule
		) as t
		where instr(ifnull(t.Mons,0) || ',' || ifnull(t.Tues,0) || ',' || ifnull(t.Weds,0) || ',' || ifnull(t.Thus,0) || ',' || ifnull(t.Fris,0) || ',' || ifnull(t.Sats,0) || ',' || ifnull(t.Suns,0), strftime('%w', date('now'))) > 0
	) AS tt
    WHERE ifnull(HAWB_ShipmentData.Country_Id, 0) || '-' || ifnull(HAWB_ShipmentData.SHPCondition_id, 0) || '-' || ifnull(HAWB_ShipmentData.Shpt_Id, 0) || '-' || ifnull(HAWB_ShipmentData.Shipto_Id, 0) || '-' || ifnull(HAWB_ShipmentData.BNB_Control,0) = ifnull(tt.Country_Id, 0) || '-' || ifnull(tt.Condition_Id, 0) || '-' || ifnull(tt.Shpt_Id, 0) || '-' || ifnull(tt.Shipto_Id, 0) || '-' || ifnull(tt.BNB_Control,0)
	AND confirmForward = 0
	AND Vendor IS NULL;
                
        

            UPDATE HAWB_ShipmentData
        SET Vendor = tt.Forward
            ,HAWB_Expand = tt.HAWB_Expand
            ,confirmForward = 1
            ,Cut_Time = tt.Cut_Time
            ,Pickup_Time = tt.Pickup_Time
            ,Cus_Import = tt.Cus_Import
        FROM (
            select * from (
                SELECT AutoId
                    ,Country_Id
                    ,Condition_Id
                    ,Shpt_Id
                    ,Shipto_Id
                    ,Forward
                    ,HAWB_Expand
                    ,Cut_Time
                    ,Pickup_Time
                    ,Cus_Import
                    ,BNB_Control
                    ,CASE 
                        WHEN Mon = 1
                            THEN '1'
                        END AS Mons
                    ,CASE 
                        WHEN Tue = 1
                            THEN '2'
                        END AS Tues
                    ,CASE 
                        WHEN Wed = 1
                            THEN '3'
                        END AS Weds
                    ,CASE 
                        WHEN Thu = 1
                            THEN '4'
                        END AS Thus
                    ,CASE 
                        WHEN Fri = 1
                            THEN '5'
                        END AS Fris
                    ,CASE 
                        WHEN Sat = 1
                            THEN '6'
                        END AS Sats
                    ,CASE 
                        WHEN Sun = 1
                            THEN '7'
                        END AS Suns
                FROM HAWB_Rule
                ) as t
                where instr(ifnull(t.Mons,0) || ',' || ifnull(t.Tues,0) || ',' || ifnull(t.Weds,0) || ',' || ifnull(t.Thus,0) || ',' || ifnull(t.Fris,0) || ',' || ifnull(t.Sats,0) || ',' || ifnull(t.Suns,0), strftime('%w', date('now'))) > 0
            ) AS tt
        WHERE ifnull(HAWB_ShipmentData.Country_Id, 0) || '-' || ifnull(HAWB_ShipmentData.SHPCondition_id, 0) || '-' || 0 ||'-' || ifnull(HAWB_ShipmentData.Shipto_Id, 0) || '-' || ifnull(HAWB_ShipmentData.BNB_Control,0) = ifnull(tt.Country_Id, 0) || '-' || ifnull(tt.Condition_Id, 0) || '-'|| ifnull(tt.Shpt_Id, 0) || '-' || ifnull(tt.Shipto_Id, 0)  || '-' || ifnull(tt.BNB_Control,0)
            AND confirmForward = 0
            AND Vendor IS NULL;

            -- Update Vendor 
            UPDATE HAWB_ShipmentData
SET Vendor = tt.Forward
	,HAWB_Expand = tt.HAWB_Expand
	,confirmForward = 1
	,Cut_Time = tt.Cut_Time
	,Pickup_Time = tt.Pickup_Time
	,Cus_Import = tt.Cus_Import
FROM (
	select * from (
		SELECT AutoId
			,Country_Id
			,Condition_Id
			,Shpt_Id
			,Shipto_Id
			,Forward
			,HAWB_Expand
			,Cut_Time
			,Pickup_Time
			,Cus_Import
            ,BNB_Control
			,CASE 
				WHEN Mon = 1
					THEN '1'
				END AS Mons
			,CASE 
				WHEN Tue = 1
					THEN '2'
				END AS Tues
			,CASE 
				WHEN Wed = 1
					THEN '3'
				END AS Weds
			,CASE 
				WHEN Thu = 1
					THEN '4'
				END AS Thus
			,CASE 
				WHEN Fri = 1
					THEN '5'
				END AS Fris
			,CASE 
				WHEN Sat = 1
					THEN '6'
				END AS Sats
			,CASE 
				WHEN Sun = 1
					THEN '7'
				END AS Suns
		FROM HAWB_Rule
		) as t
		where instr(ifnull(t.Mons,0) || ',' || ifnull(t.Tues,0) || ',' || ifnull(t.Weds,0) || ',' || ifnull(t.Thus,0) || ',' || ifnull(t.Fris,0) || ',' || ifnull(t.Sats,0) || ',' || ifnull(t.Suns,0), strftime('%w', date('now'))) > 0
	) AS tt
    WHERE ifnull(HAWB_ShipmentData.Country_Id, 0) || '-' || ifnull(HAWB_ShipmentData.SHPCondition_id, 0) || '-' || ifnull(HAWB_ShipmentData.Shpt_Id, 0) || '-' || 0 || '-' || ifnull(HAWB_ShipmentData.BNB_Control,0) = ifnull(tt.Country_Id, 0) || '-' || ifnull(tt.Condition_Id, 0) || '-' || ifnull(tt.Shpt_Id, 0) || '-' || ifnull(tt.Shipto_Id, 0) || '-' || ifnull(tt.BNB_Control,0)
	AND confirmForward = 0
	AND Vendor IS NULL;


            UPDATE HAWB_ShipmentData
    SET Vendor = tt.Forward
        ,HAWB_Expand = tt.HAWB_Expand
        ,confirmForward = 1
        ,Cut_Time = tt.Cut_Time
        ,Pickup_Time = tt.Pickup_Time
        ,Cus_Import = tt.Cus_Import
    FROM (
        select * from (
            SELECT AutoId
                ,Country_Id
                ,Condition_Id
                ,Shpt_Id
                ,Shipto_Id
                ,Forward
                ,HAWB_Expand
                ,Cut_Time
                ,Pickup_Time
                ,Cus_Import
                ,BNB_Control
                ,CASE 
                    WHEN Mon = 1
                        THEN '1'
                    END AS Mons
                ,CASE 
                    WHEN Tue = 1
                        THEN '2'
                    END AS Tues
                ,CASE 
                    WHEN Wed = 1
                        THEN '3'
                    END AS Weds
                ,CASE 
                    WHEN Thu = 1
                        THEN '4'
                    END AS Thus
                ,CASE 
                    WHEN Fri = 1
                        THEN '5'
                    END AS Fris
                ,CASE 
                    WHEN Sat = 1
                        THEN '6'
                    END AS Sats
                ,CASE 
                    WHEN Sun = 1
                        THEN '7'
                    END AS Suns
            FROM HAWB_Rule
            ) as t
            where instr(ifnull(t.Mons,0) || ',' || ifnull(t.Tues,0) || ',' || ifnull(t.Weds,0) || ',' || ifnull(t.Thus,0) || ',' || ifnull(t.Fris,0) || ',' || ifnull(t.Sats,0) || ',' || ifnull(t.Suns,0), strftime('%w', date('now'))) > 0
        ) AS tt
    WHERE ifnull(HAWB_ShipmentData.SHPCondition_id, 0) || '-' || ifnull(HAWB_ShipmentData.Shpt_Id, 0) || '-' || 0 ||'-' || ifnull(HAWB_ShipmentData.BNB_Control,0) = ifnull(tt.Condition_Id, 0) || '-' || ifnull(tt.Shpt_Id, 0) || '-' || ifnull(tt.Shipto_Id, 0) || '-'  || ifnull(tt.BNB_Control,0)
        AND confirmForward = 0
        AND Vendor IS NULL;`, function (err, rows) {
                if (err) {
                    console.log(err.message)
                }
                console.log('Update Vendor ')
            })

            db.exec(`update HAWB_ShipmentData
            set R_CutTime = case when Cut_Time is null then strftime('%Y-%m-%d %H:%M',strftime('%Y-%m-%d %H:%M',datetime(ImportDateTime,'+10 hours')))
                when Cut_Time is not null and strftime('%Y-%m-%d %H:%M',datetime(ImportDateTime,'+8 hours')) < strftime('%Y-%m-%d %H:%M',strftime('%Y-%m-%d',strftime('%Y-%m-%d %H:%M',datetime(ImportDateTime,'+8 hours')))||' '||Cut_Time) 
                then strftime('%Y-%m-%d %H:%M',strftime('%Y-%m-%d',strftime('%Y-%m-%d %H:%M',datetime(ImportDateTime,'+8 hours')))||' '||Cut_Time) 
                ELSE strftime('%Y-%m-%d %H:%M',date(strftime('%Y-%m-%d',strftime('%Y-%m-%d %H:%M',datetime(ImportDateTime,'+8 hours'))),'+1 day')||' '||Cut_Time)
                end
            , R_PickupTime = case when Pickup_Time is not null and strftime('%Y-%m-%d %H:%M',datetime(ImportDateTime,'+8 hours')) < strftime('%Y-%m-%d %H:%M',strftime('%Y-%m-%d',strftime('%Y-%m-%d %H:%M',datetime(ImportDateTime,'+8 hours')))||' '||Cut_Time)
                then strftime('%Y-%m-%d %H:%M',strftime('%Y-%m-%d',strftime('%Y-%m-%d %H:%M',datetime(ImportDateTime,'+8 hours')))||' '||Pickup_Time)
                when Pickup_Time is null and Cus_Import is not null then strftime('%Y-%m-%d %H:%M',datetime(strftime('%Y-%m-%d %H:%M',datetime(ImportDateTime,'+8 hours'))), cus_import) 
                else strftime('%Y-%m-%d %H:%M',date(strftime('%Y-%m-%d',strftime('%Y-%m-%d %H:%M',datetime(ImportDateTime,'+8 hours'))),'+1 day')||' '||Pickup_Time)
                end
                
            where R_CutTime is NULL;`, function(err) {
                if (err) {
                    console.log(err.message)
                }
                console.log('Update Cut Time/ Pickup Time ')
            })

            db.exec(`-- reupdate plant

                update TBL_ZAVGR043_Prod
                set plant = t.plant
                from (
                    select * from TBL_Plant
                ) t
                where TBL_ZAVGR043_Prod.Shpt = t.Shpt and TBL_ZAVGR043_Prod.plant is null;

                update HAWB_ShipmentData
                set plant = t.plant
                from (
                    select * from TBL_Plant
                ) t
                where HAWB_ShipmentData.Shpt = t.Shpt and HAWB_ShipmentData.plant is null;
                
                update HAWB_ShipmentData
                set plant = case when Shpt like '5%' then '5400'
                when Shpt like '8%' then '5400'
                else NULL end 
                where plant is null; 
                
                update HAWB_ShipmentData
                set plant = 5400
                
                where plant like'54%' and plant not in ('5401','5402');
                
                update HAWB_ShipmentData
                set plant = 8900
                
                where plant like'89%' and plant not in ('8930','8960');
                

                update HAWB_ShipmentData
                set Duplicate_Control = 1
                from (
                    select * from HAWB_Route
                ) t
                where HAWB_ShipmentData.Country = t.Country
                and substr(HAWB_ShipmentData.ShipTo, 1, 2) = t.ShipTo
                and HAWB_ShipmentData.Vendor = 'CEVA'
                and HAWB_ShipmentData.SHPCondition <> 1
                `, function (err, rows) {
                if (err) {
                    console.log(err.message)
                }
                console.log('re-Update Plant ')
            })

            db.exec(`-- update Start_Woth from HAWB_Import_Check
                UPDATE HAWB_ShipmentData
                set Start_With = t.Start_With
                from (
                    select * from HAWB_Import_Check
                ) as t
                where HAWB_ShipmentData.Vendor = t.Vendor
                and HAWB_ShipmentData.DP = t.DP
                and HAWB_ShipmentData.SHPCondition = t.SHPCondition
                and HAWB_ShipmentData.plant = t.plant
                and HAWB_ShipmentData.Vendor is not null
                AND HAWB_ShipmentData.Start_With IS NULL;
                
                UPDATE HAWB_ShipmentData
                set Start_With = t.Start_With
                from (
                    select * from HAWB_Import_Check
                ) as t
                where HAWB_ShipmentData.Vendor = t.Vendor
                and HAWB_ShipmentData.DP = t.DP
                and t.SHPCondition is null
                and HAWB_ShipmentData.plant = t.plant
                and HAWB_ShipmentData.Vendor is not null
                AND HAWB_ShipmentData.Start_With IS NULL;`, function (err, rows) {
                if (err) {
                    console.log(err.message)
                }
                console.log('update Start_Woth from HAWB_Import_Check')
            })

           

            db.exec(`
            

            -- assign tracking by singal
            delete from TempRuleAssign;
            WITH RECURSIVE
            cnt( ImportDateTime,  ShipmentNo, shipto, Vendor , Cut_Time, DP, SHPCondition, Start_With )  AS 
            ( select  ImportDateTime,  ShipmentNo, shipto, Vendor , Cut_Time, max(DP), max(SHPCondition), Start_With  from HAWB_ShipmentData where HAWB_Expand = 0 and Duplicate_Control = 0 and M_HAWB is null group by ImportDateTime,  ShipmentNo, shipto, Vendor , Cut_Time , Start_With order by ImportDateTime )
            insert into TempRuleAssign ( ImportDateTime,  ShipmentNo, shipto, Vendor , Cut_Time, DP, SHPCondition, Start_With )  select  ImportDateTime,  ShipmentNo, shipto, Vendor , Cut_Time, DP, SHPCondition, Start_With  from cnt;

            -- assign tracking by expand
            delete from TempRuleRunTime;
            delete from TempRuleAssignExpand;
            insert into TempRuleAssignExpand ( AutoId, ImportDateTime,  ShipmentNo, shipto, Vendor , Cut_Time, DP, SHPCondition, Start_With ) 
            select MAX(AutoId), ImportDateTime,  ShipmentNo, shipto, Vendor, R_CutTime , DP, SHPCondition, Start_With
            from HAWB_ShipmentData where HAWB_Expand = 1 and length(ShipmentNo) = 8 and Duplicate_Control = 0 
            group by ImportDateTime,  ShipmentNo, shipto, Vendor, R_CutTime , DP, SHPCondition, Start_With
            order by  MAX(AutoId), ShipTo ;
            
            --assign duplicate tracking
            delete from TempRuleAssignDup;
            WITH RECURSIVE
            cnt( AutoId, ImportDateTime,  ShipmentNo, shipto, Vendor , Cut_Time, DP, SHPCondition, Start_With, R_PickupTime ) AS ( select AutoId, ImportDateTime,  ShipmentNo, shipto, Vendor, R_CutTime , DP, SHPCondition, Start_With, R_PickupTime from HAWB_ShipmentData where  Duplicate_Control = 1 and R_PickupTime is not null order by ImportDateTime, AutoId )
            insert into TempRuleAssignDup (AutoId, ImportDateTime,  ShipmentNo, shipto, Vendor , Cut_Time, DP, SHPCondition, Start_With, R_PickupTime) select AutoId, ImportDateTime,  ShipmentNo, shipto, Vendor , Cut_Time, DP, SHPCondition, Start_With, R_PickupTime  from cnt;

            --assign duplicate tracking for regular
            delete from TempRuleAssignDup;
            WITH RECURSIVE
            cnt( AutoId, ImportDateTime,  ShipmentNo, shipto, Vendor , Cut_Time, DP, SHPCondition, Start_With, R_PickupTime ) AS ( select AutoId, ImportDateTime,  ShipmentNo, shipto, Vendor, R_CutTime , DP, SHPCondition, Start_With, R_PickupTime from HAWB_ShipmentData where  Duplicate_Control = 1 and R_PickupTime is null and date(ImportDateTime) = date('now') order by ImportDateTime, AutoId )
            insert into TempRuleAssignDup (AutoId, ImportDateTime,  ShipmentNo, shipto, Vendor , Cut_Time, DP, SHPCondition, Start_With, R_PickupTime) select AutoId, ImportDateTime,  ShipmentNo, shipto, Vendor , Cut_Time, DP, SHPCondition, Start_With, R_PickupTime  from cnt;
            
                                    
            
            `, function (err, rows) {
                if (err) {
                    console.log(err.message)
                }
                console.log('assign tracking')
            }) 

            //delete from audit;
            db.exec(`delete from audit`, function (err, rows) {
                if (err) {
                    console.log(err.message)
                }
            })

            db.exec(`UPDATE TBL_ZAVGR043_Prod
                set CreateOn = replace(CreateOn, '/','-')
                ,ShipmentCreateDate = replace(ShipmentCreateDate, '/','-')
                ,EntryDate = replace(EntryDate,'/','-')
                ,TO_ConfirmDate = replace(TO_ConfirmDate,'/','-')
                ,TO_CreateDate = replace(TO_CreateDate,'/','-');
                
                update TBL_ZAVGR043_Prod
                set KPI_Hour = t.Service
                , KPI_Ctrl = 1
                , WithoutHolday = t.WithoutHolday
                , CountryContro = t.CountryContro
                from ( select * from service_KPI ) as t
                where case when TBL_ZAVGR043_Prod.Shpt like '5%' then '54'
                when  TBL_ZAVGR043_Prod.Shpt like '8%' then '89'
                when TBL_ZAVGR043_Prod.Shpt = '317' then '89'
                else null end = t.plant
                and TBL_ZAVGR043_Prod.DP = t.DP
                --and ifnull(TBL_ZAVGR043_Prod.SHPCondition,0) = ifnull(t.Condition,0)
                and TBL_ZAVGR043_Prod.KPI_Ctrl = 0;


                
                update TBL_ZAVGR043_Prod
                set Service_Start = datetime(ShipmentCreateDate ||' '|| ShipmentCreateTime, (select'+'||TimeZoneValues||' Hours'))
                , start_Week_Day = case when strftime('%w',datetime(ShipmentCreateDate ||' '|| ShipmentCreateTime, (select'+'||TimeZoneValues||' Hours'))) = '0' then '7' else strftime('%w',datetime(ShipmentCreateDate ||' '|| ShipmentCreateTime, (select'+'||TimeZoneValues||' Hours'))) end
                where Service_Start is null;

                UPDATE TBL_ZAVGR043_Prod
                set Service_End = datetime(Service_Start, (select'+'||KPI_Hour||' Hours'))
                , end_Week_Day = case when strftime('%w',datetime(Service_Start, (select'+'||KPI_Hour||' Hours'))) = '0' then '7' else strftime('%w',datetime(Service_Start, (select'+'||KPI_Hour||' Hours'))) end
                where Service_End is null;
                
                
                update TBL_ZAVGR043_Prod
                set diff_work_Day = case WHEN start_Week_Day = '4' then '4'
                WHEN start_Week_Day = '5' then '3'
                WHEN start_Week_Day = '6' then '2'
                WHEN start_Week_Day = '7' then '1'
                else end_Week_Day - start_Week_Day end
                , kpi_work_day = KPI_Hour / 8
                where diff_work_Day is NULL;
                
                update TBL_ZAVGR043_Prod
                set Service_Start = case when datetime(ShipmentCreateDate ||' '|| ShipmentCreateTime, (select'+'||TimeZoneValues||' Hours')) < datetime(date(datetime(ShipmentCreateDate ||' '|| ShipmentCreateTime, (select'+'||TimeZoneValues||' Hours')))||' '||'09:00')
                then datetime(date(datetime(ShipmentCreateDate ||' '|| ShipmentCreateTime, (select'+'||TimeZoneValues||' Hours')))||' '||'09:00')
                when datetime(ShipmentCreateDate ||' '|| ShipmentCreateTime, (select'+'||TimeZoneValues||' Hours')) > datetime(date(datetime(ShipmentCreateDate ||' '|| ShipmentCreateTime, (select'+'||TimeZoneValues||' Hours')))||' '||'18:00')
                then datetime(datetime(ShipmentCreateDate ||' '|| ShipmentCreateTime, (select'+'||TimeZoneValues||' Hours')), (select'+'||diff_work_Day||' day'))
                else  datetime(ShipmentCreateDate ||' '|| ShipmentCreateTime, (select'+'||TimeZoneValues||' Hours')) end
                , Serverice_Ctrl = 1
                WHERE plant like '89%' and Serverice_Ctrl = 0
               

                
                `, function (err, rows) {
                if (err) {
                    console.log(err.message)
                }
                console.log('update services level')

                
            })
            db.exec(`update TBL_ZAVGR043_Prod
            set Country = 'TW'
            Where Shipto = '4060'
            and Ship_Customer_City in ('ZhuBei City','Tainan','Kaohsiung City');
            
            
            update HAWB_Primary
            set "check" = 0
            ,HAWB_Count = 0
            ,HAWB_Count_Control = 0
            , HAWB_Count_date = NULL
            ,Shipto = NULL
            ,DP = null
            ,SHPCondition = null
            ,Country = null
            ,Duplicate_Control = 0
            ,R_PickupTime = null
            from (
            select h.M_HAWB from HAWB_ShipmentData h inner join TBL_ZAVGR043_Prod za
            on h.ShipmentNo = za.ShipmentNo
            where za.Shipto = '4060'
            and za.Ship_Customer_City in ('ZhuBei City','Tainan','Kaohsiung City')
            and h.M_HAWB is not null
            ) t
            where HAWB_Primary.HAWB = t.M_HAWB;
            
            delete from HAWB_ShipmentData
            where ShipmentNo in (select ShipmentNo from TBL_ZAVGR043_Prod where Shipto = '4060' and Ship_Customer_City in ('ZhuBei City','Tainan','Kaohsiung City') );
            
            update Order_ShipmentData_Downs
            set Country = t.Country
            from (
                select * from TBL_ZAVGR043_Prod
            ) t
            where Order_ShipmentData_Downs.ShipmentNo = t.ShipmentNo;

            update Order_ShipmentData_Regular
            set Country = t.Country
            from (
                select * from TBL_ZAVGR043_Prod
            ) t
            where Order_ShipmentData_Regular.ShipmentNo = t.ShipmentNo;`, function (err, rows) {
                if (err) {
                    console.log(err.message)
                }
                console.log('reUpdate 4060 fro Taiwan order')
            })
        })


        db.serialize(function () {
            db.all('select * from Audit order by AutoId desc limit 20000', function (err, row) {
                return new Promise(function (resolve, reject) {

                    //})
                    if (!err) {
                        resolve(row)
                        //db.close()
                    } else {
                        reject(err)
                    }
                })

                // /db.close()


            })
        })
        /*db.serialize(function() {
            db.close()
        })*/











    })



}

const setCustomerShipCity = function () {
    return new Promise(function (resolve, reject) {

        db.serialize(function () {
            var updateHistory = `

            update TBL_ZAVGR043_Prod
            set Ship_Customer_Name = t.Ship_Customer_Name
            , Ship_Customer_City = t.Ship_Customer_City
            from (
                select * from VL06F_Temp
            ) t
            where TBL_ZAVGR043_Prod.Delivery =  t.Delivery
            and TBL_ZAVGR043_Prod.Ship_Customer_Name is null;

            `
            db.run(updateHistory, function (err, row) {
                if (!err) {
                    console.log('update TBL_ZAVGR043_Prod row: ' + row)
                    resolve('close')
                } else {
                    console.log('update TBL_ZAVGR043_Prod err: ' + err)
                    reject(err)
                }
            })
        })



    })
}

const setInsertHAWBRule = function (country, condition, point, shipto, forward, mon, tue, wed, thu, fri, sat, sun, explan) {
    console.log('Mon: ' + mon)
    return new Promise(function (resolve, reject) {

        db.serialize(function () {

            db.run(`CREATE TABLE IF NOT EXISTS TempHawb
            (Country TEXT, 
            Country_Id INTEGER, 
            ShptCondition TEXT, 
            ShptCondition_Id INTEGER, 
            ShptPoint TEXT, 
            ShptPoint_Id INTEGER, 
            ShipTo TEXT, 
            ShipTo_Id INTEGER, 
            Forward TEXT, 
            Forward_Id INTEGER,
            Mon numeric default 0,
            Tue numeric default 0,
            Wed numeric default 0,
            Thu numeric default 0,
            Fri numeric default 0,
            Sat numeric default 0,
            Sun numeric default 0,
            Explan numeric default 0)`, function (err, rows) {
                if (!err) {
                    console.log('crete table row: ' + rows)
                } else {
                    console.log('crete table row er: ' + err)
                }
            });
        })
        db.serialize(function () {
            var query = `insert into TempHawb (Country, ShptCondition, ShptPoint, ShipTo, Forward, Mon, Tue, Wed, Thu, Fri, Sat, Sun, Explan) values ("${country}","${condition}","${point}","${shipto}", "${forward}",${mon},${tue},${wed},${thu},${fri},${sat},${sun},${explan});`
            console.log(query)
            db.run(query, function (err, rows) {
                if (!err) {
                    console.log('insert table row: ' + rows)
                } else {
                    console.log('insert table er: ' + err)
                }
            })
        })
        db.serialize(function () {
            var updateCountry = `update TempHawb set Country_Id = (select AutoId  from HAWB_Country  where HAWB_Country.Country = TempHawb.Country ) 
                , ShptCondition_Id  = (select AutoId  from HAWB_ShptCondition  where  HAWB_ShptCondition.Shpt_Condition = TempHawb.ShptCondition ) 
                , ShptPoint_Id   = (select AutoId  from HAWB_ShptPoint  where HAWB_ShptPoint.Shpt_Point = TempHawb.ShptPoint  ) 
                , ShipTo_Id   = (select AutoId  from HAWB_ShipTo  where   HAWB_ShipTo.ShipTo = TempHawb.ShipTo) 
                , Forward_Id   = (select AutoId  from HAWB_Vendor  where   HAWB_Vendor .Vendor = TempHawb.Forward) ;`
            console.log(updateCountry)
            db.run(updateCountry, function (err, rows) {
                if (!err) {
                    console.log('update row: ' + rows)
                } else {
                    console.log('update err: ' + err)
                }
            })
        })
        db.serialize(function () {
            var insertNewRule = `insert into HAWB_Rule (Country_Id, Condition_Id, Shpt_Id, Shipto_Id, Forward, Mon, Tue, Wed, Thu, Fri, Sat, Sun, HAWB_Expand)
            select TempHawb.Country_Id, TempHawb.ShptCondition_Id, TempHawb.ShptPoint_Id, TempHawb.ShipTo_Id, TempHawb.Forward, TempHawb.Mon, TempHawb.Tue, TempHawb.Wed, TempHawb.Thu, TempHawb.Fri, TempHawb.Sat, TempHawb.Sun, TempHawb.Explan
            from TempHawb left join HAWB_Rule
            on ifnull(TempHawb.Country_Id,0) ||'-'||ifnull(TempHawb.ShptCondition_Id,0)||'-'||ifnull(TempHawb.ShptPoint_Id,0)||'-'||ifnull(TempHawb.ShipTo_Id,0)
            = ifnull(HAWB_Rule.Country_Id,0) ||'-'||ifnull(HAWB_Rule.Condition_Id,0)||'-'||ifnull(HAWB_Rule.Shpt_Id,0)||'-'||ifnull(HAWB_Rule.Shipto_Id,0)
            where ifnull(TempHawb.Country_Id,0) ||'-'||ifnull(TempHawb.ShptCondition_Id,0)||'-'||ifnull(TempHawb.ShptPoint_Id,0)||'-'||ifnull(TempHawb.ShipTo_Id,0)  <> ifnull(HAWB_Rule.Country_Id,0) ||'-'||ifnull(HAWB_Rule.Condition_Id,0)||'-'||ifnull(HAWB_Rule.Shpt_Id,0)||'-'||ifnull(HAWB_Rule.Shipto_Id,0) ;`
            console.log(insertNewRule)
            db.run(insertNewRule, function (err, rows) {
                if (!err) {
                    console.log('insert to rule row: ' + rows)
                } else {
                    console.log('insert to rule err: ' + err)
                }
            })
        })
        db.serialize(function () {
            var dropTable = `drop table TempHawb;`
            console.log(dropTable)
            db.run(dropTable, function (err, rows) {
                if (!err) {
                    console.log('drop table: ' + rows)
                } else {
                    console.log('drop table err: ' + err)
                }
            })
        })

        db.serialize(function () {
            //return new Promise(function (resolve, reject) {


            db.all('select * from Audit order by AutoId desc limit 20000', function (err, row) {
                if (!err) {
                    resolve(row)
                } else {
                    reject(err)
                }
            })
        })


    })

}

module.exports = { getPosts, setInsert, setUpdate, setInsertHAWBRule, setInsert043FromTemp, setCustomerShipCity }








