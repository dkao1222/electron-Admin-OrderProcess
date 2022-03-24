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
' WScript.Arguments(1) report path

session.findById("wnd[0]/mbar/menu[0]/menu[3]/menu[2]").select
session.findById("wnd[1]/usr/subSUBSCREEN_STEPLOOP:SAPLSPO5:0150/sub:SAPLSPO5:0150/radSPOPLI-SELFLAG[1,0]").select
session.findById("wnd[1]/usr/subSUBSCREEN_STEPLOOP:SAPLSPO5:0150/sub:SAPLSPO5:0150/radSPOPLI-SELFLAG[1,0]").setFocus
session.findById("wnd[1]/tbar[0]/btn[0]").press
session.findById("wnd[1]/usr/ctxtDY_PATH").text = WScript.Arguments(1)
session.findById("wnd[1]/usr/ctxtDY_FILENAME").text = WScript.Arguments(0)
session.findById("wnd[1]/usr/ctxtDY_FILENAME").caretPosition = 14
session.findById("wnd[1]/tbar[0]/btn[0]").press




WScript.Stdout.Write(session.findById("/app/con[0]/ses[0]/wnd[0]/sbar/pane[0]").text)