' Invoice

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

' WScript.Arguments(0) shipment

Dim dt
dt=now

session.findById("wnd[0]").Maximize
session.findById("wnd[0]/tbar[0]/okcd").Text = "/nzavgu005"
session.findById("wnd[0]").sendVKey 0
session.findById("wnd[0]/usr/ctxtP_TKNUM").Text = WScript.Arguments(0)
session.findById("wnd[0]/usr/ctxtP_TKNUM").caretPosition = 7


session.findById("wnd[0]/tbar[1]/btn[8]").press

if Instr( 1, session.findById("/app/con[0]/ses[0]/wnd[0]/sbar/pane[0]").text, "already exist", vbTextCompare ) > 0  Then

session.findById("wnd[0]/usr/cntlCONTAINER_0100/shellcont/shell").setCurrentCell 1, ""

session.findById("wnd[0]/usr/cntlCONTAINER_0100/shellcont/shell").selectedRows = "1"
session.findById("wnd[0]/usr/cntlCONTAINER_0100/shellcont/shell").pressToolbarButton "SLL_MSG_EXECEUTE"
session.findById("wnd[0]/tbar[0]/btn[12]").press
session.findById("wnd[0]/tbar[0]/btn[12]").press
session.findById("wnd[0]/tbar[0]/btn[12]").press
end if 


