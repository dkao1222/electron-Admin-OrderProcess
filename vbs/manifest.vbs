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

' WScript.Arguments(0) days
' WScript.Arguments(1) layout
' WScript.Arguments(2) report name
' WScript.Arguments(3) report save path

Dim dt
dt=now

session.findById("wnd[0]").maximize
session.findById("wnd[0]/tbar[0]/okcd").text = "/n/pweaver/manifest"
session.findById("wnd[0]").sendVKey 0
session.findById("wnd[0]/usr/ctxtS_DATE-LOW").text = FormatDateTime(dateadd("d",WScript.Arguments(0),dt),vbShortDate)
session.findById("wnd[0]/usr/ctxtS_DATE-HIGH").text = FormatDateTime(dt,vbShortDate)
session.findById("wnd[0]/usr/ctxtS_TKNUM-LOW").setFocus
session.findById("wnd[0]/usr/ctxtS_TKNUM-LOW").caretPosition = 0
session.findById("wnd[0]/usr/btn%_S_TKNUM_%_APP_%-VALU_PUSH").press
session.findById("wnd[1]/tbar[0]/btn[24]").press
session.findById("wnd[1]/tbar[0]/btn[8]").press
session.findById("wnd[0]/tbar[1]/btn[8]").press

'Change Layout to /PEGGY'
session.findById("wnd[0]/usr/cntlGRID_CONTAINER/shellcont/shell").pressToolbarButton "&MB_VARIANT"
session.findById("wnd[1]/usr/ssubD0500_SUBSCREEN:SAPLSLVC_DIALOG:0501/cntlG51_CONTAINER/shellcont/shell").currentCellRow = -1
session.findById("wnd[1]/usr/ssubD0500_SUBSCREEN:SAPLSLVC_DIALOG:0501/cntlG51_CONTAINER/shellcont/shell").selectColumn "VARIANT"
session.findById("wnd[1]/usr/ssubD0500_SUBSCREEN:SAPLSLVC_DIALOG:0501/cntlG51_CONTAINER/shellcont/shell").contextMenu
session.findById("wnd[1]/usr/ssubD0500_SUBSCREEN:SAPLSLVC_DIALOG:0501/cntlG51_CONTAINER/shellcont/shell").selectContextMenuItem "&FILTER"
session.findById("wnd[2]/usr/ssub%_SUBSCREEN_FREESEL:SAPLSSEL:1105/ctxt%%DYN001-LOW").text = WScript.Arguments(1)
session.findById("wnd[2]/usr/ssub%_SUBSCREEN_FREESEL:SAPLSSEL:1105/ctxt%%DYN001-LOW").caretPosition = 6
session.findById("wnd[2]/tbar[0]/btn[0]").press
session.findById("wnd[1]/usr/ssubD0500_SUBSCREEN:SAPLSLVC_DIALOG:0501/cntlG51_CONTAINER/shellcont/shell").selectedRows = "0"
session.findById("wnd[1]/usr/ssubD0500_SUBSCREEN:SAPLSLVC_DIALOG:0501/cntlG51_CONTAINER/shellcont/shell").clickCurrentCell
session.findById("wnd[0]/usr/cntlGRID_CONTAINER/shellcont/shell").pressToolbarContextButton "&MB_VIEW"
session.findById("wnd[0]/usr/cntlGRID_CONTAINER/shellcont/shell").selectContextMenuItem "&PRINT_BACK_PREVIEW"
session.findById("wnd[0]/tbar[1]/btn[32]").press
session.findById("wnd[1]/usr/tabsTS_LINES/tabpLI01/ssubSUB810:SAPLSKBH:0810/tblSAPLSKBHTC_WRITE_LIST/txtGT_WRITE_LIST-OUTPUTLEN[2,6]").text = "22"
session.findById("wnd[1]/usr/tabsTS_LINES/tabpLI01/ssubSUB810:SAPLSKBH:0810/tblSAPLSKBHTC_WRITE_LIST/txtGT_WRITE_LIST-OUTPUTLEN[2,6]").setFocus
session.findById("wnd[1]/usr/tabsTS_LINES/tabpLI01/ssubSUB810:SAPLSKBH:0810/tblSAPLSKBHTC_WRITE_LIST/txtGT_WRITE_LIST-OUTPUTLEN[2,6]").caretPosition = 2
session.findById("wnd[1]/tbar[0]/btn[0]").press



session.findById("wnd[0]/tbar[1]/btn[45]").press
session.findById("wnd[1]/usr/subSUBSCREEN_STEPLOOP:SAPLSPO5:0150/sub:SAPLSPO5:0150/radSPOPLI-SELFLAG[1,0]").select
session.findById("wnd[1]/usr/subSUBSCREEN_STEPLOOP:SAPLSPO5:0150/sub:SAPLSPO5:0150/radSPOPLI-SELFLAG[1,0]").setFocus
session.findById("wnd[1]/tbar[0]/btn[0]").press
session.findById("wnd[1]/usr/ctxtDY_PATH").text = WScript.Arguments(3)
session.findById("wnd[1]/usr/ctxtDY_FILENAME").text = WScript.Arguments(2)
session.findById("wnd[1]/usr/ctxtDY_FILENAME").caretPosition = 18
session.findById("wnd[1]/tbar[0]/btn[0]").press