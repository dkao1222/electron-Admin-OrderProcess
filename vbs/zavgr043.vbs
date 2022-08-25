' WScript.Arguments(0) sap child
' WScript.Arguments(1) shipment

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
session.findById("wnd[0]/tbar[1]/btn[17]").press
session.findById("wnd[1]/usr/txtENAME-LOW").text = WScript.Arguments(0)

session.findById("wnd[1]/usr/txtENAME-LOW").setFocus
session.findById("wnd[1]/usr/txtENAME-LOW").caretPosition = 7
session.findById("wnd[1]").sendVKey 0
session.findById("wnd[1]/tbar[0]/btn[8]").press
session.findById("wnd[1]/usr/cntlALV_CONTAINER_1/shellcont/shell").currentCellRow = 2
session.findById("wnd[1]/usr/cntlALV_CONTAINER_1/shellcont/shell").selectedRows = "3"
session.findById("wnd[1]/usr/cntlALV_CONTAINER_1/shellcont/shell").doubleClickCurrentCell
session.findById("wnd[0]/usr/ctxtS_ERDAT-LOW").text = FormatDateTime(dateadd("d",WScript.Arguments(1),dt),vbShortDate)

session.findById("wnd[0]/usr/ctxtS_ERDAT-LOW").setFocus
session.findById("wnd[0]/usr/ctxtS_ERDAT-LOW").caretPosition = 5


session.findById("wnd[0]/usr/ctxtP_VAR").text = "/X031651"
session.findById("wnd[0]/usr/ctxtP_SHTYP").setFocus
session.findById("wnd[0]/usr/ctxtP_SHTYP").caretPosition = 0

session.findById("wnd[0]").sendVKey 8


