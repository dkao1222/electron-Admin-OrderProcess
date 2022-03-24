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

' WScript.Arguments(0) plan code
' WScript.Arguments(1) layout
' WScript.Arguments(2) report name
' WScript.Arguments(3) report save path


session.findById("wnd[0]").maximize
session.findById("wnd[0]/tbar[0]/okcd").text = "/nlt22"
session.findById("wnd[0]").sendVKey 0
session.findById("wnd[0]/usr/ctxtT3_LGNUM").text = WScript.Arguments(0)
session.findById("wnd[0]/usr/ctxtT3_LGNUM").caretPosition = 3
session.findById("wnd[0]/usr/btn%_T3_LGPLA_%_APP_%-VALU_PUSH").press
session.findById("wnd[1]/tbar[0]/btn[24]").press
session.findById("wnd[1]/tbar[0]/btn[8]").press
'session.findById("wnd[0]/usr/radT3_QUITA").select 'only confirm
session.findById("wnd[0]/usr/radT3_ALLTA").select ' All TO
session.findById("wnd[0]/usr/chkT3_SEVON").selected = false
session.findById("wnd[0]/usr/chkT3_SENAC").selected = true

session.findById("wnd[0]/usr/ctxtLISTV").text = WScript.Arguments(1)
session.findById("wnd[0]/usr/ctxtLISTV").setFocus
session.findById("wnd[0]/usr/ctxtLISTV").caretPosition = 7
session.findById("wnd[0]/tbar[1]/btn[8]").press
session.findById("wnd[0]/mbar/menu[0]/menu[1]/menu[2]").select
session.findById("wnd[1]/usr/subSUBSCREEN_STEPLOOP:SAPLSPO5:0150/sub:SAPLSPO5:0150/radSPOPLI-SELFLAG[1,0]").select
session.findById("wnd[1]/usr/subSUBSCREEN_STEPLOOP:SAPLSPO5:0150/sub:SAPLSPO5:0150/radSPOPLI-SELFLAG[1,0]").setFocus
session.findById("wnd[1]/tbar[0]/btn[0]").press
session.findById("wnd[1]/usr/ctxtDY_PATH").text = WScript.Arguments(3)
session.findById("wnd[1]/usr/ctxtDY_FILENAME").text = WScript.Arguments(2)
session.findById("wnd[1]/usr/ctxtDY_FILENAME").caretPosition = 12
session.findById("wnd[1]/tbar[0]/btn[0]").press

