@echo off
for /r . %%f in (*.html) do (
    powershell -Command "(Get-Content '%%f' -Raw) -replace '<footer>', '<!-- Native Banner Ad -->`n<script async=\"async\" data-cfasync=\"false\" src=\"//caravanexhale.com/7052d0aaba1e19d4bd88b765ce282259/invoke.js\"></script>`n<div id=\"container-7052d0aaba1e19d4bd88b765ce282259\"></div>`n<footer>' | Set-Content '%%f'"
)
