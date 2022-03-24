
const { app } = require('electron')

const path = require('path')


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
const setInsert043FromTemp = function() {
    return new Promise(function(resolve, reject) {
        
        db.serialize(function(){
            var updateHistory = `

            delete from audit;

            `
            db.run(updateHistory, function(err, row){
                if(!err){
                    console.log('update TBL_ZAVGR043_Prod row: ' + row)
                } else {
                    console.log('update TBL_ZAVGR043_Prod err: ' + err)
                }   
            })
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
            db.run(updateHistory, function(err, row){
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

            

            db.run(insertHistory, function(err, row){
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
            and TBL_ZAVGR043_Prod.Team_Name is NULL;`)

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
            where TBL_ZAVGR043_Prod.Team_Name is NULL;`)

            
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

            db.run(insertHistoryDowns, function(err, row){
                if(!err){
                    console.log('inser HAWB_ShipmentData row: ' + row)
                } else {
                    console.log('inser HAWB_ShipmentData err: ' + err)
                }   
            })

            db.run(insertHistoryRegular, function(err, row){
                if(!err){
                    console.log('inser HAWB_ShipmentData row: ' + row)
                } else {
                    console.log('inser HAWB_ShipmentData err: ' + err)
                }   
            })
        })

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

            db.run(insertHistoryDowns, function(err, row){
                if(!err){
                    console.log('inser Order_ShipmentData_Downs row: ' + row)
                } else {
                    console.log('inser Order_ShipmentData_Downs err: ' + err)
                }   
            })
            db.run(insertHistoryRegular, function(err, row){
                if(!err){
                    console.log('inser Order_ShipmentData_Downs row: ' + row)
                } else {
                    console.log('inser Order_ShipmentData_Downs err: ' + err)
                }   
            })
            db.run(insertHistoryRegularTW, function(err, row){
                if(!err){
                    console.log('inser Order_ShipmentData_Downs row: ' + row)
                } else {
                    console.log('inser Order_ShipmentData_Downs err: ' + err)
                }   
            })
            db.run(insertHistoryAMTdowns, function(err, row){
                if(!err){
                    console.log('inser Order_ShipmentData_Downs row: ' + row)
                } else {
                    console.log('inser Order_ShipmentData_Downs err: ' + err)
                }   
            })
            db.run(insertHistoryAMT, function(err, row){
                if(!err){
                    console.log('inser Order_ShipmentData_Downs row: ' + row)
                } else {
                    console.log('inser Order_ShipmentData_Downs err: ' + err)
                }   
            })
            db.exec(`delete from Order_ShipmentData_AMT
            where ShipmentNo in (select ShipmentNo from TBL_ZAVGR043_Prod where Team_Name in ('FSL - TXG', 'FSL - TNN', 'TKM'));`)

            db.exec(`delete from Order_ShipmentData_AMT_Downs
            where ShipmentNo in (select ShipmentNo from TBL_ZAVGR043_Prod where Team_Name in ('FSL - TXG', 'FSL - TNN', 'TKM'));`)
        })

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
            db.run(insertHistory, function(err, row){
                if(!err){
                    console.log('update HAWB_ShipmentData row: ' + row)
                } else {
                    console.log('update HAWB_ShipmentData err: ' + err)
                }   
            })
        })

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
            db.run(updateService, function(err, row){
                if(!err){
                    console.log('update Order_ShipmentData_Downs row: ' + row)
                } else {
                    console.log('update Order_ShipmentData_Downs err: ' + err)
                }   
            })
            db.run(updateServiceReg, function(err, row){
                if(!err){
                    console.log('update Order_ShipmentData_Downs row: ' + row)
                } else {
                    console.log('update Order_ShipmentData_Downs err: ' + err)
                }   
            })

            db.run(updateService89, function(err, row){
                if(!err){
                    console.log('update Order_ShipmentData_Downs row: ' + row)
                } else {
                    console.log('update Order_ShipmentData_Downs err: ' + err)
                }   
            })
        })

        db.serialize(function(){
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
            db.run(updateService, function(err, row){
                if(!err){
                    console.log('update Order_ShipmentData_Downs BNB row: ' + row)
                } else {
                    console.log('update Order_ShipmentData_Downs BNB err: ' + err)
                }   
            })

            db.run(`Update Order_ShipmentData_AMT
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
                if(!err){
                    console.log('update Order_ShipmentData_AMT BNB row: ' + row)
                } else {
                    console.log('update Order_ShipmentData_AMT BNB err: ' + err)
                }   
            });

            db.run(`Update Order_ShipmentData_AMT_Downs
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

            db.run(`Update Order_ShipmentData_Regular
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

            db.run(`Update Order_ShipmentData_RegularTW
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


            db.run(`Update Order_ShipmentData_Downs
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

            db.run(`Update Order_ShipmentData_AMT
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

            db.run(`Update Order_ShipmentData_AMT_Downs
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

            db.run(`Update Order_ShipmentData_Regular
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

            db.run(`Update Order_ShipmentData_RegularTW
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

            db.run(`update TBL_ZAVGR043_Prod
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
            
        })
        

        db.serialize(function(){
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

            


            db.run(updateService, function(err, row){
                if(!err){
                    console.log('update Order_ShipmentData_Downs forward row: ' + row)
                } else {
                    console.log('update Order_ShipmentData_Downs forward err: ' + err)
                }   
            })
            db.run(updateService2, function(err, row){
                if(!err){
                    console.log('update Order_ShipmentData_Downs forward row: ' + row)
                } else {
                    console.log('update Order_ShipmentData_Downs forward err: ' + err)
                }   
            })
            db.run(updateService3, function(err, row){
                if(!err){
                    console.log('update Order_ShipmentData_Downs forward row: ' + row)
                } else {
                    console.log('update Order_ShipmentData_Downs forward err: ' + err)
                }   
            })
            db.run(updateService4, function(err, row){
                if(!err){
                    console.log('update Order_ShipmentData_Downs forward row: ' + row)
                } else {
                    console.log('update Order_ShipmentData_Downs forward err: ' + err)
                }   
            })
            

            



        })
        db.serialize(function(){
            db.exec(`delete from TempRuleAssign;
            WITH RECURSIVE
            cnt( ShipmentNo, Vendor, M_HAWB, D_HAWB, ImportDateTime, AutoId ) AS ( select ShipmentNo, Vendor, M_HAWB, D_HAWB, ImportDateTime, AutoId from HAWB_ShipmentData where HAWB_Expand = 0 order by ImportDateTime, AutoId )
            insert into TempRuleAssign select AutoId, ImportDateTime,  ShipmentNo, Vendor, M_HAWB, D_HAWB from cnt;`)

            db.exec(`
            delete from TempRuleRunTime;
            delete from TempRuleAssignExpand;
            
        
            insert into TempRuleAssignExpand ( AutoId, ImportDateTime,  ShipmentNo, shipto, Vendor , Cut_Time) 
            select max(AutoId) as maxAutoId, ImportDateTime,  ShipmentNo, shipto, Vendor, R_CutTime 
            from HAWB_ShipmentData where HAWB_Expand = 1 
            group by ImportDateTime,  ShipmentNo, shipto, Vendor, R_CutTime ;
            --order by ImportDateTime, AutoId ;`)
            
        
            db.exec(`
            update TempRuleAssignExpand
            set GroupNum = t1.GroupNum
            , SortNum = t1.SortNum
            from (
                select 
                dense_rank() OVER ( order by TempRuleAssignExpand.Cut_Time, TempRuleAssignExpand.Shipto) as GroupNum
                
                ,rank() OVER ( PARTITION by TempRuleAssignExpand.Cut_Time, TempRuleAssignExpand.Shipto order by TempRuleAssignExpand.AutoId) as SortNum
                ,TempRuleAssignExpand.ImportDateTime
                ,TempRuleAssignExpand.ShipmentNo
                ,TempRuleAssignExpand.Shipto
                ,TempRuleAssignExpand.Vendor
                ,TempRuleAssignExpand.M_HAWB
                ,TempRuleAssignExpand.D_HAWB
                ,TempRuleAssignExpand.Cut_Time
                from TempRuleAssignExpand ) as t1
            where TempRuleAssignExpand.ShipmentNo = t1.ShipmentNo;`)

            db.exec(`
            with RECURSIVE
            cnt(GroupNum) as (select GroupNum from TempRuleAssignExpand group by GroupNum )
            insert INTO TempRuleRunTime (id) select * from cnt;`)
            
            
        })
        
        

        

        
        db.serialize(function(){
            db.all('select * from Audit order by AutoId desc limit 20000', function(err, row){
                if(!err){
                    resolve(row)
                } else {
                    reject(err)
                } 
            })
        })
        
        
        
    })
}

const setCustomerShipCity = function() {
    return new Promise(function(resolve, reject) {
        
        db.serialize(function(){
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
            db.run(updateHistory, function(err, row){
                if(!err){
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

const setInsertHAWBRule = function (country, condition, point, shipto, forward, mon, tue, wed, thu, fri, sat,sun, explan) {
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

        db.serialize(function(){
            db.all('select * from Audit order by AutoId desc limit 20000', function(err, row){
                if(!err){
                    resolve(row)
                } else {
                    reject(err)
                } 
            })
        })
        

    })

}

module.exports = { getPosts, setInsert, setUpdate, setInsertHAWBRule , setInsert043FromTemp , setCustomerShipCity }








