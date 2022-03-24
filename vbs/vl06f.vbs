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

Dim dt
dt=now

' WScript.Arguments(0) layout name
' WScript.Arguments(1) datediff days
' WScript.Arguments(2) report name
' WScript.Arguments(3) report save path


session.findById("wnd[0]").maximize
session.findById("wnd[0]/tbar[0]/okcd").text = "/nvl06f"
session.findById("wnd[0]").sendVKey 0
session.findById("wnd[0]/usr/ctxtIT_WADAT-LOW").text = FormatDateTime(dateadd("d",WScript.Arguments(1),dt),vbShortDate)
session.findById("wnd[0]/usr/ctxtIT_WADAT-HIGH").text = FormatDateTime(dateadd("d",30,dt),vbShortDate)
session.findById("wnd[0]/usr/ctxtIT_TKNUM-LOW").setFocus
session.findById("wnd[0]/usr/ctxtIT_TKNUM-LOW").caretPosition = 0
session.findById("wnd[0]/usr/btn%_IT_TKNUM_%_APP_%-VALU_PUSH").press
session.findById("wnd[1]/tbar[0]/btn[16]").press
session.findById("wnd[1]/tbar[0]/btn[24]").press
session.findById("wnd[1]/tbar[0]/btn[8]").press
session.findById("wnd[0]/tbar[1]/btn[8]").press

session.findById("wnd[0]/tbar[1]/btn[33]").press
session.findById("wnd[1]/usr/lbl[1,1]").setFocus
session.findById("wnd[1]/usr/lbl[1,1]").caretPosition = 6
session.findById("wnd[1]").sendVKey 2
session.findById("wnd[1]/tbar[0]/btn[29]").press
session.findById("wnd[2]/usr/ssub%_SUBSCREEN_FREESEL:SAPLSSEL:1105/ctxt%%DYN001-LOW").text = WScript.Arguments(0) '"/01 CUSOTMER"
session.findById("wnd[2]/usr/ssub%_SUBSCREEN_FREESEL:SAPLSSEL:1105/ctxt%%DYN001-LOW").caretPosition = 12
session.findById("wnd[2]/tbar[0]/btn[0]").press
session.findById("wnd[1]/usr/lbl[1,3]").setFocus
session.findById("wnd[1]/usr/lbl[1,3]").caretPosition = 7
session.findById("wnd[1]").sendVKey 2
session.findById("wnd[0]/tbar[1]/btn[32]").press
session.findById("wnd[1]/usr/tabsTS_LINES/tabpLI01/ssubSUB810:SAPLSKBH:0810/tblSAPLSKBHTC_WRITE_LIST/txtGT_WRITE_LIST-OUTPUTLEN[2,2]").text = "50"
session.findById("wnd[1]/usr/tabsTS_LINES/tabpLI01/ssubSUB810:SAPLSKBH:0810/tblSAPLSKBHTC_WRITE_LIST/txtGT_WRITE_LIST-OUTPUTLEN[2,3]").text = "50"
session.findById("wnd[1]/usr/tabsTS_LINES/tabpLI01/ssubSUB810:SAPLSKBH:0810/tblSAPLSKBHTC_WRITE_LIST/txtGT_WRITE_LIST-OUTPUTLEN[2,3]").setFocus
session.findById("wnd[1]/usr/tabsTS_LINES/tabpLI01/ssubSUB810:SAPLSKBH:0810/tblSAPLSKBHTC_WRITE_LIST/txtGT_WRITE_LIST-OUTPUTLEN[2,3]").caretPosition = 2
session.findById("wnd[1]/tbar[0]/btn[0]").press
session.findById("wnd[0]/mbar/menu[0]/menu[5]/menu[2]").select
session.findById("wnd[1]/usr/subSUBSCREEN_STEPLOOP:SAPLSPO5:0150/sub:SAPLSPO5:0150/radSPOPLI-SELFLAG[1,0]").select
session.findById("wnd[1]/usr/subSUBSCREEN_STEPLOOP:SAPLSPO5:0150/sub:SAPLSPO5:0150/radSPOPLI-SELFLAG[1,0]").setFocus
session.findById("wnd[1]/tbar[0]/btn[0]").press
session.findById("wnd[1]/usr/ctxtDY_PATH").text = WScript.Arguments(3)
session.findById("wnd[1]/usr/ctxtDY_FILENAME").text = WScript.Arguments(2)
session.findById("wnd[1]/usr/ctxtDY_FILENAME").caretPosition = 9
session.findById("wnd[1]/tbar[0]/btn[0]").press


