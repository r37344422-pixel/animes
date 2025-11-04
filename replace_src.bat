@echo off
for /r public %%f in (*.html) do (
    powershell -Command "(Get-Content '%%f' -Raw) -replace 'src=\"assets/', 'src=\"./assets/' | Set-Content '%%f'"
)
