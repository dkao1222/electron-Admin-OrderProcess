' PGI function

' WScript.Arguments(0) shipment

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


session.findById("wnd[0]").Maximize
session.findById("wnd[0]/tbar[0]/okcd").Text = "/nvt02n"
session.findById("wnd[0]").sendVKey 0
session.findById("wnd[0]/usr/ctxtVTTK-TKNUM").Text =  WScript.Arguments(0)

On Error Resume Next
session.findById("wnd[0]/usr/ctxtVTTK-TKNUM").caretPosition = 7
On Error Resume Next
session.findById("wnd[0]").sendVKey 0
On Error Resume Next
session.findById("wnd[0]").sendVKey 0
On Error Resume Next
session.findById("wnd[0]/usr/tabsHEADER_TABSTRIP2/tabpTABS_OV_DE/ssubG_HEADER_SUBSCREEN2:SAPMV56A:1025/btn*RV56A-ICON_STTBG").press
On Error Resume Next
session.findById("wnd[0]/tbar[0]/btn[11]").press

session.findById("wnd[0]/tbar[0]/btn[12]").press
session.findById("wnd[0]/tbar[0]/btn[12]").press
session.findById("wnd[0]/tbar[0]/btn[12]").press
