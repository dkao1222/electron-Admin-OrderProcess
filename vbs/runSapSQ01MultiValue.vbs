If Not IsObject(application) Then
    Set SapGuiAuto  = GetObject("SAPGUI")
    Set application = SapGuiAuto.GetScriptingEngine
End If
If Not IsObject(connection) Then
    Set connection = application.Children(0)
End If
If Not IsObject(session) Then
    Set session    = connection.Children(0)
End If
If IsObject(WScript) Then
    WScript.ConnectObject session,     "on"
    WScript.ConnectObject application, "on"
End If
session.findById("wnd[0]").maximize

session.findById("wnd[0]/tbar[0]/okcd").text = "/nsq01"
session.findById("wnd[0]").sendVKey 0
If session.findById("wnd[0]/usr/ctxtRS38R-QNUM").Text <> "OUTBD_CUST_TW4" Then
    ' select other user group
    session.findById("wnd[0]/mbar/menu[1]/menu[7]").Select



    ' set filter by TW_OPERAT
    session.findById("wnd[1]/usr/cntlGRID1/shellcont/shell").currentCellRow = -1
    session.findById("wnd[1]/usr/cntlGRID1/shellcont/shell").firstVisibleRow = 54
    session.findById("wnd[1]/usr/cntlGRID1/shellcont/shell").selectColumn "DBGBNUM"
    session.findById("wnd[1]/usr/cntlGRID1/shellcont/shell").contextMenu
    session.findById("wnd[1]/usr/cntlGRID1/shellcont/shell").selectContextMenuItem "&FILTER"
    session.findById("wnd[2]/usr/ssub%_SUBSCREEN_FREESEL:SAPLSSEL:1105/ctxt%%DYN001-LOW").Text = "TW_OPERAT"
    session.findById("wnd[2]/usr/ssub%_SUBSCREEN_FREESEL:SAPLSSEL:1105/ctxt%%DYN001-LOW").caretPosition = 9
    
    ' excute
    session.findById("wnd[2]/tbar[0]/btn[0]").press
    
    ' set filter by OUTBD_CUST_TW4 customer report
    session.findById("wnd[1]/usr/cntlGRID1/shellcont/shell").selectedRows = "0"
    session.findById("wnd[1]/tbar[0]/btn[0]").press
    session.findById("wnd[0]/usr/cntlGRID_CONT0050/shellcont/shell").currentCellRow = -1
    session.findById("wnd[0]/usr/cntlGRID_CONT0050/shellcont/shell").selectColumn "QNUM"
    session.findById("wnd[0]/usr/cntlGRID_CONT0050/shellcont/shell").contextMenu
    session.findById("wnd[0]/usr/cntlGRID_CONT0050/shellcont/shell").selectContextMenuItem "&FILTER"
    session.findById("wnd[1]/usr/ssub%_SUBSCREEN_FREESEL:SAPLSSEL:1105/ctxt%%DYN001-LOW").Text = "OUTBD_CUST_TW4"
    session.findById("wnd[1]/usr/ssub%_SUBSCREEN_FREESEL:SAPLSSEL:1105/ctxt%%DYN001-LOW").caretPosition = 14
    session.findById("wnd[1]/tbar[0]/btn[0]").press
    session.findById("wnd[0]/usr/cntlGRID_CONT0050/shellcont/shell").selectedRows = "0"
    session.findById("wnd[0]/tbar[1]/btn[8]").press
Else
    session.findById("wnd[0]/tbar[1]/btn[8]").press
End If


' set Shipping point/receiving
session.findById("wnd[0]/usr/ctxtSP$00001-LOW").Text = "XTW1"
session.findById("wnd[0]/usr/ctxtSP$00001-HIGH").Text = ""



' set dellivery
session.findById("wnd[0]/usr/btn%_SP$00003_%_APP_%-VALU_PUSH").press
session.findById("wnd[1]/tbar[0]/btn[16]").press
session.findById("wnd[1]/tbar[0]/btn[24]").press
session.findById("wnd[1]/tbar[0]/btn[8]").press


' excute to run report
session.findById("wnd[0]").sendVKey 8

' send to clipboard
'session.findById("wnd[0]/usr/cntlCONTAINER/shellcont/shell").pressToolbarContextButton "&MB_EXPORT"
'session.findById("wnd[0]/usr/cntlCONTAINER/shellcont/shell").selectContextMenuItem "&PC"
'session.findById("wnd[1]/usr/subSUBSCREEN_STEPLOOP:SAPLSPO5:0150/sub:SAPLSPO5:0150/radSPOPLI-SELFLAG[4,0]").select
'session.findById("wnd[1]/usr/subSUBSCREEN_STEPLOOP:SAPLSPO5:0150/sub:SAPLSPO5:0150/radSPOPLI-SELFLAG[4,0]").setFocus
'session.findById("wnd[1]/tbar[0]/btn[0]").press

path = WScript.CreateObject("Scripting.FileSystemObject").GetSpecialFolder(2)
filename = "sapSq01Download.txt"
' output file
session.findById("wnd[0]/usr/cntlCONTAINER/shellcont/shell").pressToolbarContextButton "&MB_EXPORT"
session.findById("wnd[0]/usr/cntlCONTAINER/shellcont/shell").selectContextMenuItem "&PC"
session.findById("wnd[1]/tbar[0]/btn[0]").press
session.findById("wnd[1]/usr/ctxtDY_PATH").Text = path
session.findById("wnd[1]/usr/ctxtDY_FILENAME").Text = filename
session.findById("wnd[1]/usr/ctxtDY_FILE_ENCODING").Text = "4110" ' 8300 big5, 4110 utf8
session.findById("wnd[1]/usr/ctxtDY_FILE_ENCODING").SetFocus
session.findById("wnd[1]/usr/ctxtDY_FILE_ENCODING").caretPosition = 4
session.findById("wnd[1]/tbar[0]/btn[0]").press
