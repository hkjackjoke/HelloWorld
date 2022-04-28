# Introduction 

For product context see [Pet Product Page](https://dev.azure.com/schsnz/Southern%20Cross/_wiki/wikis/Southern%20Cross.wiki/9615)
For solution overview, see https://dev.azure.com/schsnz/Southern%20Cross/_wiki/wikis/Southern%20Cross.wiki/9577

# Developer Guidance

Where?

# Desktop Build

To perform a local build based on how the pipeline performs build, you need to install Visual Studio 2019 (if you have not installed this, subsequent steps can be used to install it) and VSWhere. Install CDAF

    . { iwr -useb https://cdaf.io/static/app/downloads/cdaf.ps1 } | iex
    .\automation\provisioning\base.ps1 vswhere

To install Visual Studio 2019 automatically, use the edition appropriate for your MSDN subscription

    .\automation\provisioning\base.ps1 visualstudio2019professional
    .\automation\provisioning\base.ps1 visualstudio2019enterprise
 
# Source Configuration

Private Source configuration required, list your existing configuration

    nuget sources list

If the source has been defined, i.e. in Visual Studio, update with Artefact reader PAT

    NuGet sources update -Name "Southern Cross" -Source "https://pkgs.dev.azure.com/schsnz/_packaging/SouthernCross%40Local/nuget/v3/index.json" -UserName "." -Password "********************"

If not defined, add the definition with credentials

    NuGet sources add -Name "Southern Cross" -Source "https://pkgs.dev.azure.com/schsnz/_packaging/SouthernCross%40Local/nuget/v3/index.json" -UserName "." -Password "********************"
