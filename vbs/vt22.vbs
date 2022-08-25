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


' WScript.Arguments(0) report name
' WScript.Arguments(1) report save path

session.findById("wnd[0]").maximize
session.findById("wnd[0]/tbar[0]/okcd").Text = "/NVT22"
session.findById("wnd[0]").sendVKey 0
session.findById("wnd[0]/usr/txtG_USER-LOW").Text = ""
session.findById("wnd[0]/usr/btn%_OBJECT_%_APP_%-VALU_PUSH").press
session.findById("wnd[1]/tbar[0]/btn[24]").press
session.findById("wnd[1]/usr/tabsTAB_STRIP/tabpSIVA/ssubSCREEN_HEADER:SAPLALDB:3010/tblSAPLALDBSINGLE/btnRSCSEL_255-SOP_I[0,0]").SetFocus
session.findById("wnd[1]/usr/tabsTAB_STRIP/tabpSIVA/ssubSCREEN_HEADER:SAPLALDB:3010/tblSAPLALDBSINGLE/btnRSCSEL_255-SOP_I[0,0]").press
session.findById("wnd[2]/tbar[0]/btn[14]").press
session.findById("wnd[1]/tbar[0]/btn[8]").press
session.findById("wnd[0]/tbar[1]/btn[8]").press
session.findById("wnd[0]/usr/lbl[86,1]").SetFocus
session.findById("wnd[0]/usr/lbl[86,1]").caretPosition = 6
session.findById("wnd[0]").sendVKey 2
session.findById("wnd[0]/tbar[1]/btn[29]").press
session.findById("wnd[1]/usr/ssub%_SUBSCREEN_FREESEL:SAPLSSEL:1105/ctxt%%DYN001-LOW").Text = "ZAMGU214"
session.findById("wnd[1]/usr/ssub%_SUBSCREEN_FREESEL:SAPLSSEL:1105/ctxt%%DYN001-LOW").caretPosition = 8
session.findById("wnd[1]/tbar[0]/btn[0]").press
session.findById("wnd[0]/mbar/menu[0]/menu[1]/menu[2]").select
session.findById("wnd[1]/usr/subSUBSCREEN_STEPLOOP:SAPLSPO5:0150/sub:SAPLSPO5:0150/radSPOPLI-SELFLAG[1,0]").select
session.findById("wnd[1]/usr/subSUBSCREEN_STEPLOOP:SAPLSPO5:0150/sub:SAPLSPO5:0150/radSPOPLI-SELFLAG[1,0]").setFocus
session.findById("wnd[1]/tbar[0]/btn[0]").press
session.findById("wnd[1]/usr/ctxtDY_PATH").text = WScript.Arguments(1)
session.findById("wnd[1]/usr/ctxtDY_FILENAME").text = WScript.Arguments(0)
session.findById("wnd[1]/usr/ctxtDY_FILE_ENCODING").text = "4110"
session.findById("wnd[1]/usr/ctxtDY_FILE_ENCODING").setFocus
session.findById("wnd[1]/usr/ctxtDY_FILE_ENCODING").caretPosition = 4
session.findById("wnd[1]/tbar[0]/btn[0]").press