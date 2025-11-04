@echo off
for /r public %%f in (*.html) do (
    powershell -Command "(Get-Content '%%f' -Raw) -replace 'href=\"assets/', 'href=\"./assets/' | Set-Content '%%f'"
)
