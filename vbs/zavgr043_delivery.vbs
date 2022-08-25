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

' WScript.Arguments(0) layout user
' WScript.Arguments(1) datediff days
' WScript.Arguments(2) report name
' WScript.Arguments(3) report save path

session.findById("wnd[0]").maximize
session.findById("wnd[0]/tbar[0]/okcd").text = "/nzavgr043"
session.findById("wnd[0]").sendVKey 0

session.findById("wnd[0]/usr/ctxtS_VSTEL-LOW").text = "*"

session.findById("wnd[0]/usr/ctxtS_ERDAT-LOW").text = FormatDateTime(dateadd("d",-30,dt),vbShortDate)
session.findById("wnd[0]/usr/ctxtS_ERDAT-HIGH").text = FormatDateTime(dt,vbShortDate)
session.findById("wnd[0]/usr/ctxtS_VBELNL-LOW").setFocus
session.findById("wnd[0]/usr/ctxtS_VBELNL-LOW").caretPosition = 0
session.findById("wnd[0]/usr/btn%_S_VBELNL_%_APP_%-VALU_PUSH").press
session.findById("wnd[1]/tbar[0]/btn[16]").press
session.findById("wnd[1]/tbar[0]/btn[24]").press
session.findById("wnd[1]/tbar[0]/btn[8]").press

session.findById("wnd[0]/usr/ctxtP_VAR").text = "/X031651"
session.findById("wnd[0]/usr/ctxtP_SHTYP").setFocus
session.findById("wnd[0]/usr/ctxtP_SHTYP").caretPosition = 0

session.findById("wnd[0]").sendVKey 8