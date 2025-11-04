@echo off
for %%f in (*.html) do (
    powershell -Command "(Get-Content '%%f' -Raw) -replace 'href=\"assets/', 'href=\"/assets/' -replace 'src=\"./assets/', 'src=\"/assets/' -replace 'content=\"./assets/', 'content=\"/assets/' | Set-Content '%%f'"
)
