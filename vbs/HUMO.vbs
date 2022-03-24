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

' WScript.Arguments(0) layout
' WScript.Arguments(1) report name
' WScript.Arguments(2) report save path



session.findById("wnd[0]").maximize
session.findById("wnd[0]/tbar[0]/okcd").text = "/nhumo"
session.findById("wnd[0]").sendVKey 0
session.findById("wnd[0]/usr/tabsTABSTRIP_ORDER_CRITERIA/tabpTEXT-230/ssub%_SUBSCREEN_ORDER_CRITERIA:RHU_HELP:2010/btn%_SELEXIDV_%_APP_%-VALU_PUSH").press
session.findById("wnd[1]/tbar[0]/btn[24]").press
session.findById("wnd[1]/tbar[0]/btn[8]").press
session.findById("wnd[0]/usr/tabsTABSTRIP_ORDER_CRITERIA/tabpTEXT-230/ssub%_SUBSCREEN_ORDER_CRITERIA:RHU_HELP:2010/radLGRID").select
session.findById("wnd[0]/usr/tabsTABSTRIP_ORDER_CRITERIA/tabpTEXT-230/ssub%_SUBSCREEN_ORDER_CRITERIA:RHU_HELP:2010/txtNODIS").text = "20000 "
session.findById("wnd[0]/usr/tabsTABSTRIP_ORDER_CRITERIA/tabpTEXT-230/ssub%_SUBSCREEN_ORDER_CRITERIA:RHU_HELP:2010/txtNODIS").setFocus
session.findById("wnd[0]/usr/tabsTABSTRIP_ORDER_CRITERIA/tabpTEXT-230/ssub%_SUBSCREEN_ORDER_CRITERIA:RHU_HELP:2010/txtNODIS").caretPosition = 13
session.findById("wnd[0]/tbar[1]/btn[8]").press
session.findById("wnd[0]/usr/cntlCONTAINER_2000/shellcont/shell").pressToolbarButton "&MB_VARIANT"
session.findById("wnd[1]/usr/ssubD0500_SUBSCREEN:SAPLSLVC_DIALOG:0501/cntlG51_CONTAINER/shellcont/shell").currentCellRow = -1
session.findById("wnd[1]/usr/ssubD0500_SUBSCREEN:SAPLSLVC_DIALOG:0501/cntlG51_CONTAINER/shellcont/shell").selectColumn "VARIANT"
session.findById("wnd[1]/usr/ssubD0500_SUBSCREEN:SAPLSLVC_DIALOG:0501/cntlG51_CONTAINER/shellcont/shell").contextMenu
session.findById("wnd[1]/usr/ssubD0500_SUBSCREEN:SAPLSLVC_DIALOG:0501/cntlG51_CONTAINER/shellcont/shell").selectContextMenuItem "&FILTER"
session.findById("wnd[2]/usr/ssub%_SUBSCREEN_FREESEL:SAPLSSEL:1105/ctxt%%DYN001-LOW").text = WScript.Arguments(0)
session.findById("wnd[2]/usr/ssub%_SUBSCREEN_FREESEL:SAPLSSEL:1105/ctxt%%DYN001-LOW").caretPosition = 6
session.findById("wnd[2]/tbar[0]/btn[0]").press
session.findById("wnd[1]/usr/ssubD0500_SUBSCREEN:SAPLSLVC_DIALOG:0501/cntlG51_CONTAINER/shellcont/shell").selectedRows = "0"
session.findById("wnd[1]/usr/ssubD0500_SUBSCREEN:SAPLSLVC_DIALOG:0501/cntlG51_CONTAINER/shellcont/shell").clickCurrentCell


'output file by TXT'

session.findById("wnd[0]/usr/cntlCONTAINER_2000/shellcont/shell").pressToolbarContextButton "&MB_EXPORT"
session.findById("wnd[0]/usr/cntlCONTAINER_2000/shellcont/shell").selectContextMenuItem "&PC"
session.findById("wnd[1]/usr/subSUBSCREEN_STEPLOOP:SAPLSPO5:0150/sub:SAPLSPO5:0150/radSPOPLI-SELFLAG[1,0]").select
session.findById("wnd[1]/usr/subSUBSCREEN_STEPLOOP:SAPLSPO5:0150/sub:SAPLSPO5:0150/radSPOPLI-SELFLAG[1,0]").setFocus
session.findById("wnd[1]/tbar[0]/btn[0]").press
session.findById("wnd[1]/usr/ctxtDY_PATH").text = WScript.Arguments(2)
session.findById("wnd[1]/usr/ctxtDY_FILENAME").text = WScript.Arguments(1)
session.findById("wnd[1]/usr/ctxtDY_FILENAME").caretPosition = 12
session.findById("wnd[1]/tbar[0]/btn[0]").press