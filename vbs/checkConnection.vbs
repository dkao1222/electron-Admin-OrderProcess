If Not IsObject(application) Then
    Set SapGuiAuto  = GetObject("SAPGUI")
    Set application = SapGuiAuto.GetScriptingEngine
End If

If Not IsObject(connection) Then
    Set connection = application.Children(0)
End If
Set objStdOut = WScript.StdOut
OpenWin = 0

For i = 0 To connection.children.count - 1

	Set session = Connection.Children(CInt(i))

	If session.busy = false Then

			Set window = session.activewindow

		If window.iconic = false Then

			OpenWin = OpenWin + 1

		End If

	End If

Next

For i = 0 to 5 Step 1 'i is the counter variable and it is incremented by 2

j = i + 1
if j > OpenWin Then
	session.findById("wnd[0]").Maximize
	session.findById("wnd[0]/tbar[0]/okcd").text = "/ovt02n"
	session.findById("wnd[0]").sendVKey 0
end if


Next

objStdOut.Write OpenWin