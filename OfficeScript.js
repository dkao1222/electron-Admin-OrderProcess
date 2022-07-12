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
  if (findLastRow > 10000) {
    console.log(Math.ceil(Number(findLastRow) / 10000))
    for (let i = 0; i < Math.ceil(Number(findLastRow) / 10000); i++) {
      let checkHandlingUnidData = templateSheet.getUsedRange().getValues();
      let start = i * 10000
      let end = (i + 1) * 10000
      console.log('check Order start time Start:' + start + ', End:' + end)
      let pickorderStart = handlingReOrder.getRange(`${handlingReOrder.getCell(start, 3).getAddress()}:${handlingReOrder.getCell(end, 7).getAddress()}`).getValues()

      for (let i = 0; i < checkHandlingUnidData.length; i++) {
        for (let j = 0; j < pickorderStart.length; j++) {
          if (checkHandlingUnidData[i][1] == pickorderStart[j][0]) {
            let checkString = pickorderStart[j][1] as string;
            let checkDpcument = checkHandlingUnidData[i][0] as string;
            let checkDpcumentRv = checkHandlingUnidData[i][7] as string;
            if (checkDpcument.toString().indexOf('100') >= 0) {
              if (checkString.indexOf('-STAG') > 0 || checkString == '') {
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
        //templateSheet.getUsedRange().setValues(checkHandlingUnidData)
      }

      templateSheet.getUsedRange().setValues(checkHandlingUnidData)

    }
  } else {
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
    templateSheet.getUsedRange().setValues(checkHandlingUnidData)
  }




  //templateSheet.getUsedRange().setValues(checkHandlingUnidData)

  console.log('check Order confirm time')
  if (findLastRow > 10000) {
    console.log(Math.ceil(Number(findLastRow) / 10000))
    for (let i = 0; i < Math.ceil(Number(findLastRow) / 10000); i++) {
      let checkHandlingUnidData = templateSheet.getUsedRange().getValues();
      let start = i * 10000
      let end = (i + 1) * 10000
      console.log('check Order confirm time Start:' + start + ', End:' + end)
      let confirmorderStart = handlingReOrder.getRange(`${handlingReOrder.getCell(start, 8).getAddress()}:${handlingReOrder.getCell(end, 12).getAddress()}`).getValues();

      for (let i = 0; i < checkHandlingUnidData.length; i++) {
        for (let j = 0; j < confirmorderStart.length; j++) {
          if (checkHandlingUnidData[i][1] == confirmorderStart[j][0]) {
            let checkString = confirmorderStart[j][2] as string;
            let checkDpcument = checkHandlingUnidData[i][0] as string;
            let checkDpcumentRv = checkHandlingUnidData[i][7] as string;
            if (checkDpcument.toString().indexOf('100') >= 0) {
              if (checkString.indexOf('PICKSTAG') > 0) {

                //checkHandlingUnidData[i][3] = confirmorderStart[j][3] as string + confirmorderStart[j][4] as string
                checkHandlingUnidData[i][3] = confirmorderStart[j][3] as string + confirmorderStart[j][4] as string
              }

              if (checkString.indexOf('TRUCK') > 0) {
                checkHandlingUnidData[i][4] = confirmorderStart[j][3] as string + confirmorderStart[j][4] as string
              }

              if (checkString.indexOf('INTERIM') > 0) {
                //checkHandlingUnidData[i][5] = confirmorderStart[j][3] as string + confirmorderStart[j][4] as string
                checkHandlingUnidData[i][4] = confirmorderStart[j][3] as string + confirmorderStart[j][4] as string
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
    }

  } else {
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

  }





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
    calculationDate.setDate(calculationDate.getDate() + i - 7)
    let year = calculationDate.getFullYear();
    let month = calculationDate.getMonth() + 1;
    let dates = calculationDate.getDate();

    let changeDate = year + '/' + month + '/' + dates
    calculation.getCell(2, i + 2).setValue(changeDate)
    calculation.getCell(2, i + 2).setNumberFormat("yyyy/MM/dd")


    calculation.getCell(11, i + 2).setValue(changeDate)
    calculation.getCell(11, i + 2).setNumberFormat("yyyy/MM/dd")

    calculation.getCell(19, i + 3).setValue(changeDate)
    calculation.getCell(19, i + 3).setNumberFormat("yyyy/MM/dd")

    //calculation.getCell(31, i + 3).setValue(changeDate)
    //calculation.getCell(31, i + 3).setNumberFormat("yyyy/MM/dd")

  }

  for (let i = 0; i < 7; i++) {
    //let chcekDates = calculationDate.getDate()
    let calculationDate = new Date()
    calculationDate.setDate(calculationDate.getDate() + i)
    let year = calculationDate.getFullYear();
    let month = calculationDate.getMonth() + 1;
    let dates = calculationDate.getDate();

    let changeDate = year + '/' + month + '/' + dates
    calculation.getCell(2, i + 9).setValue(changeDate)
    calculation.getCell(2, i + 9).setNumberFormat("yyyy/MM/dd")


    calculation.getCell(11, i + 9).setValue(changeDate)
    calculation.getCell(11, i + 9).setNumberFormat("yyyy/MM/dd")

    calculation.getCell(19, i + 10).setValue(changeDate)
    calculation.getCell(19, i + 10).setNumberFormat("yyyy/MM/dd")

    //calculation.getCell(31, i + 10).setValue(changeDate)
    //calculation.getCell(31, i + 10).setNumberFormat("yyyy/MM/dd")


  }

  calculation.getCell(1, 1).setValue('Completed Volumn')
  calculation.getCell(10, 1).setValue('Inmpleted Volumn')
  let rowHeader = ['Plan Date', 'Number of Items', 'Pick completed', 'In EPG Staging', 'EPG -> TMC', 'In TMC']
  for (let i = 0; i < 6; i++) {
    let p = i + 2
    calculation.getCell(p, 1).setValue(rowHeader[i])
  }

  for (let i = 0; i < 6; i++) {
    let p = i + 11
    calculation.getCell(p, 1).setValue(rowHeader[i])
  }

  let reportHeader = ['FTZ-Regular', 'FTZ-Down', 'FTZ-NSSC', 'FTZ-Totals', 'TMC-Regular', 'TMC-Down', 'TMC-NSSC', 'TMC-Totals']
  let reportKPI = ['36', '4', '36', '-', '36', '4', '36', '-']
  calculation.getCell(19, 2).setValue('KPI')
  /*calculation.getCell(31, 2).setValue('KPI')
  for (let i = 0; i < 8; i++) {
    let p = i + 32
    calculation.getCell(p, 1).setValue(reportHeader[i])
    calculation.getCell(p, 2).setValue(reportKPI[i])
  }*/

  for (let i = 0; i < 8; i++) {
    let p = i + 20
    calculation.getCell(p, 1).setValue(reportHeader[i])
    calculation.getCell(p, 2).setValue(reportKPI[i])
  }

  for (let i = 2; i < 16; i++) {
    let j = i + 1
    calculation.getCell(3, i).setFormula(`=SUMIF(${sheetName}!$Q:$Q,${calculation.getCell(2, i).getAddress()},${sheetName}!$e:$e)`)
    calculation.getCell(4, i).setFormula(`=SUMIF(${sheetName}!$Q:$Q,${calculation.getCell(2, i).getAddress()},${sheetName}!$M:$M)`)
    calculation.getCell(5, i).setFormula(`=SUMIF(${sheetName}!$Q:$Q,${calculation.getCell(2, i).getAddress()},${sheetName}!$N:$N)`)
    calculation.getCell(6, i).setFormula(`=SUMIF(${sheetName}!$Q:$Q,${calculation.getCell(2, i).getAddress()},${sheetName}!$O:$O)`)
    calculation.getCell(7, i).setFormula(`=SUMIF(${sheetName}!$Q:$Q,${calculation.getCell(2, i).getAddress()},${sheetName}!$P:$P)`)
  }

  for (let i = 2; i < 16; i++) {
    let j = i + 1
    // number of item
    calculation.getCell(12, i).setFormula(`=SUMIF(${sheetName}!$Q:$Q,${calculation.getCell(2, i).getAddress()},${sheetName}!$e:$e)`)

    // pick not completed
    calculation.getCell(13, i).setFormula(`=${calculation.getCell(12, i).getAddress()}-${calculation.getCell(4, i).getAddress()}`)

    // Still in EPG Staging
    calculation.getCell(14, i).setFormula(`=${calculation.getCell(4, i).getAddress()}-${calculation.getCell(5, i).getAddress()}`)

    // Still on the way
    calculation.getCell(15, i).setFormula(`=${calculation.getCell(5, i).getAddress()}-${calculation.getCell(6, i).getAddress()}`)

    // in the TMC
    calculation.getCell(16, i).setFormula(`=${calculation.getCell(6, i).getAddress()}-${calculation.getCell(7, i).getAddress()}`)

  }

  for (let i = 3; i < 17; i++) {
    let j = i + 1

    calculation.getCell(20, i).setFormula(`=SUMIFS(${sheetName}!$E:$E,${sheetName}!$Q:$Q,${calculation.getCell(19, i).getAddress()},${sheetName}!$S:$S,"FTZ",${sheetName}!$R:$R,"T1PR",${sheetName}!$J:$J,"<>T1EPGINS")`)
    calculation.getCell(21, i).setFormula(`=SUMIFS(${sheetName}!$E:$E,${sheetName}!$Q:$Q,${calculation.getCell(19, i).getAddress()},${sheetName}!$S:$S,"FTZ",${sheetName}!$R:$R,"T1ER",${sheetName}!$J:$J,"<>T1EPGINS")`)
    calculation.getCell(22, i).setFormula(`=SUMIFS(${sheetName}!$E:$E,${sheetName}!$Q:$Q,${calculation.getCell(19, i).getAddress()},${sheetName}!$S:$S,"FTZ",${sheetName}!$J:$J,"T1EPGINS")`)
    calculation.getCell(23, i).setFormula(`=sum(${calculation.getCell(20, i).getAddress()}:${calculation.getCell(22, i).getAddress()})`)

    calculation.getCell(24, i).setFormula(`=SUMIFS(${sheetName}!$E:$E,${sheetName}!$Q:$Q,${calculation.getCell(19, i).getAddress()},${sheetName}!$S:$S,"TMC",${sheetName}!$R:$R,"T1PR",${sheetName}!$J:$J,"<>T1EPGINS")`)
    calculation.getCell(25, i).setFormula(`=SUMIFS(${sheetName}!$E:$E,${sheetName}!$Q:$Q,${calculation.getCell(19, i).getAddress()},${sheetName}!$S:$S,"TMC",${sheetName}!$R:$R,"T1ER",${sheetName}!$J:$J,"<>T1EPGINS")`)
    calculation.getCell(26, i).setFormula(`=SUMIFS(${sheetName}!$E:$E,${sheetName}!$Q:$Q,${calculation.getCell(19, i).getAddress()},${sheetName}!$S:$S,"TMC",${sheetName}!$J:$J,"T1EPGINS")`)
    calculation.getCell(27, i).setFormula(`=sum(${calculation.getCell(24, i).getAddress()}:${calculation.getCell(26, i).getAddress()})`)

  }



  console.log('finsish report calculation')
}
