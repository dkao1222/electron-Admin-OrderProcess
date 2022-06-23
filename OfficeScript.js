function main(workbook: ExcelScript.Workbook) {
  let warehouse_task_history = workbook.getWorksheet("Warehouse task history")


  if (workbook.getWorksheet("tempHistory")) {
    console.log('Sheet has been created')
    try {
      workbook.getWorksheet("tempHistory").getUsedRange().clear()
      //templateSheet.getUsedRange().clear()
    } catch (err) {
      console.log(err)
    }


  } else {
    console.log('new sheet created')

    workbook.addWorksheet("tempHistory")

  }
  let templateSheet = workbook.getWorksheet("tempHistory")


  if (workbook.getWorksheet("handlingReOrder")) {
    console.log('Sheet has been created')

    try {
      workbook.getWorksheet("handlingReOrder").getUsedRange().clear()
    } catch (err) {
      console.log(err)
    }

  } else {
    console.log('new sheet created')
    workbook.addWorksheet("handlingReOrder")
  }
  let handlingReOrder = workbook.getWorksheet("handlingReOrder")

  let header = ['Out-document', 'handling unit', 'PICK-Create Date Time', 'PICK-Confirm Date Time', 'TRUCK-Date Time', 'TRANSIT-Date Time', 'PGI-Date Time', 'In-document', 'RCV-Date Time', 'Putaway-Date Time', 'Out-Activity', 'In-Activity', 'Order Type', 'Site']

  console.log('create header :' + header.length)
  for (let i = 0; i < header.length; i++) {
    //let p = i + 1
    let columnWidth = header[i].length * 10

    templateSheet.getCell(0, i).setValue(header[i])

    templateSheet.getCell(0, i).getFormat().setColumnWidth(columnWidth)

  }

  let findSheets = warehouse_task_history.getUsedRange();
  // find index of outbound_Delivery
  let destHandlingUnit = findSheets.find("Dest. Handling Unit", {
    completeMatch: false, /* Don't match if the cell text only contains "TK" as part of another string. */
    matchCase: false,
    searchDirection: ExcelScript.SearchDirection.forward /* Start at the beginning of the range and go to later columns and rows. */
  })

  let sourHandlingUnit = findSheets.find("Source Handling Unit", {
    completeMatch: false, /* Don't match if the cell text only contains "TK" as part of another string. */
    matchCase: false,
    searchDirection: ExcelScript.SearchDirection.forward /* Start at the beginning of the range and go to later columns and rows. */
  })

  let lastRow = findSheets.getRowCount();


  //warehouse_task_history.getRange(`${warehouse_task_history.getCell(0, destHandlingUnit.getColumnIndex()).getAddress()}:${warehouse_task_history.getCell(lastRow, destHandlingUnit.getColumnIndex()).getAddress()}`).getValues()
  warehouse_task_history.getRange(`${warehouse_task_history.getCell(0, sourHandlingUnit.getColumnIndex()).getAddress()}:${warehouse_task_history.getCell(lastRow, sourHandlingUnit.getColumnIndex()).getAddress()}`).getValues()

  templateSheet.getRange(`${templateSheet.getCell(0, 1).getAddress()}:${templateSheet.getCell(lastRow, 1).getAddress()}`).setNumberFormat("@")
  templateSheet.getRange(`${templateSheet.getCell(0, 1).getAddress()}:${templateSheet.getCell(lastRow, 1).getAddress()}`).setValues(warehouse_task_history.getRange(`${warehouse_task_history.getCell(0, destHandlingUnit.getColumnIndex()).getAddress()}:${warehouse_task_history.getCell(lastRow, destHandlingUnit.getColumnIndex()).getAddress()}`).getValues())

  let target = templateSheet.getRange(`${templateSheet.getCell(0, 1).getAddress()}:${templateSheet.getCell(lastRow, 1).getAddress()}`).getValues()
  let source = warehouse_task_history.getRange(`${warehouse_task_history.getCell(0, sourHandlingUnit.getColumnIndex()).getAddress()}:${warehouse_task_history.getCell(lastRow, sourHandlingUnit.getColumnIndex()).getAddress()}`).getValues()

  for (let i = 1; i < target.length; i++) {

    if (target[i][0] == "") {
      if (source[i][0] != "") {
        target[i][0] = source[i][0]
      }
      //target[i][0] = source[i][0]
    }
  }

  templateSheet.getRange(`${templateSheet.getCell(0, 1).getAddress()}:${templateSheet.getCell(lastRow, 1).getAddress()}`).setValues(target);

  templateSheet.getUsedRange().removeDuplicates([1], true)

  let targetMoveHeader = ['Dest. Handling Unit', 'Document', 'Activity', 'Dest. Handling Unit', 'Source Storage Bin', 'Dest. Stor. Bin', 'Start Date', 'Start Time', 'Dest. Handling Unit', 'Source Storage Bin', 'Dest. Stor. Bin', 'Confirmation Date', 'Confirmation Time', 'Confirmed by']
  let findLastRow = findSheets.getRowCount()
  for (let i = 0; i < targetMoveHeader.length; i++) {
    let targetMove = findSheets.find(targetMoveHeader[i], {
      completeMatch: false, /* Don't match if the cell text only contains "TK" as part of another string. */
      matchCase: false,
      searchDirection: ExcelScript.SearchDirection.forward /* Start at the beginning of the range and go to later columns and rows. */
    })
    let row = warehouse_task_history.getCell(0, targetMove.getColumnIndex()).getAddress();
    let cell = warehouse_task_history.getCell(findLastRow, targetMove.getColumnIndex()).getAddress();

    let source = warehouse_task_history.getRange(`${row}:${cell}`)

    let targetRow = handlingReOrder.getCell(0, i).getAddress()
    let targetCell = handlingReOrder.getCell(findLastRow, i).getAddress()
    if (i == 0 || i == 3 || i == 8) {
      handlingReOrder.getRange(`${targetRow}:${targetCell}`).setNumberFormat("@")
    } else if (i == 6 || i == 11) {
      handlingReOrder.getRange(`${targetRow}:${targetCell}`).setNumberFormat("yyyy/MM/dd")
    } else if (i == 7 || i == 12) {
      handlingReOrder.getRange(`${targetRow}:${targetCell}`).setNumberFormat("HH:mm:ss")
    }

    handlingReOrder.getRange(`${targetRow}:${targetCell}`).setValues(source.getValues())

  }

  let checkHandlingUnidData = templateSheet.getUsedRange().getValues();
  let docuemntData = handlingReOrder.getRange(`${handlingReOrder.getCell(0, 0).getAddress()}:${handlingReOrder.getCell(findLastRow, 2).getAddress()}`).getValues();

  // find Document
  console.log('check Document')
  for (let i = 0; i < checkHandlingUnidData.length; i++) {
    for (let j = 0; j < docuemntData.length; j++) {
      if (checkHandlingUnidData[i][1] == docuemntData[j][0]) {
        let checkString = docuemntData[j][1] as string;

        //console.log(docuemntData[j][1])
        if (checkString.toString().indexOf('100') >= 0) {
          // outbound
          checkHandlingUnidData[i][0] = docuemntData[j][1]
          checkHandlingUnidData[i][10] = docuemntData[j][2]
          if (docuemntData[j][2] == 'T1PR') {
            checkHandlingUnidData[i][12] = 'Regular'
          } else if (docuemntData[j][2] == 'T1ER') {
            checkHandlingUnidData[i][12] = 'Urgent'
          }
        } else if (checkString.toString().indexOf('800') >= 0) {
          // cross dock
          checkHandlingUnidData[i][0] = docuemntData[j][1]
          checkHandlingUnidData[i][10] = docuemntData[j][2]
        }

        if (checkString.toString().indexOf('200') >= 0) {
          // inbound
          checkHandlingUnidData[i][7] = docuemntData[j][1]
          checkHandlingUnidData[i][11] = 'PTWY'
        }
      }
    }

  }
  templateSheet.getUsedRange().setValues(checkHandlingUnidData)

  console.log('check Order start time')
  //checkHandlingUnidData = templateSheet.getUsedRange().getValues()
  let pickorderStart = handlingReOrder.getRange(`${handlingReOrder.getCell(0, 3).getAddress()}:${handlingReOrder.getCell(findLastRow, 7).getAddress()}`).getValues();
  for (let i = 0; i < checkHandlingUnidData.length; i++) {
    for (let j = 0; j < pickorderStart.length; j++) {
      if (checkHandlingUnidData[i][1] == pickorderStart[j][0]) {
        let checkString = pickorderStart[j][1] as string;
        let checkDpcument = checkHandlingUnidData[i][0] as string;
        let checkDpcumentRv = checkHandlingUnidData[i][7] as string;
        if (checkDpcument.toString().indexOf('100') >= 0) {
          if (checkString.indexOf('-STAG') > 0) {
            checkHandlingUnidData[i][2] = pickorderStart[j][3] as string + pickorderStart[j][4] as string
          }

          if (checkString.indexOf('F1') >= 0) {
            checkHandlingUnidData[i][13] = 'FTZ'
          }

          if (checkString.indexOf('T1') >= 0) {
            checkHandlingUnidData[i][13] = 'TMC'
          }




        }
        if (checkDpcument.toString().indexOf('800') >= 0) {
          if (checkString == '') {
            checkHandlingUnidData[i][2] = pickorderStart[j][3] as string + pickorderStart[j][4] as string
          }

          if (checkString.indexOf('F1') >= 0) {
            checkHandlingUnidData[i][13] = 'FTZ'
          }

          if (checkString.indexOf('T1') >= 0) {
            checkHandlingUnidData[i][13] = 'TMC'
          }

        }

        if (checkDpcumentRv.toString().indexOf('200') >= 0) {
          if (checkString == '') {
            checkHandlingUnidData[i][8] = pickorderStart[j][3] as string + pickorderStart[j][4] as string
          }

        }


      }
    }
  }

  //templateSheet.getUsedRange().setValues(checkHandlingUnidData)

  console.log('check Order confirm time')
  //checkHandlingUnidData = templateSheet.getUsedRange().getValues()
  let confirmorderStart = handlingReOrder.getRange(`${handlingReOrder.getCell(0, 8).getAddress()}:${handlingReOrder.getCell(findLastRow, 12).getAddress()}`).getValues();
  for (let i = 0; i < checkHandlingUnidData.length; i++) {
    for (let j = 0; j < confirmorderStart.length; j++) {
      if (checkHandlingUnidData[i][1] == pickorderStart[j][0]) {
        let checkString = confirmorderStart[j][2] as string;
        let checkDpcument = checkHandlingUnidData[i][0] as string;
        let checkDpcumentRv = checkHandlingUnidData[i][7] as string;
        if (checkDpcument.toString().indexOf('100') >= 0) {
          if (checkString.indexOf('PICKSTAG') > 0) {
            checkHandlingUnidData[i][3] = confirmorderStart[j][3] as string + confirmorderStart[j][4] as string
          }

          if (checkString.indexOf('TRUCK') > 0) {
            checkHandlingUnidData[i][4] = confirmorderStart[j][3] as string + confirmorderStart[j][4] as string
          }

          if (checkString.indexOf('INTERIM') > 0) {
            checkHandlingUnidData[i][5] = confirmorderStart[j][3] as string + confirmorderStart[j][4] as string
          }

          if (checkString.indexOf('TRANSIT') > 0) {
            checkHandlingUnidData[i][5] = confirmorderStart[j][3] as string + confirmorderStart[j][4] as string
          }

          if (checkString.indexOf('PGI') >= 0) {
            checkHandlingUnidData[i][6] = confirmorderStart[j][3] as string + confirmorderStart[j][4] as string
          }

        }
        if (checkDpcument.toString().indexOf('800') >= 0) {
          if (checkString.indexOf('CONS') > 0) {
            checkHandlingUnidData[i][3] = confirmorderStart[j][3] as string + confirmorderStart[j][4] as string
          }

          if (checkString.indexOf('PACK') > 0) {
            checkHandlingUnidData[i][4] = confirmorderStart[j][3] as string + confirmorderStart[j][4] as string
          }

          if (checkString.indexOf('SHIP') > 0) {
            checkHandlingUnidData[i][5] = confirmorderStart[j][3] as string + confirmorderStart[j][4] as string
          }

        }

        if (checkDpcumentRv.toString().indexOf('200') >= 0) {
          if (checkString.indexOf('-STAG') > 0) {
            checkHandlingUnidData[i][9] = confirmorderStart[j][3] as string + confirmorderStart[j][4] as string
          }
          //checkHandlingUnidData[i][9] = confirmorderStart[j][3] as string + confirmorderStart[j][4] as string
        }
      }
    }
  }

  templateSheet.getUsedRange().setValues(checkHandlingUnidData)



  templateSheet.getRange(`${templateSheet.getCell(0, 2).getAddress()}:${templateSheet.getCell(templateSheet.getUsedRange().getRowCount(), 6).getAddress()}`).setNumberFormat("yyyy/MM/dd HH:mm:ss")


  templateSheet.getRange(`${templateSheet.getCell(0, 8).getAddress()}:${templateSheet.getCell(templateSheet.getUsedRange().getRowCount(), 9).getAddress()}`).setNumberFormat("yyyy/MM/dd HH:mm:ss")

  console.log('finsish tempHistory')

  /*if(workbook.getWorksheet('calculation').getRange('r3').getValue() =='') {
    
  } else {
    let dates = new Date(`${workbook.getWorksheet('calculation').getRange('r3').getValue()}`)
  }*/
  //let dates = new Date(`${workbook.getWorksheet('calculation').getRange('r3').getText()}`)
  let dates = new Date()
  let year = dates.getFullYear();
  let month = dates.getMonth() + 1;
  let days = dates.getDate();


  // try timesaving 

  // create new sheet by date, and insert to index 0;
  console.log('create new outbound delivery')
  let sheetName = "Outbound_" + year.toString() + "_" + month.toString() + "_" + days.toString()

  //
  let outbound_Delivery = workbook.getWorksheet("Outbound Delivery");

  if (workbook.getWorksheet(`${sheetName}`)) {
    try {
      workbook.getWorksheet(`${sheetName}`).getUsedRange().clear()
    } catch (err) {
      console.log(err)
    }
  } else {
    workbook.addWorksheet(`${sheetName}`).setPosition(0);

  }
  let outboundTempSheet = workbook.getWorksheet(`${sheetName}`)
  let newSheetHeader = ['Create Date', 'Create Time', 'Document', 'ERP Number', 'Number of Items', 'Items', 'Picking Status', 'Good Issue Status', 'WM Status', 'Work center', 'Create Item', 'Pick Order Create Item', 'Pick Confirm Item', 'On Truck Item', 'On the Way Item', 'On TMC Item', 'System Plan Date', 'Activity', 'Site']

  for (let i = 0; i < newSheetHeader.length; i++) {
    //let p = i + 1
    let columnWidth = newSheetHeader[i].length * 10
    outboundTempSheet.getCell(0, i).setValue(newSheetHeader[i])
    outboundTempSheet.getCell(0, i).getFormat().setColumnWidth(columnWidth)
  }

  let outboundRange = outbound_Delivery.getUsedRange();

  outboundTempSheet.getRange(`${outboundTempSheet.getCell(1, 2).getAddress()}:${outboundTempSheet.getCell(outboundRange.getRowCount() - 1, 2).getAddress()}`).setValues(outbound_Delivery.getRange(`${outbound_Delivery.getCell(1, 1).getAddress()}:${outbound_Delivery.getCell(outboundRange.getRowCount() - 1, 1).getAddress()}`).getValues())


  console.log('Append Document number')
  var sourceValue = outboundTempSheet.getUsedRange().getValues()
  var targetValues = outboundRange.getValues()

  for (let i = 0; i < sourceValue.length; i++) {
    for (let j = 0; j < targetValues.length; j++) {
      if (sourceValue[i][2] == targetValues[j][1]) {
        sourceValue[i][0] = targetValues[j][33] // create date
        sourceValue[i][1] = targetValues[j][34] // create time
        sourceValue[i][3] = targetValues[j][2] // document
        sourceValue[i][4] = targetValues[j][6] // Number of item
        sourceValue[i][6] = targetValues[j][9] // Picking Status
        sourceValue[i][7] = targetValues[j][10] // Good issue status
        sourceValue[i][8] = targetValues[j][11] // WM Status
        sourceValue[i][9] = targetValues[j][36] // work center

        //sourceValue[i][16] = targetValues[j][28] // system plan date
      }
    }

  }

  let planWorkbook = workbook.getWorksheet("PlanerData").getUsedRange();
  // find index of outbound_Delivery
  let planDelivery = planWorkbook.find("Delivery", {
    completeMatch: false, /* Don't match if the cell text only contains "TK" as part of another string. */
    matchCase: false,
    searchDirection: ExcelScript.SearchDirection.forward /* Start at the beginning of the range and go to later columns and rows. */
  })

  let planGI = planWorkbook.find("GI", {
    completeMatch: false, /* Don't match if the cell text only contains "TK" as part of another string. */
    matchCase: false,
    searchDirection: ExcelScript.SearchDirection.forward /* Start at the beginning of the range and go to later columns and rows. */
  })
  let nbdSource = workbook.getWorksheet("PlanerData").getUsedRange().getValues()
  let deliveryIndex = planDelivery.getColumnIndex()
  let giIndex = planGI.getColumnIndex()

  for (let i = 0; i < sourceValue.length; i++) {
    for (let j = 0; j < nbdSource.length; j++) {
      if (sourceValue[i][3] == nbdSource[j][deliveryIndex]) {
        sourceValue[i][16] = nbdSource[j][giIndex]
      }

    }

  }


  targetValues = workbook.getWorksheet("tempHistory").getUsedRange().getValues(); // templateRange.getValues();
  for (let i = 0; i < sourceValue.length; i++) {
    for (let j = 0; j < targetValues.length; j++) {
      if (sourceValue[i][2] == targetValues[j][0]) {
        sourceValue[i][17] = targetValues[j][10] // Activate
        sourceValue[i][18] = targetValues[j][13] // Site

        for (let k = 0; k < 6; k++) {
          let tar = k + 2 // confirm date time
          let change = k + 10 // pick item start

          if (targetValues[j][tar] != '') {
            sourceValue[i][change] = Number(sourceValue[i][change]) + 1
          }
        }


      }
    }
  }


  outboundTempSheet.getUsedRange().setValues(sourceValue);
  outboundTempSheet.getRange(`${outboundTempSheet.getCell(0, 0).getAddress()}:${outboundTempSheet.getCell(outboundTempSheet.getUsedRange().getRowCount(), 0).getAddress()}`).setNumberFormat("yyyy/MM/dd")

  outboundTempSheet.getRange(`${outboundTempSheet.getCell(0, 16).getAddress()}:${outboundTempSheet.getCell(outboundTempSheet.getUsedRange().getRowCount(), 16).getAddress()}`).setNumberFormat("yyyy/MM/dd")

  // change time format
  outboundTempSheet.getRange(`${outboundTempSheet.getCell(0, 1).getAddress()}:${outboundTempSheet.getCell(outboundTempSheet.getUsedRange().getRowCount(), 1).getAddress()}`).setNumberFormat("HH:mm:ss")


  // create calculation sheet
  console.log('create calculation sheet')
  if (workbook.getWorksheet('calculation')) {
    try {
      workbook.getWorksheet('calculation').getUsedRange().clear()
      workbook.getWorksheet('calculation').setPosition(0)
    } catch (err) {
      console.log(err)
    }
  } else {
    workbook.addWorksheet('calculation').setPosition(0);
  }

  let calculation = workbook.getWorksheet("calculation")
  //calculation.getRange('P3').setValue('calculation Date')

  console.log('create calculation data format')
  for (let i = 0; i < 7; i++) {
    //let chcekDates = calculationDate.getDate()
    let calculationDate = new Date()
    calculationDate.setDate(calculationDate.getDate() + i)
    let year = calculationDate.getFullYear();
    let month = calculationDate.getMonth() + 1;
    let dates = calculationDate.getDate();

    let changeDate = year + '/' + month + '/' + dates
    calculation.getCell(2, 2 + i).setValue(changeDate)
    calculation.getCell(2, 2 + i).setNumberFormat("yyyy/MM/dd")

    calculation.getCell(17, 2 + i).setValue(changeDate)
    calculation.getCell(17, 2 + i).setNumberFormat("yyyy/MM/dd")

    calculation.getCell(35, 3 + i).setValue(changeDate)
    calculation.getCell(35, 3 + i).setNumberFormat("yyyy/MM/dd")

    // for GR value
    /*
    calculation.getCell(35, 2 + i).setValue(changeDate)
    calculation.getCell(35, 2 + i).setNumberFormat("yyyy/MM/dd")
    */
  }

  // set last 7 days
  for (let i = 7; i > 0; i--) {
    let calculationDate = new Date()
    calculationDate.setDate(calculationDate.getDate() - i)
    let year = calculationDate.getFullYear();
    let month = calculationDate.getMonth() + 1;
    let dates = calculationDate.getDate();


    let changeDate = year + '/' + month + '/' + dates
    calculation.getCell(9, 1 + i).setValue(changeDate)
    calculation.getCell(9, 1 + i).setNumberFormat("yyyy/MM/dd")

    calculation.getCell(26, 1 + i).setValue(changeDate)
    calculation.getCell(26, 1 + i).setNumberFormat("yyyy/MM/dd")

    calculation.getCell(45, 2 + i).setValue(changeDate)
    calculation.getCell(45, 2 + i).setNumberFormat("yyyy/MM/dd")

    // for GR value
    /* 
    calculation.getCell(39, 1 + i).setValue(changeDate)
    calculation.getCell(39, 1 + i).setNumberFormat("yyyy/MM/dd")
    */
  }

  let rowHeader = ['Number of Items', 'Pick completed', 'On Truck', 'On the Way', 'On TMC']
  for (let i = 0; i < 7; i++) {
    let p = i + 3
    calculation.getCell(p, 1).setValue(rowHeader[i])
  }

  for (let i = 0; i < 7; i++) {
    let p = i + 10
    calculation.getCell(p, 1).setValue(rowHeader[i])
  }

  let dailyHeader = ['FTZ-T1PR', 'FTZ-T1ER', 'FTZ-EMER', 'TMC-T1PR', 'TMC-T1ER', 'TMC-EMER', 'Total']
  for (let i = 0; i < 7; i++) {
    let p = i + 18
    calculation.getCell(p, 1).setValue(dailyHeader[i])
  }

  for (let i = 0; i < 7; i++) {
    let p = i + 27
    calculation.getCell(p, 1).setValue(dailyHeader[i])
  }

  let reportHeader = ['FTZ-Regular', 'FTZ-Down', 'FTZ-NSSC', 'FTZ-Totals', 'TMC-Regular', 'TMC-Down', 'TMC-NSSC', 'TMC-Totals']
  let reportKPI = ['36', '4', '36', '-', '36', '4', '36', '-']
  for (let i = 0; i < 8; i++) {
    let p = i + 36
    calculation.getCell(p, 1).setValue(reportHeader[i])
    calculation.getCell(p, 2).setValue(reportKPI[i])
  }

  for (let i = 0; i < 8; i++) {
    let p = i + 46
    calculation.getCell(p, 1).setValue(reportHeader[i])
    calculation.getCell(p, 2).setValue(reportKPI[i])
  }

  

  /* let rcvHeader = ['GR', 'putaway']
  for (let i = 0; i < 2; i++) {
    let p = i + 36
    calculation.getCell(p, 1).setValue(rcvHeader[i])
  }

  
  for (let i = 0; i < 2; i++) {
    let p = i + 40
    calculation.getCell(p, 1).setValue(rcvHeader[i])
  } */


  let calculationData = workbook.getWorksheet(sheetName).getUsedRange().getValues();
  let calculationSource = workbook.getWorksheet("calculation").getUsedRange().getValues();

  for (let i = 0; i < calculationSource.length; i++) {

    for (let j = 0; j < calculationSource[i].length; j++) {
      if (calculationSource[i][j] == "Number of Items") {
        for (let m = 0; m < 7; m++) {
          for (let k = 0; k < calculationData.length; k++) {
            let p = i - 1
            let q = m + 1

            if (calculationSource[p][q] == calculationData[k][16]) {
              calculationSource[i][q] = Number(calculationSource[i][q]) + Number(calculationData[k][4])
            }
          }
        }
      } else if (calculationSource[i][j] == "Pick completed") {

        for (let m = 0; m < 7; m++) {
          for (let k = 0; k < calculationData.length; k++) {
            let p = i - 2
            let q = m + 1

            if (calculationSource[p][q] == calculationData[k][16]) {
              calculationSource[i][q] = Number(calculationSource[i][q]) + Number(calculationData[k][12])
            }
          }
        }

      } else if (calculationSource[i][j] == "On Truck") {

        for (let m = 0; m < 7; m++) {
          for (let k = 0; k < calculationData.length; k++) {
            let p = i - 3
            let q = m + 1

            if (calculationSource[p][q] == calculationData[k][16]) {
              calculationSource[i][q] = Number(calculationSource[i][q]) + Number(calculationData[k][13])
            }
          }
        }

      } else if (calculationSource[i][j] == "On the Way") {

        for (let m = 0; m < 7; m++) {
          for (let k = 0; k < calculationData.length; k++) {
            let p = i - 4
            let q = m + 1

            if (calculationSource[p][q] == calculationData[k][16]) {
              calculationSource[i][q] = Number(calculationSource[i][q]) + Number(calculationData[k][14])
            }
          }
        }

      } else if (calculationSource[i][j] == "On TMC") {

        for (let m = 0; m < 7; m++) {
          for (let k = 0; k < calculationData.length; k++) {
            let p = i - 5
            let q = m + 1

            if (calculationSource[p][q] == calculationData[k][16]) {
              calculationSource[i][q] = Number(calculationSource[i][q]) + Number(calculationData[k][15])
            }
          }
        }

      }
    }
  }

  for (let i = 0; i < calculationSource.length; i++) {

    for (let j = 0; j < calculationSource[i].length; j++) {
      if (calculationSource[i][j] == "FTZ-T1PR") {
        for (let m = 0; m < 7; m++) {
          for (let k = 0; k < calculationData.length; k++) {
            let p = i - 1
            let q = m + 1

            if (calculationSource[p][q] == calculationData[k][16]) {
              if (calculationData[k][17] == 'T1PR') {
                calculationSource[i][q] = Number(calculationSource[i][q]) + Number(calculationData[k][13])
              }
              //calculationSource[i][m] = Number(calculationSource[i][m]) + Number(calculationData[k][13])
            }
          }
        }
      } else if (calculationSource[i][j] == "FTZ-T1ER") {
        for (let m = 0; m < 7; m++) {
          for (let k = 0; k < calculationData.length; k++) {
            let p = i - 2
            let q = m + 1

            if (calculationSource[p][q] == calculationData[k][16]) {
              if (calculationData[k][17] == 'T1ER') {
                calculationSource[i][q] = Number(calculationSource[i][q]) + Number(calculationData[k][13])
              }

            }
          }
        }
      } else if (calculationSource[i][j] == "FTZ-EMER") {
        for (let m = 0; m < 7; m++) {
          for (let k = 0; k < calculationData.length; k++) {
            let p = i - 3
            let q = m + 1

            if (calculationSource[p][q] == calculationData[k][16]) {
              if (calculationData[k][17] == 'EMER') {
                calculationSource[i][q] = Number(calculationSource[i][q]) + Number(calculationData[k][13])
              }
              //calculationSource[i][m] = Number(calculationSource[i][m]) + Number(calculationData[k][13])
            }
          }
        }

      } else if (calculationSource[i][j] == "TMC-T1PR") {
        for (let m = 0; m < 7; m++) {
          for (let k = 0; k < calculationData.length; k++) {
            let p = i - 4
            let q = m + 1

            if (calculationSource[p][q] == calculationData[k][16]) {
              if (calculationData[k][17] == 'T1PR') {
                calculationSource[i][q] = Number(calculationSource[i][q]) + Number(calculationData[k][15])
              }
              //calculationSource[i][m] = Number(calculationSource[i][m]) + Number(calculationData[k][13])
            }
          }
        }
      } else if (calculationSource[i][j] == "TMC-T1ER") {
        for (let m = 0; m < 7; m++) {
          for (let k = 0; k < calculationData.length; k++) {
            let p = i - 5
            let q = m + 1

            if (calculationSource[p][q] == calculationData[k][16]) {
              if (calculationData[k][17] == 'T1ER') {
                calculationSource[i][q] = Number(calculationSource[i][q]) + Number(calculationData[k][15])
              }

            }
          }
        }
      } else if (calculationSource[i][j] == "TMC-EMER") {
        for (let m = 0; m < 7; m++) {
          for (let k = 0; k < calculationData.length; k++) {
            let p = i - 6
            let q = m + 1

            if (calculationSource[p][m] == calculationData[k][16]) {
              if (calculationData[k][17] == 'EMER') {
                calculationSource[i][q] = Number(calculationSource[i][q]) + Number(calculationData[k][15])
              }
              //calculationSource[i][m] = Number(calculationSource[i][m]) + Number(calculationData[k][13])
            }
          }
        }

      } else if (calculationSource[i][j] == "Total") {
        for (let m = 0; m < 7; m++) {
          for (let k = 0; k < calculationData.length; k++) {
            let p = i - 7
            let q = m + 1

            if (calculationSource[p][q] == calculationData[k][16]) {
              /*if (calculationData[k][17] == 'EMER') {
                calculationSource[i][m] = Number(calculationSource[i][m]) + Number(calculationData[k][13])
              }*/
              calculationSource[i][q] = Number(calculationSource[i][q]) + Number(calculationData[k][4])
            }
          }
        }

      }
    }
  }

  /*for (let i = 0; i < calculationSource.length; i++) {

    for (let j = 0; j < calculationSource[i].length; j++) {

      if (calculationSource[i][j] == "GR") {
        for (let m = 0; m < 7; m++) {
          for (let k = 0; k < checkHandlingUnidData.length; k++) {
            let p = i - 1
            let q = m + 1

            let checDates = new Date(calculationSource[p][m] as string)
            let checkYear = checDates.getFullYear()
            let checkMonth = checDates.getMonth() + 1
            let checkDay = checDates.getDate()

            let defineDates = new Date(checkHandlingUnidData[k][8] as string)
            let defineYear = defineDates.getFullYear()
            let defineMonth = defineDates.getMonth() + 1
            let defineDay = defineDates.getDate()

            let mapCheckDate = checkYear + checkMonth + checkDay
            let mapDefineDate = defineYear + defineMonth + defineDay

            if (mapCheckDate == mapDefineDate) {
              if (checkHandlingUnidData[k][0] == '') {
                calculationSource[i][m] = Number(calculationSource[i][m]) + 1
              }
              //calculationSource[i][m] = Number(calculationSource[i][m]) + Number(calculationData[k][13])
            }
          }
        }
      } else if (calculationSource[i][j] == "putaway") {
        for (let m = 0; m < 7; m++) {
          for (let k = 0; k < checkHandlingUnidData.length; k++) {
            let p = i - 2
            let q = m + 1
            
            let checDates = new Date(calculationSource[p][m] as string)
            let checkYear = checDates.getFullYear()
            let checkMonth = checDates.getMonth() + 1
            let checkDay = checDates.getDate()

            let defineDates = new Date(checkHandlingUnidData[k][8] as string)
            let defineYear = defineDates.getFullYear()
            let defineMonth = defineDates.getMonth() + 1
            let defineDay = defineDates.getDate()

            let mapCheckDate = checkYear + checkMonth + checkDay
            let mapDefineDate = defineYear + defineMonth + defineDay

            if (mapCheckDate == mapDefineDate) {
              if (checkHandlingUnidData[k][0] == '') {
                calculationSource[i][m] = Number(calculationSource[i][m]) + 1
              }
              //calculationSource[i][m] = Number(calculationSource[i][m]) + Number(calculationData[k][13])
            }
          }
        }
      }
    }
  }*/

  for (let i = 0; i < calculationSource.length; i++) {
    for (let j = 0; j < calculationSource[i].length; j++) {


      //let p = i - 1
      //let q = i - 4
      // calculationData[k][18] // Site
      // calculationData[k][17] // Activate
      // calculationData[k][16] // System plan date
      if (calculationSource[i][j] == "FTZ-Regular") {
        for (let m = 0; m < 7; m++) {
          for (let k = 0; k < calculationData.length; k++) {
            let p = i - 1
            let q = m + 3


            if (calculationSource[p][q] == calculationData[k][16]) {
              if (calculationData[k][18] == 'FTZ') {
                if (calculationData[k][17] == 'T1PR') {
                  calculationSource[i][q] = Number(calculationSource[i][q]) + 1
                }
              }
            }



          }
        }
      }
      if (calculationSource[i][j] == "FTZ-Down") {
        for (let m = 0; m < 7; m++) {
          for (let k = 0; k < calculationData.length; k++) {
            let p = i - 2
            let q = m + 3

            if (calculationSource[p][q] == calculationData[k][16]) {
              if (calculationData[k][18] == 'FTZ') {
                if (calculationData[k][17] == 'T1ER') {
                  calculationSource[i][q] = Number(calculationSource[i][q]) + 1
                }
              }
            }

          }
        }
      }
      if (calculationSource[i][j] == "TMC-Regular") {
        for (let m = 0; m < 7; m++) {
          for (let k = 0; k < calculationData.length; k++) {
            let p = i - 5
            let q = m + 3

            if (calculationSource[p][q] == calculationData[k][16]) {
              if (calculationData[k][18] == 'TMC') {
                if (calculationData[k][17] == 'T1PR') {
                  calculationSource[i][q] = Number(calculationSource[i][q]) + 1
                }
              }
            }

          }
        }
      }
      if (calculationSource[i][j] == "TMC-Down") {
        for (let m = 0; m < 7; m++) {
          for (let k = 0; k < calculationData.length; k++) {
            let p = i - 6
            let q = m + 3

            if (calculationSource[p][q] == calculationData[k][16]) {
              if (calculationData[k][18] == 'TMC') {
                if (calculationData[k][17] == 'T1ER') {
                  calculationSource[i][q] = Number(calculationSource[i][q]) + 1
                }
              }
            }

          }
        }
      }
    }



  }



  workbook.getWorksheet("calculation").getUsedRange().setValues(calculationSource)

  console.log('finsish report calculation')
}
