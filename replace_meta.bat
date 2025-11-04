@echo off
for /r public %%f in (*.html) do (
    powershell -Command "(Get-Content '%%f' -Raw) -replace 'content=\"assets/', 'content=\"./assets/' | Set-Content '%%f'"
)
